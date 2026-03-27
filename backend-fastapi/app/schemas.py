import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


# ─── AUTH ────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: str
    role: str


# ─── USER ────────────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    phone: Optional[str]
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None


# ─── CATEGORY ────────────────────────────────────────────────────────────────

class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    image_url: Optional[str]

    model_config = {"from_attributes": True}


# ─── PRODUCT ─────────────────────────────────────────────────────────────────

class ProductOut(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    description: Optional[str]
    price: float
    discount_price: Optional[float]
    stock: int
    unit: str
    category_id: int
    image_url: Optional[str]
    is_active: bool
    category: Optional[CategoryOut] = None

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    discount_price: Optional[float] = Field(None, gt=0)
    stock: int = Field(..., ge=0)
    unit: str = "1 pc"
    category_id: int
    image_url: Optional[str] = None
    is_active: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    discount_price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    unit: Optional[str] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class ProductListResponse(BaseModel):
    items: List[ProductOut]
    total: int
    page: int
    size: int
    pages: int


# ─── CART ────────────────────────────────────────────────────────────────────

class CartItemAdd(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(..., ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemOut(BaseModel):
    id: uuid.UUID
    product: ProductOut
    quantity: int

    model_config = {"from_attributes": True}


class CartOut(BaseModel):
    id: uuid.UUID
    items: List[CartItemOut]
    total: float

    model_config = {"from_attributes": True}


# ─── ORDER ───────────────────────────────────────────────────────────────────

class OrderCreate(BaseModel):
    address_line1: str = Field(..., min_length=5)
    address_line2: Optional[str] = None
    city: str = Field(..., min_length=2)
    state: str = Field(..., min_length=2)
    pincode: str = Field(..., min_length=6, max_length=10)
    payment_method: str = Field(default="cod")
    notes: Optional[str] = None


class OrderItemOut(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    product_name: str
    product_image_url: Optional[str]
    quantity: int
    price_at_purchase: float

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: uuid.UUID
    total_amount: float
    status: str
    address_line1: str
    address_line2: Optional[str]
    city: str
    state: str
    pincode: str
    notes: Optional[str]
    created_at: datetime
    items: List[OrderItemOut]

    model_config = {"from_attributes": True}


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|confirmed|processing|shipped|delivered|cancelled)$")


# ─── ANALYTICS ───────────────────────────────────────────────────────────────

class AnalyticsOut(BaseModel):
    total_users: int
    total_orders: int
    total_revenue: float
    orders_today: int
    revenue_today: float
    top_products: List[dict]
    orders_by_status: dict
    recent_orders: List[dict]
