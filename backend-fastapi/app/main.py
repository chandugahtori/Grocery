from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import AsyncSessionLocal
from app.routers import auth, users, products, categories, cart, orders, admin

# ... (baaki startup logic aur logging same rahega)

app = FastAPI(
    title="Navix Grocery Store API",
    description="Full-stack grocery store backend — auth, products, cart, orders, and admin",
    version="1.0.0",
    lifespan=lifespan,
)

# ⭐ CORS UPDATE: Isko replace kar do
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Yeh "*" sabko allow kar dega, CORS error jad se khatam
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "navix-api"}