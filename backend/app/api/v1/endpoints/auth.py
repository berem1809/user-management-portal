import logging
import random
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_settings_dependency, get_current_user
from app.core.security import create_token, get_password_hash, verify_password
from app.models.otp_session import OtpSession
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, VerifyOtpRequest, VerifyOtpResponse
from app.core.config import Settings

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)


def _generate_otp() -> str:
    return f"{random.randint(0, 999999):06d}"


@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dependency),
) -> LoginResponse:
    stmt = select(User).where(User.email == payload.email)
    user = db.scalar(stmt)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")

    otp_code = _generate_otp()
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=settings.otp_expire_seconds)
    otp_session = OtpSession(user_id=user.id, otp_code=otp_code, expires_at=expires_at)
    db.add(otp_session)
    db.commit()

    logger.info("[OTP] user=%s otp=%s expires_in=%ss", user.email, otp_code, settings.otp_expire_seconds)

    pending_token = create_token(
        data={"sub": str(user.id), "otp_verified": False, "type": "pending"},
        expires_delta=timedelta(seconds=settings.pending_token_expire_seconds),
    )
    return LoginResponse(
        pending_token=pending_token,
        expires_in=settings.pending_token_expire_seconds,
    )


@router.post("/verify-otp", response_model=VerifyOtpResponse)
def verify_otp(
    payload: VerifyOtpRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings_dependency),
) -> VerifyOtpResponse:
    if getattr(current_user, "_token_type", "") != "pending":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Pending token required")

    stmt = (
        select(OtpSession)
        .where(OtpSession.user_id == current_user.id)
        .order_by(OtpSession.created_at.desc())
    )
    otp_session = db.scalars(stmt).first()
    if not otp_session:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No OTP session found")

    now = datetime.now(timezone.utc)
    if otp_session.verified_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP already verified")
    if now > otp_session.expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP expired")

    if payload.otp != otp_session.otp_code:
        otp_session.attempts += 1
        db.add(otp_session)
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid OTP")

    otp_session.verified_at = now
    db.add(otp_session)
    db.commit()

    access_token = create_token(
        data={"sub": str(current_user.id), "otp_verified": True, "type": "access"},
        expires_delta=timedelta(seconds=settings.access_token_expire_seconds),
    )
    return VerifyOtpResponse(
        access_token=access_token,
        expires_in=settings.access_token_expire_seconds,
    )
