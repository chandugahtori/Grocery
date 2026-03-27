import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Cart, CartItem, Product, User
from app.schemas import CartOut, CartItemAdd, CartItemUpdate, CartItemOut
from app.dependencies import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


async def get_or_create_cart(user: User, db: AsyncSession) -> Cart:
    result = await db.execute(
        select(Cart)
        .options(selectinload(Cart.items).selectinload(CartItem.product).selectinload(Product.category))
        .where(Cart.user_id == user.id)
    )
    cart = result.scalar_one_or_none()
    if not cart:
        cart = Cart(user_id=user.id)
        db.add(cart)
        await db.flush()
        await db.refresh(cart)
        cart.items = []
    return cart


@router.get("", response_model=CartOut)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart = await get_or_create_cart(current_user, db)
    total = sum(
        float(item.product.discount_price or item.product.price) * item.quantity
        for item in cart.items
    )
    return CartOut(id=cart.id, items=cart.items, total=round(total, 2))


@router.post("/items", response_model=CartOut, status_code=201)
async def add_item(
    payload: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Validate product
    prod_result = await db.execute(
        select(Product).where(Product.id == payload.product_id, Product.is_active == True)
    )
    product = prod_result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    cart = await get_or_create_cart(current_user, db)

    # Check if already in cart
    existing_result = await db.execute(
        select(CartItem).where(
            CartItem.cart_id == cart.id, CartItem.product_id == payload.product_id
        )
    )
    existing = existing_result.scalar_one_or_none()
    if existing:
        existing.quantity += payload.quantity
        db.add(existing)
    else:
        item = CartItem(cart_id=cart.id, product_id=payload.product_id, quantity=payload.quantity)
        db.add(item)

    await db.flush()
    return await get_cart(current_user, db)


@router.put("/items/{item_id}", response_model=CartOut)
async def update_item(
    item_id: uuid.UUID,
    payload: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart = await get_or_create_cart(current_user, db)
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    # Validate stock before updating quantity
    prod_result = await db.execute(select(Product).where(Product.id == item.product_id))
    product = prod_result.scalar_one_or_none()
    if product and product.stock < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    item.quantity = payload.quantity
    db.add(item)
    await db.flush()
    return await get_cart(current_user, db)


@router.delete("/items/{item_id}", response_model=CartOut)
async def remove_item(
    item_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart = await get_or_create_cart(current_user, db)
    result = await db.execute(
        select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    await db.delete(item)
    await db.flush()
    return await get_cart(current_user, db)


@router.delete("", status_code=204)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    cart = await get_or_create_cart(current_user, db)
    for item in cart.items:
        await db.delete(item)
    await db.flush()
