from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# For Supabase Transaction Pooler (pgbouncer):
#   - statement_cache_size=0  (required for pgbouncer)
#   - server_settings search_path=public (pooler resets search_path otherwise)
connect_args = {}
if "pooler.supabase.com" in settings.DATABASE_URL:
    connect_args["statement_cache_size"] = 0
    connect_args["server_settings"] = {"search_path": "public"}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
