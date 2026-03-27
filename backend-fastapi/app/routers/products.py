import math
import uuid
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Product, Category
from app.schemas import ProductOut, ProductListResponse

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
async def list_products(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.is_active == True)
    )
    count_query = select(func.count(Product.id)).where(Product.is_active == True)

    if category:
        # Try slug first, then try numeric id
        cat_filter = Category.slug == category
        try:
            cat_filter = cat_filter | (Category.id == int(category))
        except (ValueError, TypeError):
            pass
        cat_result = await db.execute(
            select(Category).where(cat_filter)
        )
        cat = cat_result.scalar_one_or_none()
        if cat:
            query = query.where(Product.category_id == cat.id)
            count_query = count_query.where(Product.category_id == cat.id)

    if min_price is not None:
        query = query.where(Product.price >= min_price)
        count_query = count_query.where(Product.price >= min_price)
    if max_price is not None:
        query = query.where(Product.price <= max_price)
        count_query = count_query.where(Product.price <= max_price)

    total = (await db.execute(count_query)).scalar()
    offset = (page - 1) * size
    result = await db.execute(query.offset(offset).limit(size).order_by(Product.name))
    items = result.scalars().all()

    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total else 0,
    )


@router.get("/search", response_model=ProductListResponse)
async def search_products(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    pattern = f"%{q}%"
    query = (
        select(Product)
        .options(selectinload(Product.category))
        .where(
            Product.is_active == True,
            or_(Product.name.ilike(pattern), Product.description.ilike(pattern)),
        )
    )
    count_query = select(func.count(Product.id)).where(
        Product.is_active == True,
        or_(Product.name.ilike(pattern), Product.description.ilike(pattern)),
    )

    total = (await db.execute(count_query)).scalar()
    offset = (page - 1) * size
    result = await db.execute(query.offset(offset).limit(size))
    items = result.scalars().all()

    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total else 0,
    )


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product)
        .options(selectinload(Product.category))
        .where(Product.id == product_id, Product.is_active == True)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
