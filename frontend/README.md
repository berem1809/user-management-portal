# 🎨 User Management Portal - Frontend

Welcome to the frontend of our User Management Portal! 👋 

This part of the app is built with **Next.js** (App Router) and **React**, styled beautifully with **Material UI (MUI)**, and powered by **Redux Toolkit** for state management. It's designed to be fast, responsive, and easy to work with.

Here’s a quick, human-friendly guide to getting this up and running on your local machine.

---

## 🚀 Getting Started

Let's get you set up in just a few minutes! 

### 1. What You'll Need (Prerequisites)
Before we begin, make sure you have:
- **Node.js** installed (version 18 or higher is recommended).
- **npm** (which comes with Node.js) to install our packages.

*(P.S. Make sure the Python backend is already running—check out the backend instructions if you haven't done that yet!)*

### 2. 📦 Install Dependencies
First things first, let's grab all the necessary packages. Open your terminal, make sure you're inside the `frontend` folder, and run:

```bash
npm install
```
*Go grab a quick coffee ☕ while npm does its magic!*

### 3. ⚙️ Configuration (Environment Variables)
We need to tell our frontend where to find the backend API. 

Create a new file named `.env.local` right here in the `frontend` directory. Add this single line to it:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
*(If your backend is running on a different port or server, just swap out the URL!)*

### 4. Run the App!
You're all set! Let's fire up the development server:

```bash
npm run dev
```

The frontend is now alive. Open your favorite browser and head over to:
**[http://localhost:3000](http://localhost:3000)**

---

## How to Use It

1. **Log In:** Use the default admin credentials (`admin@venturit.com` / `Asdf123!`).
2. **OTP Check:** Peek at your backend terminal for a 6-digit code to complete the login.
3. **Explore:** You'll land on the dashboard where you can add, edit, or manage users with ease!

---

## What's Under the Hood?
Curious about the tech stack? Here's what we're using:
- **Next.js (App Router)** & **React 19** 
- **Redux Toolkit** (All API calls go through Redux thunks—no local state for API responses!)
- **Material UI (MUI)** for that sleek, modern look.
- **React Hook Form** + **Yup** for painless form validation.
- **Axios** for smooth HTTP requests.

Happy coding! If you run into any snags, double-check your `.env.local` file and make sure the backend is humming along happily.
