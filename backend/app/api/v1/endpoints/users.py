import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_verified_user
from app.models.user import User
from app.schemas.user import PagedUsers, UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=PagedUsers)
def list_users(
    *,
    db: Session = Depends(get_db),
    _: User = Depends(require_verified_user),
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
) -> PagedUsers:
    stmt = select(User)
    count_stmt = select(func.count()).select_from(User)

    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(User.email.ilike(pattern))
        count_stmt = count_stmt.where(User.email.ilike(pattern))

    stmt = stmt.order_by(User.updated_at.desc()).offset(offset).limit(limit)

    total = db.scalar(count_stmt) or 0
    items = db.scalars(stmt).all()
    return PagedUsers(items=items, limit=limit, offset=offset, total=total)


@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_verified_user),
) -> UserRead:
    try:
        uid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id")
    user = db.get(User, uid)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
