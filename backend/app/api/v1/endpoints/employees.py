import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_verified_user
from app.models.employee import Employee, EmployeeStatus
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeRead,
    EmployeeStatus as EmployeeStatusSchema,
    EmployeeUpdate,
    PagedEmployees,
)
from app.models.user import User

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=PagedEmployees)
def list_employees(
    *,
    db: Session = Depends(get_db),
    _: User = Depends(require_verified_user),
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    search: Optional[str] = Query(default=None),
    status_filter: Optional[EmployeeStatusSchema] = Query(default=None, alias="status"),
) -> PagedEmployees:
    stmt = select(Employee)
    count_stmt = select(func.count()).select_from(Employee)

    conditions = []
    if search:
        pattern = f"%{search}%"
        conditions.append(
            or_(
                Employee.first_name.ilike(pattern),
                Employee.middle_name.ilike(pattern),
                Employee.last_name.ilike(pattern),
                Employee.email.ilike(pattern),
                Employee.employee_code.ilike(pattern),
            )
        )
    if status_filter:
        conditions.append(Employee.status == EmployeeStatus(status_filter.value))

    if conditions:
        stmt = stmt.where(*conditions)
        count_stmt = count_stmt.where(*conditions)

    stmt = stmt.order_by(Employee.created_at.desc()).offset(offset).limit(limit)

    total = db.scalar(count_stmt) or 0
    items = db.scalars(stmt).all()
    return PagedEmployees(items=items, limit=limit, offset=offset, total=total)


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_verified_user),
) -> EmployeeRead:
    existing_email = db.scalar(select(Employee).where(Employee.email == payload.email))
    if existing_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    existing_code = db.scalar(select(Employee).where(Employee.employee_code == payload.employee_code))
    if existing_code:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee code already exists")

    employee = Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/{employee_id}", response_model=EmployeeRead)
def update_employee(
    employee_id: uuid.UUID,
    payload: EmployeeUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_verified_user),
) -> EmployeeRead:
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    data = payload.model_dump(exclude_unset=True)

    if "email" in data:
        existing_email = db.scalar(
            select(Employee).where(Employee.email == data["email"], Employee.id != employee_id)
        )
        if existing_email:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    if "employee_code" in data:
        existing_code = db.scalar(
            select(Employee).where(Employee.employee_code == data["employee_code"], Employee.id != employee_id)
        )
        if existing_code:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Employee code already exists")

    for field, value in data.items():
        if field == "status":
            status_value = value.value if isinstance(value, EmployeeStatusSchema) else value
            setattr(employee, field, status_value)
        else:
            setattr(employee, field, value)

    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.patch("/{employee_id}/activate", response_model=EmployeeRead)
def activate_employee(
    employee_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_verified_user),
) -> EmployeeRead:
    return _update_status(employee_id, EmployeeStatus.ACTIVE, db)


@router.patch("/{employee_id}/deactivate", response_model=EmployeeRead)
def deactivate_employee(
    employee_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: User = Depends(require_verified_user),
) -> EmployeeRead:
    return _update_status(employee_id, EmployeeStatus.INACTIVE, db)


def _update_status(employee_id: uuid.UUID, status_value: EmployeeStatus, db: Session) -> EmployeeRead:
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    employee.status = status_value.value
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee
