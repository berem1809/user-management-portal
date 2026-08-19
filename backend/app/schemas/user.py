import uuid
from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict, EmailStr

from app.schemas.common import Paginated


class UserRead(BaseModel):
    id: uuid.UUID
    email: EmailStr
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PagedUsers(Paginated):
    items: List[UserRead]
