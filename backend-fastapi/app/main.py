from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import AsyncSessionLocal
from app.routers import auth, users, products, categories, cart, orders, admin

# 1. Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger("navix.startup")

# 2. Admin User Logic
async def ensure_admin_user():
    from sqlalchemy import select
    from app.models import User
    from app.utils.auth import hash_password

    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(
                select(User).where(User.email == "admin@navix.com")
            )
            admin_user = result.scalar_one_or_none()
            fresh_hash = hash_password("Admin@1234")
            if admin_user is None:
                admin_user = User(
                    name="Navix Admin",
                    email="admin@navix.com",
                    password_hash=fresh_hash,
                    role="admin",
                )
                session.add(admin_user)
                logger.info("Admin user created on startup.")
            else:
                admin_user.password_hash = fresh_hash
                session.add(admin_user)
                logger.info("Admin user password refreshed on startup.")
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Failed to ensure admin user: {e}")

# 3. Lifespan Definition (ISKO APP SE UPAR RAKHNA HAI ⭐)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await ensure_admin_user()
    yield
    # Shutdown logic

# 4. FastAPI App Initialization
app = FastAPI(
    title="Navix Grocery Store API",
    description="Full-stack grocery store backend — auth, products, cart, orders, and admin",
    version="1.0.0",
    lifespan=lifespan, # Ab Python ko pata hai ki lifespan upar defined hai
)

# 5. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Sabhi origins allowed hain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 6. Routers (Prefix /api ke sath)
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