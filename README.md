# Micro-savings-hub

> Empowering Community Savings Across Africa

![CI](https://github.com/gloriaumutoni/micro-savings-hub/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## African Context

Across Africa, informal savings groups — known as _tontines_ in West Africa, _chamas_ in Kenya, and _ibimina_ in Rwanda — are a cornerstone of community finance. Millions of people pool money weekly or monthly to support one another, yet these groups rely on handwritten ledgers, cash in envelopes, and verbal agreements.

This creates real problems: contributions go unrecorded, totals are disputed, and trust breaks down. AfrikaSave digitises the entire process — making every contribution transparent, every group traceable, and every member accountable — with no bank account required.

---

## Team Members

| Name           | GitHub                                             | Role                          | Student ID |
| -------------- | -------------------------------------------------- | ----------------------------- | ---------- |
| Gloria Umutoni | [@gloriaumutoni](https://github.com/gloriaumutoni) | Team Lead / Backend Developer | [ID]       |
| Josue Ahadi    | [@josueahadi](https://github.com/josueahadi)       | DevOps Engineer               | [ID]       |
| Chartine       | [@Chartine02](https://github.com/Chartine02)       | Frontend Developer            | [ID]       |

---

## Project Overview

AfrikaSave is a community-focused fintech platform that digitises savings groups for African communities. It provides a simple API and web interface for creating groups, recording contributions, and tracking collective progress toward a savings goal.

The platform is designed with a microservices-ready architecture: the backend API handles all business logic and data persistence, while the frontend React application (coming in F2) will consume it. Both services are independently runnable and independently deployable — a foundation that naturally evolves into separate containerised services in later phases.

Security and transparency are first-class concerns. Every contribution is recorded with a timestamp and member name, group totals are updated atomically via database transactions, and no money is ever stored — AfrikaSave is a record-keeping and accountability tool, not a payment processor.

### Target Users

- Community savings groups (tontines, chamas, ibimina)
- Youth savings collectives and university clubs
- Small business associations pooling capital
- Rural financial cooperatives with no formal banking access

### Core Features

- **Create a Savings Group** — name, description, target amount, and currency
- **Join & Contribute** — record a simulated contribution linked to a member name
- **Live Group Summary** — view total saved, progress toward goal, and full contribution history
- **Multi-currency Support** — RWF, KES, UGX, NGN, GHS, USD and more
- **Transparent Ledger** — every contribution is timestamped and immutable

---

## Technology Stack

| Layer               | Technology                                    |
| ------------------- | --------------------------------------------- |
| **Backend**         | Node.js 22, Express 5                         |
| **Database**        | PostgreSQL 17                                 |
| **Frontend**        | React 19, TypeScript, Vite 6 _(coming in F2)_ |
| **Styling**         | Tailwind CSS v4 _(coming in F2)_              |
| **HTTP Client**     | Axios _(coming in F2)_                        |
| **Routing**         | React Router v7 _(coming in F2)_              |
| **CI/CD**           | GitHub Actions                                |
| **Version Control** | Git / GitHub                                  |

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- PostgreSQL 17+ running locally **or** a [Neon](https://neon.tech) account (free tier is sufficient)

---

### 1. Clone the repository

```bash
git clone https://github.com/gloriaumutoni/micro-savings-hub.git
cd micro-savings-hub
```

---

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your database connection string:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/micro_savings_hub
```

**Using Neon instead of a local database?**
Paste the connection string from your Neon project dashboard → Connection Details:

```env
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/micro_savings_hub?sslmode=require
```

> ⚠️ Never commit `.env`. It is listed in `.gitignore` and must stay local.

---

### 3. Install dependencies

```bash
npm install
```

> This generates `package-lock.json`. If you are the first person setting up the project, commit the lockfile so that all teammates and CI use identical dependency versions.
>
> Everyone else on the team (and CI) should run `npm ci` instead, which installs exact versions from the lockfile without modifying it.

---

### 4. Set up the database schema

**Local PostgreSQL:**

```bash
# Create the database if it doesn't exist yet
createdb micro_savings_hub

# Apply the schema
psql -h localhost -U postgres -d micro_savings_hub -f db/init.sql
```

**Neon:**
Open the Neon SQL Editor for your project, paste the contents of `backend/db/init.sql`, and run it. You only need to do this once.

---

### 5. Start the development server

```bash
npm run dev
# API available at http://localhost:5000
```

`npm run dev` uses Node's built-in `--watch` flag and restarts automatically on file changes.
Use `npm start` for a plain single-run start (used in production and CI).

---

### 6. Verify the server is running

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "micro-savings-hub-api",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

---

### 7. Lint before pushing

CI will reject any PR that fails the lint check. Run it locally first to catch issues early:

```bash
npm run lint
```

---

### Frontend

Frontend setup instructions will be added in F2 once the React app is scaffolded.

---

## API Reference

### Health check

```bash
curl http://localhost:5000/health
```

### Create a savings group

```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Content-Type: application/json" \
  -d '{"name": "Ibimina Youth Collective", "description": "Monthly savings for school fees", "targetAmount": 500000, "currency": "RWF"}'
```

### List all groups

```bash
curl http://localhost:5000/api/groups
```

### View group summary (with full contribution history)

```bash
curl http://localhost:5000/api/groups/<group-id>
```

### Add a contribution

```bash
curl -X POST http://localhost:5000/api/groups/<group-id>/contribute \
  -H "Content-Type: application/json" \
  -d '{"memberName": "Gloria", "amount": 20000}'
```

---

## Project Structure

```
micro-savings-hub/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                  # CI pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── task.md
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # PostgreSQL connection pool
│   │   ├── controllers/
│   │   │   └── groups.controller.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   └── groups.routes.js
│   │   └── services/
│   │       └── groups.service.js   # Business logic + SQL
│   ├── db/
│   │   └── init.sql                # Database schema
│   ├── app.js
│   ├── eslint.config.mjs
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## Contributing

### 1. Create an Issue First

Before starting work, open an issue using the appropriate template:

| Template            | When to use                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| **Bug Report**      | Something is broken or behaving unexpectedly                                          |
| **Feature Request** | You want to propose/add new functionality                                             |
| **Task**            | Planned work — DevOps, infrastructure, config, or anything that doesn't fit the above |

Go to **Issues → New Issue** on GitHub and select the matching template.

### 2. Branch Naming

Create a branch from `main` using this convention:

```
<type>/<short-description>
```

| Type        | Use for                                   |
| ----------- | ----------------------------------------- |
| `feat/`     | New feature                               |
| `fix/`      | Bug fix                                   |
| `chore/`    | Maintenance, dependencies, tooling        |
| `ci/`       | CI/CD changes                             |
| `docs/`     | Documentation only                        |
| `refactor/` | Code restructure with no behaviour change |
| `build/`    | Docker, build system changes              |

Examples: `feat/user-auth`, `fix/contribution-null-check`, `ci/add-lint-step`

### 3. Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

Examples:

```
feat(auth): add JWT login endpoint
fix(groups): handle missing targetAmount gracefully
chore: update dotenv to v16.4.7
ci: uncomment lint step in CI workflow
```

### 4. Open a Pull Request

1. Push your branch and open a PR targeting `main`.
2. Fill in the PR template — summary, type of change, and testing steps.
3. Request a review from at least one team member.
4. All CI checks must pass before merging.
5. The reviewer merges after approval — do not self-merge.

---

## Links

- [Project Board](https://github.com/gloriaumutoni/micro-savings-hub/projects)
- [CI Pipeline](https://github.com/gloriaumutoni/micro-savings-hub/actions)

---

## License

[MIT License](./LICENSE) — Copyright (c) 2026 Avengers
