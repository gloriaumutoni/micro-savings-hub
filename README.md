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

| Name           | GitHub                                             | Role                          |
| -------------- | -------------------------------------------------- | ----------------------------- |
| Gloria Umutoni | [@gloriaumutoni](https://github.com/gloriaumutoni) | Team Lead / Backend Developer |
| Josue Ahadi    | [@josueahadi](https://github.com/josueahadi)       | DevOps Engineer               |
| Chartine       | [@Chartine02](https://github.com/Chartine02)       | Frontend Developer            |

---

## Project Overview

AfrikaSave is a community-focused fintech platform that digitises savings groups for African communities. It provides a simple API and web interface for creating groups, recording contributions, and tracking collective progress toward a savings goal.

The platform is designed with a microservices-ready architecture: the backend API handles all business logic and data persistence, while the frontend React application consumes it. Both services are independently runnable and independently deployable — a foundation that naturally evolves into separate containerised services in later phases.

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

| Layer               | Technology                   |
| ------------------- | ---------------------------- |
| **Backend**         | Node.js 22, Express 5        |
| **Database**        | PostgreSQL 17                |
| **Frontend**        | React 19, TypeScript, Vite 6 |
| **Styling**         | Tailwind CSS v4              |
| **HTTP Client**     | Axios                        |
| **Routing**         | React Router v7              |
| **CI/CD**           | GitHub Actions               |
| **Version Control** | Git / GitHub                 |

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+
- A [Neon](https://neon.tech) account (free) — used as the shared PostgreSQL database

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/gloriaumutoni/micro-savings-hub.git
cd micro-savings-hub
```

**2. Configure the backend**

```bash
cd backend
cp .env.example .env
# Paste the shared Neon DATABASE_URL into .env
```

**3. Run the backend**

```bash
npm install
npm run dev
# API available at http://localhost:5000
```

### Usage

**Health check**

```bash
curl http://localhost:5000/health
```

**Create a savings group**

```bash
curl -X POST http://localhost:5000/api/groups \
  -H "Content-Type: application/json" \
  -d '{"name": "Ibimina Youth Collective", "description": "Monthly savings for school fees", "targetAmount": 500000, "currency": "RWF"}'
```

**Add a contribution**

```bash
curl -X POST http://localhost:5000/api/groups/<group-id>/contribute \
  -H "Content-Type: application/json" \
  -d '{"memberName": "Gloria", "amount": 20000}'
```

**View group summary**

```bash
curl http://localhost:5000/api/groups/<group-id>
```

> Frontend setup instructions will be added once scaffolded.

---

## Project Structure

```
micro-savings-hub/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                  # CI pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
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
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## Contributing

Follow this process to keep the codebase clean and reviewable.

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

## Formative 2 — Part 3: Integration & Evidence

### Branch protection (main)

- Require PR before merge
- Require 1 approval
- Require CI checks to pass
- Require branch to be up to date

**Screenshot of the rules set:**
!(rules set)[docs/images/branch_protection_1.png]
!(rules set)[docs/images/branch_protection_2.png]

## Links

- [Project Board](https://github.com/gloriaumutoni/micro-savings-hub/projects)
- [CI Pipeline](https://github.com/gloriaumutoni/micro-savings-hub/actions)

---

## License

[MIT License](./LICENSE) — Copyright (c) 2026 Avengers
