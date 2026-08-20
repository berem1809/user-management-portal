**Prompt history:** I used AI only to make coding more efficient. I made the architecture and security decisions, gave it scoped tasks, and reviewed and corrected the generated code.

I first read the backend and tested login → OTP verification manually using Swagger and Postman. This helped me understand the API flow, token handling, and FastAPI 422 error structure.

For **Auth**, I implemented the two-token 2FA flow and protected the OTP and dashboard routes.

For **List/Search/Pagination**, I added 500ms debouncing and reset pagination when the search changed.

For **Create/Edit**, I combined the forms into one reusable `UserFormModal` and fixed its reset behavior.

For **Error Handling**, I fixed the 422 crash by extracting the API error message instead of storing the raw array.

For **Status Toggle**, I updated only the affected user in Redux instead of refetching the whole list.

**Me vs AI:** I made the technical decisions and handled the important logic and fixes. AI was used mainly to speed up implementation, boilerplate, and UI wiring. Nothing was included that I couldn't explain.
