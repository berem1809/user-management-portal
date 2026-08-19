import uuid
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User


async def get_authorization_header(authorization: Annotated[str | None, Header()] = None) -> str:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")
    try:
        scheme, token = authorization.split(" ", 1)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header") from exc
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid scheme")
    return token


def get_current_user(
    token: Annotated[str, Depends(get_authorization_header)], db: Annotated[Session, Depends(get_db)]
) -> User:
    try:
        payload = decode_token(token)
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    user_id = payload.get("sub")
    otp_verified = payload.get("otp_verified")
    token_type = payload.get("type")
    if not user_id or token_type not in {"pending", "access"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = db.get(User, uuid.UUID(str(user_id)))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    setattr(user, "_otp_verified", bool(otp_verified))
    setattr(user, "_token_type", token_type)
    return user


def require_active_user(user: Annotated[User, Depends(get_current_user)]) -> User:
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    return user


def require_verified_user(user: Annotated[User, Depends(require_active_user)]) -> User:
    if not getattr(user, "_otp_verified", False):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="OTP not verified")
    return user


def get_settings_dependency():
    return get_settings()
