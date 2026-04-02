from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import logging

from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin, Token, UserOut
from app.utils.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger("navix.auth")


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    logger.info(f"Register attempt: {payload.email}")

    # Check existing email
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        logger.warning(f"Register failed — email already exists: {payload.email}")
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        user = User(
            name=payload.name,
            email=payload.email,
            password_hash=hash_password(payload.password),
            phone=payload.phone,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)
        logger.info(f"Register success: {user.email} (id={user.id})")
        return user
    except Exception as e:
        logger.error(f"Register error for {payload.email}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Registration failed. Please try again.")


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    logger.info(f"Login attempt: {payload.email}")

    try:
        result = await db.execute(select(User).where(User.email == payload.email))
        user = result.scalar_one_or_none()

        # Step 1: email not found
        if not user:
            logger.warning(f"Login failed — no account with email: {payload.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No account found with this email address",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 2: wrong password
        if not verify_password(payload.password, user.password_hash):
            logger.warning(f"Login failed — wrong password for: {payload.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password. Please try again.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 3: account deactivated
        if not user.is_active:
            logger.warning(f"Login failed — account deactivated: {payload.email}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been deactivated. Contact support.",
            )

        access_token = create_access_token({"sub": str(user.id), "role": user.role})
        logger.info(f"Login success: {user.email} (role={user.role})")
        return {"access_token": access_token, "token_type": "bearer"}

    except HTTPException:
        raise  # re-raise known errors as-is
    except Exception as e:
        logger.error(f"Login unexpected error for {payload.email}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Login failed due to a server error. Please try again.")
