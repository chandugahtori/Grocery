import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.database import get_db
from app.models import Order, OrderItem, Payment, Cart, CartItem, Product, User
from app.schemas import OrderCreate, OrderOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderOut, status_code=201)
async def place_order(
    payload: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Load user's cart
    cart_result = await db.execute(
        select(Cart)
        .options(selectinload(Cart.items).selectinload(CartItem.product))
        .where(Cart.user_id == current_user.id)
    )
    cart = cart_result.scalar_one_or_none()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Validate stock and calculate total
    total = 0.0
    for item in cart.items:
        if item.product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {item.product.name}",
            )
        price = float(item.product.discount_price or item.product.price)
        total += price * item.quantity

    # Create order
    order = Order(
        user_id=current_user.id,
        total_amount=round(total, 2),
        address_line1=payload.address_line1,
        address_line2=payload.address_line2,
        city=payload.city,
        state=payload.state,
        pincode=payload.pincode,
        notes=payload.notes,
    )
    db.add(order)
    await db.flush()

    # Create order items & reduce stock
    for item in cart.items:
        price = float(item.product.discount_price or item.product.price)
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=price,
            product_name=item.product.name,
            product_image_url=item.product.image_url,
        )
        db.add(order_item)
        item.product.stock -= item.quantity

    # Create payment record
    payment = Payment(
        order_id=order.id,
        amount=total,
        method=payload.payment_method,
        status="pending",
    )
    db.add(payment)

    # Clear cart
    for item in cart.items:
        await db.delete(item)

    await db.flush()

    # Reload order with items
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order.id)
    )
    return result.scalar_one()


@router.get("", response_model=List[OrderOut])
async def get_orders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(
    order_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id, Order.user_id == current_user.id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
