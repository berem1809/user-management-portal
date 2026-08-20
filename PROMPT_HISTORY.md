# AI Assistant Workflow & Prompt History

**Candidate:** Piranaavei
**Project:** User Management Portal (Take-Home Assignment)

As per the assignment instructions, I utilized an AI coding assistant as a pair-programmer during the development of this project. My goal was to leverage the AI to handle boilerplate code and accelerate implementation while I strictly maintained control over the system architecture, state management patterns, and security flows.

Below is a detailed breakdown of my workflow and the mandatory, architectural prompts I used to guide the AI.

---

## 🏗️ Workflow Summary

My approach to using AI was highly directive. Instead of asking the AI to "build the app," I broke the assignment down into the provided User Stories and tackled them sequentially.

1. **Pre-Integration Setup:** Analyzed the provided FastAPI backend (via Swagger/Postman) and initialized the Next.js frontend with Redux Toolkit and Material UI.
2. **Authentication Flow Implementation:** Directed the AI to implement the 2FA state machine (Login -> Pending Token -> OTP) ensuring strictly separated routes and Redux-driven API calls.
3. **Core Dashboard Features:** Guided the AI to build the DataGrid, implement server-side pagination, and craft a debounced live search to optimize network requests.
4. **Resilient Error Handling:** Specifically instructed the AI to parse the FastAPI `422 Unprocessable Entity` JSON array format to prevent React render crashes and provide clean, human-readable error messages via Snackbars.
5. **Code Review & Refactoring:** Reviewed the AI's generated output, enforcing DRY principles (e.g., merging separate Create/Edit forms into a single reusable `<UserFormModal>`).

---

## 📜 Key Architectural Prompts

Below is a chronological summary of the most impactful, high-level prompts I used to direct the AI.

### Phase 1: Authentication & Security Architecture
*I started by providing the exact user stories and enforcing the technical constraints of the assignment (Redux).*

> **Prompt (Feature Execution):** "1) Login: As a user, I want to log in using my credentials so that I can access the system securely. The login page must validate required fields and show friendly error messages for invalid input or failed authentication. On successful login, store the authentication token (as per backend response) and redirect the user to the OTP verification page. **Constraint: All login API calls must be triggered via Redux actions/thunks, not direct calls in components.**"

> **Prompt (Security Guarding):** "2) OTP Verification: As a user, I want to verify an OTP after login so that I can complete authentication. The OTP page should allow entering the OTP and submitting it for verification via a Redux-based API call. **Constraint: Prevent access to protected pages unless both the initial login AND OTP verification are completed successfully.**"

### Phase 2: User Experience (UX) Enhancements
*Once the base logic worked, I directed the AI to improve the user interface to ensure the application felt modern and responsive.*

> **Prompt (UX Flow):** "After a successful login, instead of redirecting immediately and jarringly, implement a local state to display a success Dialog/Snackbar ('Login successful! Redirecting to OTP...'). Make the transition smooth and user-friendly."

> **Prompt (Network Optimization):** "Refactor the live search input on the Dashboard. Currently, it fires an API call on every keystroke (`onChange`). Implement a 500ms `setTimeout` debounce mechanism so we only dispatch the `setSearch` Redux action when the user pauses typing. This will prevent overloading the backend."

### Phase 3: Error Handling & System Resilience
*I discovered a friction point between the FastAPI backend and the React frontend regarding validation errors, and directed the AI to handle it safely.*

> **Prompt (Error Parsing):** "The backend is returning a `422 Unprocessable Entity` when form validation fails. FastAPI returns this as a JSON array (`[{ loc: [...], msg: "..." }]`). Currently, passing this raw array into the Redux state is causing React to crash ('Objects are not valid as a React child'). Update the `catch` blocks in `loginThunk` and `updateUserThunk` to safely parse this array, extract the first `msg` string, and store only that string in Redux so the UI can display it safely."

### Phase 4: State Management Refinement
*I ensured the AI optimized the global state to reduce unnecessary network traffic.*

> **Prompt (Optimistic UI):** "When the admin toggles a user's Active/Inactive status, do not make a second API call to re-fetch the entire paginated list of users. Instead, in the `changeUserStatusThunk.fulfilled` reducer, use the returned updated user object to find their index in the Redux `users` array and overwrite that specific object locally. The UI should update instantly."
