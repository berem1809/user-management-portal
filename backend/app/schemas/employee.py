import uuid
from datetime import date, datetime
from enum import Enum
from typing import List

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.common import Paginated


class EmployeeStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class EmployeeBase(BaseModel):
    title: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    date_of_birth: date
    internal_note: str | None = None
    hire_date: date
    status: EmployeeStatus = EmployeeStatus.ACTIVE
    email: EmailStr
    phone: str | None = None
    department: str | None = None
    job_title: str | None = None
    employee_code: str
    address: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None

    model_config = ConfigDict(use_enum_values=True)

class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    title: str | None = None
    first_name: str | None = None
    middle_name: str | None = None
    last_name: str | None = None
    date_of_birth: date | None = None
    internal_note: str | None = None
    hire_date: date | None = None
    status: EmployeeStatus | None = None
    email: EmailStr | None = None
    phone: str | None = None
    department: str | None = None
    job_title: str | None = None
    employee_code: str | None = None
    address: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None

    model_config = ConfigDict(use_enum_values=True)


class EmployeeRead(EmployeeBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, use_enum_values=True)


class PagedEmployees(Paginated):
    items: List[EmployeeRead]
