import math
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List

from app.database import get_db
from app.models import Product, Order, OrderItem, User
from app.schemas import (
    ProductCreate, ProductUpdate, ProductOut,
    OrderOut, OrderStatusUpdate, AnalyticsOut, ProductListResponse,
)
from app.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


# ─── PRODUCTS ────────────────────────────────────────────────────────────────

def slugify(name: str) -> str:
    import re
    slug = name.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    slug = re.sub(r"^-+|-+$", "", slug)
    return slug


@router.get("/products", response_model=ProductListResponse)
async def admin_list_products(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    total = (await db.execute(select(func.count(Product.id)))).scalar()
    offset = (page - 1) * size
    result = await db.execute(
        select(Product)
        .options(selectinload(Product.category))
        .offset(offset).limit(size)
        .order_by(Product.created_at.desc())
    )
    return ProductListResponse(
        items=result.scalars().all(),
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total else 0,
    )


@router.post("/products", response_model=ProductOut, status_code=201)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    slug = slugify(payload.name)
    existing = await db.execute(select(Product).where(Product.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    product = Product(slug=slug, **payload.model_dump())
    db.add(product)
    await db.flush()
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.id == product.id)
    )
    return result.scalar_one()


@router.put("/products/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: uuid.UUID,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)

    db.add(product)
    await db.flush()
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.id == product.id)
    )
    return result.scalar_one()


@router.delete("/products/{product_id}", status_code=204)
async def delete_product(
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    db.add(product)
    await db.flush()


# ─── ORDERS ──────────────────────────────────────────────────────────────────

@router.get("/orders", response_model=List[OrderOut])
async def admin_list_orders(
    status: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = select(Order).options(selectinload(Order.items))
    if status:
        query = query.where(Order.status == status)
    offset = (page - 1) * size
    result = await db.execute(query.order_by(Order.created_at.desc()).offset(offset).limit(size))
    return result.scalars().all()


@router.put("/orders/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: uuid.UUID,
    payload: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    db.add(order)
    await db.flush()
    await db.refresh(order)
    return order


# ─── USERS ───────────────────────────────────────────────────────────────────

@router.get("/users", response_model=List[dict])
async def admin_list_users(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    offset = (page - 1) * size
    result = await db.execute(
        select(User).where(User.role == "user").offset(offset).limit(size).order_by(User.created_at.desc())
    )
    users = result.scalars().all()
    return [
        {"id": str(u.id), "name": u.name, "email": u.email, "phone": u.phone, "is_active": u.is_active, "created_at": u.created_at.isoformat()}
        for u in users
    ]


# ─── ANALYTICS ───────────────────────────────────────────────────────────────

@router.get("/analytics", response_model=AnalyticsOut)
async def get_analytics(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    today = datetime.now(timezone.utc).date()

    total_users = (await db.execute(select(func.count(User.id)).where(User.role == "user"))).scalar()
    total_orders = (await db.execute(select(func.count(Order.id)))).scalar()
    total_revenue = (await db.execute(select(func.sum(Order.total_amount)).where(Order.status != "cancelled"))).scalar() or 0
    orders_today = (await db.execute(
        select(func.count(Order.id)).where(func.date(Order.created_at) == today)
    )).scalar()
    revenue_today = (await db.execute(
        select(func.sum(Order.total_amount)).where(
            func.date(Order.created_at) == today,
            Order.status != "cancelled",
        )
    )).scalar() or 0

    # Top products by quantity sold
    top_q = await db.execute(
        select(OrderItem.product_name, func.sum(OrderItem.quantity).label("qty"))
        .group_by(OrderItem.product_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
    )
    top_products = [{"name": r.product_name, "qty": int(r.qty)} for r in top_q]

    # Orders by status
    status_q = await db.execute(
        select(Order.status, func.count(Order.id)).group_by(Order.status)
    )
    orders_by_status = {r[0]: r[1] for r in status_q}

    # Recent orders
    recent_q = await db.execute(
        select(Order, User.name.label("user_name"), User.email.label("user_email"))
        .join(User, Order.user_id == User.id)
        .order_by(Order.created_at.desc())
        .limit(10)
    )
    recent_orders = [
        {
            "id": str(r.Order.id),
            "user_name": r.user_name,
            "user_email": r.user_email,
            "total_amount": float(r.Order.total_amount),
            "status": r.Order.status,
            "created_at": r.Order.created_at.isoformat(),
        }
        for r in recent_q
    ]

    return AnalyticsOut(
        total_users=total_users,
        total_orders=total_orders,
        total_revenue=float(total_revenue),
        orders_today=orders_today,
        revenue_today=float(revenue_today),
        top_products=top_products,
        orders_by_status=orders_by_status,
        recent_orders=recent_orders,
    )
