from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # Supabase credentials
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None

    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    # ⭐ FIX: extra='ignore' add kiya hai taaki unknown variables error na dein
    model_config = SettingsConfigDict(
        env_file=".env",
        extra='ignore' 
    )

settings = Settings()