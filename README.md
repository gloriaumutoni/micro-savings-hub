# AfrikaSave — micro-savings-hub

> Empowering Community Savings Across Africa

![CI](https://github.com/YOUR-ORG/micro-savings-hub/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## African Context

Across Africa, informal savings groups — known as *tontines* in West Africa, *chamas* in Kenya, and *ibimina* in Rwanda — are a cornerstone of community finance. Millions of people pool money weekly or monthly to support one another, yet these groups rely on handwritten ledgers, cash in envelopes, and verbal agreements.

This creates real problems: contributions go unrecorded, totals are disputed, and trust breaks down. AfrikaSave digitises the entire process — making every contribution transparent, every group traceable, and every member accountable — with no bank account required.

---

## Team Members

| Name | GitHub | Role | Student ID |
|------|--------|------|------------|
| Gloria Umutoni | [@gloriaumutoni](https://github.com/gloriaumutoni) | Team Lead / Backend Developer | [ID] |
| Josue Ahadi | [@josueahadi](https://github.com/josueahadi) | DevOps Engineer | [ID] |
| Chartine | [@Chartine02](https://github.com/Chartine02) | Frontend Developer | [ID] |

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

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js 22, Express 5 |
| **Database** | PostgreSQL 17 |
| **Frontend** | React 19, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **HTTP Client** | Axios |
| **Routing** | React Router v7 |
| **CI/CD** | GitHub Actions |
| **Version Control** | Git / GitHub |

---

## Getting Started

### Prerequisites
- Node.js 22+
- PostgreSQL 17+ running locally
- npm 10+

### Installation

> Setup instructions to follow once the backend and frontend are scaffolded.

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
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Route-level pages
│   │   ├── services/
│   │   │   └── api.ts              # Axios API client
│   │   └── types/
│   │       └── index.ts            # TypeScript interfaces
│   ├── index.html
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## Links

- [Project Board](https://github.com/YOUR-ORG/micro-savings-hub/projects)
- [CI Pipeline](https://github.com/YOUR-ORG/micro-savings-hub/actions)

---

## License

[MIT License](./LICENSE) — Copyright (c) 2026 Avengers
