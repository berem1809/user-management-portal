"""Seed the database with an admin user and demo employees.

This script is idempotent and can be re-run safely.
"""

import random
from datetime import date, timedelta

from sqlalchemy import func, select

from app.core.config import get_settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.employee import Employee, EmployeeStatus
from app.models.user import User

settings = get_settings()


def seed_admin(session):
    admin_email = "admin@venturit.com"
    admin_password = "Asdf123!"

    existing = session.scalar(select(User).where(User.email == admin_email))
    password_hash = get_password_hash(admin_password)

    if existing:
        existing.password_hash = password_hash
        existing.is_active = True
        session.add(existing)
        session.commit()
        session.refresh(existing)
        print(f"Admin user already exists: {admin_email} (password reset)")
        return existing

    admin = User(email=admin_email, password_hash=password_hash, is_active=True)
    session.add(admin)
    session.commit()
    session.refresh(admin)
    print(f"Created admin user: {admin_email}")
    return admin


def seed_employees(session):
    target_count = 30
    existing_count = session.scalar(select(func.count()).select_from(Employee)) or 0
    if existing_count >= target_count:
        print(f"Employees already seeded: {existing_count}")
        return

    titles = ["Mr", "Ms", "Dr", "Mx", "Mrs"]
    departments = ["Engineering", "Marketing", "Finance", "Support", "Operations", "HR"]
    job_titles = [
        "Software Engineer",
        "Product Manager",
        "Data Analyst",
        "Customer Success",
        "Accountant",
        "Recruiter",
        "Designer",
    ]

    employees = []
    base_date = date.today()
    for i in range(1, target_count + 1):
        first = f"Employee{i:02d}"
        last = random.choice(["Smith", "Johnson", "Taylor", "Brown", "Williams", "Miller", "Davis"])
        employee = Employee(
            title=random.choice(titles),
            first_name=first,
            middle_name=None,
            last_name=last,
            date_of_birth=base_date - timedelta(days=10000 + i * 30),
            internal_note="Seeded record for demo purposes",
            hire_date=base_date - timedelta(days=300 + i),
            status=EmployeeStatus.ACTIVE.value if i % 4 != 0 else EmployeeStatus.INACTIVE.value,
            email=f"{first.lower()}.{last.lower()}@example.com",
            phone=f"+1-555-01{i:03d}",
            department=random.choice(departments),
            job_title=random.choice(job_titles),
            employee_code=f"EMP-{i:04d}",
            address=f"{100 + i} Main Street",
            emergency_contact_name=f"Contact {i}",
            emergency_contact_phone=f"+1-555-99{i:03d}",
        )
        employees.append(employee)

    session.add_all(employees)
    session.commit()
    print(f"Seeded {len(employees)} employees")


def main():
    session = SessionLocal()
    try:
        seed_admin(session)
        seed_employees(session)
    finally:
        session.close()


if __name__ == "__main__":
    main()
