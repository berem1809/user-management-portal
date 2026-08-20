# Prompt History & Workflow

I used AI only to make coding more efficient. I made the architecture and security decisions, gave AI scoped tasks, and reviewed and corrected the generated code.

Before coding, I read the backend and tested the login → OTP verification flow manually using Swagger and Postman. This helped me understand the API flow, token handling, and FastAPI 422 error structure.

For Auth, I asked AI to implement the login flow through Redux thunks, then corrected it to follow the two-token 2FA flow and protected the OTP and dashboard routes.

For List/Search/Pagination, I asked AI to add search and pagination, then added the 500ms debounce and reset the page when the search changed.

For Create/Edit, I asked AI to build the user form, then combined the separate forms into one reusable UserFormModal and fixed its reset behavior when switching users.

For Error Handling, I identified the 422 crash and instructed AI to handle FastAPI's nested error response by extracting the msg instead of storing the raw array.

For Status Toggle, I instructed AI to update only the affected user in Redux after a successful API response instead of refetching the entire list.

###  Me vs AI
I made the architecture and technical decisions and handled the important logic, security flow, debugging, and corrections. AI was mainly used to speed up implementation, boilerplate, and UI wiring. Nothing was included that I couldn't explain.
