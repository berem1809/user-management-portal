# Frontend - User Management Portal

Hey there! 👋 This is the frontend for the User Management Portal. It's built with Next.js and talks directly to our Python backend to handle all the user management stuff. 

## What's inside?

- **Login & OTP:** We have a two-step login process. You punch in your credentials, and then grab an OTP to actually get in.
- **Redux Everywhere:** As a strict rule for this project, all API calls and state management go through Redux Toolkit (specifically using thunks). We aren't handling API responses in local component state.
- **The UI:** It's all Material UI (MUI), but I've tweaked the theme a bit so it looks softer and a bit more modern than the out-of-the-box Material look. 
- **Forms:** We're using `react-hook-form` paired with Yup to keep form validation clean and out of our way.
- **Dashboard:** A central hub where you can view a list of users, search for specific people (with debouncing, so we don't spam the API), add new folks, edit details, and toggle them active or inactive.

## Tech Stack

Here's the main gear powering this thing:
- Next.js (App Router)
- React 19 & TypeScript
- Redux Toolkit & React-Redux
- Material UI (MUI)
- Axios (for API requests)
- React Hook Form + Yup

## How to get it running

### 1. Prerequisites
You'll need Node.js (v18+) and npm installed. Also, make sure the backend API is up and running via Docker Compose (check the backend's README for that).

### 2. Install dependencies
Drop into the `frontend` directory and grab the packages:
```bash
cd frontend
npm install
```

### 3. Environment Variables
By default, the app tries to hit the backend at `http://localhost:8000/api/v1`. 
If your backend is running somewhere else, just create a `.env.local` file in the `frontend` directory and drop your URL in there:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 4. Fire it up!
Start the Next.js dev server:
```bash
npm run dev
```
Then, just open up your browser and hit `http://localhost:3000`.

## Quick Usage Guide
1. **Login:** Grab the admin credentials from the backend setup (`admin@venturit.com` / `Asdf123!`).
2. **OTP:** Check your terminal output where the backend Docker container is running. It'll spit out a 6-digit OTP code for you to use on the verification screen.
3. **Manage Users:** Once you're in, you'll land on the dashboard. From there, you can start creating, editing, and managing users!
