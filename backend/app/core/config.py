from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = Field(default="User Management Portal Service")
    api_v1_prefix: str = Field(default="/api/v1")
    secret_key: str = Field(default="change-me")
    access_token_expire_seconds: int = Field(default=3600)
    pending_token_expire_seconds: int = Field(default=300)
    otp_expire_seconds: int = Field(default=300)
    algorithm: str = Field(default="HS256")

    database_url: str = Field(..., alias="DATABASE_URL")

    cors_allowed_origins: str = Field(default="*", alias="CORS_ALLOWED_ORIGINS")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"
        populate_by_name = True

    @property
    def cors_allowed_origins_list(self) -> List[str]:
        value = self.cors_allowed_origins
        if isinstance(value, str):
            parsed = [origin.strip() for origin in value.split(",") if origin.strip()]
            return parsed or ["*"]
        return list(value) if value else ["*"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
