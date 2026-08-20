# User Management Portal — Frontend

Next.js frontend for the User Management Portal, built against the provided FastAPI backend. Login → OTP → a searchable, paginated user list where you can create, edit, and activate/deactivate users.

Stack was set by the assignment: Next.js (App Router), Redux for all API calls, Material UI. I added React Hook Form + Yup for the forms since that part was left open.

## Running it

You'll need Node 18+ and the backend already running (start that first — this won't do anything without it).

```bash
cd frontend
npm install
```

Create `.env.local` in the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Then:

```bash
npm run dev
```

Open http://localhost:3000.

## Logging in

Two steps, and the second one caught me out at first so worth spelling out:

1. Sign in with the seeded admin: `admin@venturit.com` / `Asdf123!`
2. It'll ask for a 6-digit OTP. That code isn't emailed or sent anywhere — the backend prints it to its terminal. Check the backend window, grab the code, enter it.

If the OTP screen kicks you back to login, the login step didn't complete — try again and watch the backend log.

## How it's put together

A few notes in case you're reading the code.

**Auth uses two tokens.** Login doesn't give you the real token straight away — the backend returns a `pending_token` that can only be used to verify the OTP. Once the OTP checks out, that gets swapped for the actual access token, which is what the protected pages need. So the OTP is a real second step, not just a screen.

**All API calls go through Redux thunks.** No fetch/axios inside components — components dispatch a thunk, the thunk (in `authSlice` or `userSlice`) does the request and updates the store, the component just renders the result. This was a hard requirement in the brief and honestly I think it's the right call for keeping the logic in one place.

**Token gets attached automatically** via an Axios interceptor in `utils/api.ts`, so I don't have to remember the auth header on every call.

**Search + pagination are server-side.** The list only pulls one page at a time. Search is debounced (~500ms) so it's not firing on every keystroke, and starting a new search resets you to page 0 — otherwise you can end up on page 5 of a one-result search staring at an empty table.

**Create and edit share one modal** — pass it a user and it's edit mode, pass nothing and it's create.

## Structure

```
src/
├── app/
│   ├── (auth)/        login + otp (route group so they skip the dashboard layout)
│   └── dashboard/     protected pages, layout.tsx handles the auth check
├── components/        the modals (confirmation + user form)
├── store/             redux slices + typed hooks
├── types/             shared TS types
└── utils/             axios instance + MUI theme
```

