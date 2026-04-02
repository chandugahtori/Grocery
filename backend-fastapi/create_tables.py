"""
One-shot script to create all tables in Supabase using a DIRECT connection.
Supabase Transaction Pooler (port 6543) cannot run DDL — use port 5432 instead.

Run from backend-fastapi directory:
    python create_tables.py
"""
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine

# Load .env manually
from dotenv import load_dotenv
load_dotenv()

# Build a DIRECT connection URL (port 5432, no pooler)
# Replace port 6543 + pooler host with direct host on port 5432
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Convert pooler URL → direct URL automatically
# pooler: postgresql+asyncpg://postgres.REF:PASS@aws-1-REGION.pooler.supabase.com:6543/postgres
# direct: postgresql+asyncpg://postgres.REF:PASS@db.REF.supabase.com:5432/postgres
if "pooler.supabase.com" in DATABASE_URL:
    # Extract ref from user part: postgres.wyaywtiqgdarzsjdugea -> wyaywtiqgdarzsjdugea
    user_part = DATABASE_URL.split("://")[1].split(":")[0]  # postgres.wyaywtiqgdarzsjdugea
    ref = user_part.split(".")[-1]
    # Extract password
    after_user = DATABASE_URL.split("://")[1]
    password = after_user.split(":")[1].split("@")[0]
    DIRECT_URL = f"postgresql+asyncpg://postgres.{ref}:{password}@db.{ref}.supabase.com:5432/postgres"
    print(f"Using direct connection: postgresql+asyncpg://postgres.{ref}:***@db.{ref}.supabase.com:5432/postgres")
else:
    DIRECT_URL = DATABASE_URL
    print("Using DATABASE_URL as-is (no pooler detected)")

# Import models to register them with Base.metadata
from app.database import Base
from app import models  # noqa

async def main():
    engine = create_async_engine(
        DIRECT_URL,
        echo=True,
        pool_pre_ping=True,
    )
    print("\nConnecting to Supabase (direct)...")
    async with engine.begin() as conn:
        print("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
    print("\n✅ All tables created successfully!")

asyncio.run(main())
