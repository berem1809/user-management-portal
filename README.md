
# User Management Portal

A full-stack employee management dashboard built as a take-home assignment. This application features secure two-factor authentication, session handling, and a complete suite of CRUD operations for managing user records.

## Features

*   **Secure Authentication flow**: Includes initial login via credentials followed by a 2FA OTP verification step.
*   **Protected Routing**: Users cannot access the dashboard or user lists without first completing both authentication steps.
*   **User Management (CRUD)**: Create new users, edit existing user details, and toggle active/inactive statuses.
*   **Live Search & Pagination**: Integrated server-side pagination and debounced live search for efficiently browsing large numbers of user records.
*   **Modern UI/UX**: Built with Material UI (MUI) featuring smooth micro-animations, toast notifications (Snackbars), and confirmation modals for destructive actions.

## Technology Stack

### Frontend
*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **State Management**: Redux Toolkit (Thunks for API calls)
*   **Styling & UI**: Material UI (MUI) v5
*   **Form Validation**: React Hook Form with Yup resolvers

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: SQLite (via SQLAlchemy)
*   **Architecture**: Dockerized container

---

## Getting Started

### Prerequisites
Make sure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [Docker](https://www.docker.com/) (For running the backend)

### 1. Start the Backend (API & Database)
The backend is fully containerized. Open your terminal, navigate to the `backend` directory, and run Docker Compose:

```bash
cd backend
docker compose up --build
```
*Note: The backend runs on `http://localhost:8000`.*

### 2. Start the Frontend
Open a new terminal window, navigate to the `frontend` directory, install the dependencies, and start the Next.js development server:

```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend runs on `http://localhost:3000`.*

---

## 📖 Quick Usage Guide

1.  **Login**: Open your browser and navigate to `http://localhost:3000`. Use the default administrator credentials provided in the backend setup:
    *   **Email**: `admin@venturit.com`
    *   **Password**: `Asdf123!`
2.  **OTP Verification**: Once you log in, the backend will generate a 6-digit OTP. Look at the terminal output where your backend Docker container is running to find the OTP code. Enter it on the verification screen.
3.  **Manage Users**: Welcome to the dashboard! From here, you can browse the user list, search by name/email/code, and start creating or editing users.

## 📝 License
Venturit Inc © 2026. All rights reserved.
```
