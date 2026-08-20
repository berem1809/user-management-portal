# User Management Portal - Frontend

Welcome to the frontend of the **User Management Portal**!

This app is built with **Next.js, React, Material UI (MUI), and Redux Toolkit**. It is simple, responsive, and easy to use.

## Getting Started

### 1. Requirements

Before you start, make sure you have:

* **Node.js** version 18 or higher
* **npm**
* The **Python backend** running

### 2. Install Packages

Open your terminal and go to the `frontend` folder:

```bash
cd frontend
npm install
```

### 3. Set Up the Backend URL

Create a `.env.local` file inside the `frontend` folder and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. Start the App

Run:

```bash
npm run dev
```

Then open:

**http://localhost:3000**

## How to Use

1. **Login** using the admin account:

   * Email: `admin@venturit.com`
   * Password: `Asdf123!`

2. **Enter OTP:**
   After login, check the backend terminal for the 6-digit OTP and enter it.

3. **Manage Users:**
   After verification, you can view, search, add, edit, and manage users.

## Tech Stack

* **Next.js (App Router) & React 19**
* **TypeScript**
* **Redux Toolkit** — API calls are handled through Redux thunks.
* **Material UI (MUI)** — UI components and styling.
* **React Hook Form + Yup** — Form handling and validation.
* **Axios** — API requests.

If the app does not work, first check that the backend is running and that your `.env.local` file has the correct API URL.
