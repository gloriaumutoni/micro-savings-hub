# AfrikaSave — Backend API

REST API for the AfrikaSave community savings platform. Built with Node.js 22, Express 5, and PostgreSQL 17.

---

## Prerequisites

- Node.js 22+
- npm 10+
- PostgreSQL 17 (or a [Neon](https://neon.tech) free account)

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — add your DATABASE_URL and JWT_SECRET

# 3. Initialise the database schema
psql "$DATABASE_URL" -f db/init.sql

# 4. Start the development server
npm run dev
# API available at http://localhost:5000
```

---

## Running with Docker

```bash
# Build the image
docker build -t micro-savings-hub-backend .

# Run the container
docker run \
  -e DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" \
  -e JWT_SECRET="your-secret" \
  -e JWT_EXPIRES_IN="7d" \
  -p 5000:5000 \
  micro-savings-hub-backend
```

Or use Docker Compose from the project root — see the [root README](../README.md).

---

## Running Tests

```bash
npm test
```

Tests use the database pointed to by `DATABASE_URL`. For CI a local postgres container is used.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Port the server listens on |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | No | `7d` | JWT expiry duration |

Generate a strong `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## API Reference

Base URL: `http://localhost:5000`

All protected endpoints require:
```
Authorization: Bearer <token>
```

### Health

| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | None |

```bash
curl http://localhost:5000/health
```

---

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | None | Create a new account |
| POST | `/api/auth/login` | None | Log in and receive a JWT |

**Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "secret123"}'
```

Response `201`:
```json
{
  "status": 201,
  "data": { "id": "uuid", "email": "alice@example.com", "role": "user", "created_at": "..." }
}
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "secret123"}'
```

Response `200`:
```json
{
  "status": 200,
  "data": { "token": "<jwt>" }
}
```

> **Postman tip:** paste any curl command into Postman via **Import → Raw text**. Set the token as a Collection Variable `{{token}}` and use `Bearer {{token}}` in the Authorization tab.

---

### Groups

All group endpoints require a valid JWT.

| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/api/groups` | Any member | List your groups |
| POST | `/api/groups` | Any user | Create a group |
| GET | `/api/groups/:id` | Member/Owner | Get group detail |
| PATCH | `/api/groups/:id` | Owner | Update group details |
| POST | `/api/groups/:id/close` | Owner | Manually close a group |
| POST | `/api/groups/:id/invite` | Owner | Generate an invite link |
| POST | `/api/groups/join/:token` | Any user | Join via invite token |
| POST | `/api/groups/:id/contribute` | Member/Owner | Record a contribution |
| DELETE | `/api/groups/:id/members/me` | Member | Leave a group |
| DELETE | `/api/groups/:id/members/:userId` | Owner | Remove a member |

**List your groups**
```bash
curl http://localhost:5000/api/groups \
  -H "Authorization: Bearer <token>"
```

**Create a group**
```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ibimina Youth Collective",
    "description": "Monthly savings for school fees",
    "targetAmount": 500000,
    "currency": "RWF",
    "endDate": "2026-12-31T00:00:00Z"
  }'
```

Response `201`:
```json
{
  "status": 201,
  "data": { "id": "uuid", "name": "Ibimina Youth Collective", "status": "active", ... }
}
```

**Get group detail**
```bash
curl http://localhost:5000/api/groups/<group-id> \
  -H "Authorization: Bearer <token>"
```

**Update group**
```bash
curl -X PATCH http://localhost:5000/api/groups/<group-id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "targetAmount": 600000}'
```

**Close a group manually**
```bash
curl -X POST http://localhost:5000/api/groups/<group-id>/close \
  -H "Authorization: Bearer <token>"
```

**Generate an invite link**
```bash
curl -X POST http://localhost:5000/api/groups/<group-id>/invite \
  -H "Authorization: Bearer <token>"
```

Response `201`:
```json
{
  "status": 201,
  "data": { "inviteUrl": "http://localhost:5000/api/groups/join/<token>" }
}
```

**Join via invite token**
```bash
curl -X POST http://localhost:5000/api/groups/join/<invite-token> \
  -H "Authorization: Bearer <token>"
```

**Record a contribution**
```bash
curl -X POST http://localhost:5000/api/groups/<group-id>/contribute \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 20000}'
```

**Leave a group**
```bash
curl -X DELETE http://localhost:5000/api/groups/<group-id>/members/me \
  -H "Authorization: Bearer <token>"
```

**Remove a member (owner only)**
```bash
curl -X DELETE http://localhost:5000/api/groups/<group-id>/members/<user-id> \
  -H "Authorization: Bearer <token>"
```

---

### Admin

Requires `system_admin` role.

| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/api/admin/groups` | system_admin | List all groups across the platform |

```bash
curl http://localhost:5000/api/admin/groups \
  -H "Authorization: Bearer <admin-token>"
```

---

## Error Format

All errors follow a consistent shape:

```json
{
  "status": 400,
  "message": "Human-readable description"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Invalid request payload |
| 401 | Missing or invalid JWT |
| 403 | Authenticated but not authorised |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, already a member, group closed) |
| 410 | Invite token expired or already used |
| 500 | Unexpected server error |
