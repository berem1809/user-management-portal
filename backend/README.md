# User Management Portal Service

Backend for a user/employee management portal built with FastAPI, SQLAlchemy, Postgres, and Alembic. It runs end-to-end with Docker Compose: database -> migrations -> seed -> API.

## Quick Docker Primer
- Docker images are templates (filesystem + metadata); containers are running instances of those images.
- Docker Compose orchestrates multiple containers together (services) with shared networks/volumes and startup order.
- In this project Compose starts Postgres, runs Alembic migrations, seeds data, then boots the API.

## Stack
- FastAPI + Uvicorn
- SQLAlchemy 2.x + psycopg (sync)
- Alembic for migrations
- JWT auth with OTP (printed to terminal logs only)
- Postgres with seeded admin + demo employees

## Prerequisites
- Docker + Docker Compose
- Python 3.11+ only if you want to run without containers

## Configuration
1. Copy env template: `cp .env.example .env`
2. Adjust values if needed. Defaults expect Compose networking:
   - `DATABASE_URL=postgresql+psycopg://app_user:app_pass@db:5432/app_db`
   - `SECRET_KEY` for JWT signing
   - `ACCESS_TOKEN_EXPIRE_SECONDS`, `PENDING_TOKEN_EXPIRE_SECONDS`, `OTP_EXPIRE_SECONDS`
   - `CORS_ALLOWED_ORIGINS` (comma-separated)

## Running with Docker Compose
- Build + start everything: `docker compose up --build`
- Stop services: `docker compose down`
- Reset everything (including DB volume): `docker compose down -v`
- View API logs: `docker compose logs -f api`
- View DB logs: `docker compose logs -f db`

Startup order enforced by Compose: `db` (healthcheck) → `migrate` (alembic upgrade head) → `seed` (admin + employees) → `api` (FastAPI on port 8000).

## Authentication & OTP
- Login: `POST /api/v1/auth/login` with email/password returns a short-lived `pending_token` (otp_verified=false) and logs a 6-digit OTP to stdout (look in container/terminal logs, not in the response).
- Verify OTP: `POST /api/v1/auth/verify-otp` with Authorization `Bearer <pending_token>` and body `{ "otp": "<code>" }` returns an `access_token` (otp_verified=true).
- All protected endpoints require the verified access token. OTP sessions are stored in plain text for demo purposes only.
- Seeded admin credentials: `admin@venturit.com / Asdf123!`

## API Endpoints (base path `/api/v1`)
- `POST /auth/login`
- `POST /auth/verify-otp`
- `GET /employees?limit&offset&search&status`
- `POST /employees`
- `PUT /employees/{employee_id}`
- `PATCH /employees/{employee_id}/activate`
- `PATCH /employees/{employee_id}/deactivate`
- `GET /users?limit&offset&search` (always sorted by updated_at desc)
- Health: `GET /health`

Swagger docs available at `http://localhost:8000/docs` once the API is up.

## Migrations
- Automatic: `migrate` service runs `alembic upgrade head` on startup.
- Manual run: `docker compose run --rm migrate alembic upgrade head`
- Create a new migration: `docker compose run --rm migrate alembic revision --autogenerate -m "add feature"`

## Seeding
- Automatic: `seed` service runs after migrations.
- Re-run manually: `docker compose run --rm seed python scripts/seed.py`
- Data includes the admin user above and 30 realistic employees (unique emails + employee codes). The seed is idempotent.

## Postman
- Collection: `postman/employee_mgmt.postman_collection.json`
- Environment: `postman/local.postman_environment.json` (contains `base_url`, `pending_token`, `access_token`, `employee_id`).
- Import both, run Login to capture `pending_token`, then Verify OTP to set `access_token`; other requests use the stored token automatically.

## Troubleshooting
- DB healthcheck failing: ensure port 5433 is free on host or adjust port mapping in `docker-compose.yml`.
- Pending token expired: re-run login to generate a new OTP (check logs for the code).
- Conflicts on create/update: email and employee_code are unique; adjust inputs if you hit HTTP 409.
- CORS errors: verify `CORS_ALLOWED_ORIGINS` matches your frontend origin.

## Running locally without Docker (optional)
- Create and activate a Python 3.11+ virtualenv.
- Install deps: `pip install -r requirements.txt`
- Set `DATABASE_URL` pointing to your Postgres instance, run `alembic upgrade head`, then `python scripts/seed.py`.
- Start server: `uvicorn app.main:app --reload`
