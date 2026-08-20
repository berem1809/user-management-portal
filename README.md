# User Management Portal

A full-stack employee management dashboard built as a take-home assignment. It includes secure 2FA authentication, protected routes, user CRUD operations, search, and pagination.

## Features

* **2FA Authentication** — Login with email/password followed by OTP verification.
* **Protected Routes** — Dashboard is accessible only after completing authentication.
* **User Management** — Create, edit, and activate/deactivate users.
* **Search & Pagination** — Server-side pagination with 500ms debounced search.
* **Modern UI** — Built with MUI, Snackbars, animations, and confirmation dialogs.

## Tech Stack

**Frontend**

* Next.js (App Router)
* TypeScript
* Redux Toolkit & Thunks
* Material UI (MUI)
* React Hook Form & Yup

**Backend**

* FastAPI
* SQLite & SQLAlchemy
* Docker

## Getting Started

### Backend

```bash
cd backend
docker compose up --build
```

Backend: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Quick Usage

1. Open `http://localhost:3000`.
2. Login using the administrator credentials provided with the backend.
3. Complete the OTP verification. The OTP is printed in the backend terminal.
4. Manage users from the dashboard — search, create, edit, and toggle user status.


