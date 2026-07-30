# wareX — Warehouse Management System

A full-stack warehouse management application built with **React + Vite** (frontend) and **Express + Mongoose** (backend). Provides inventory tracking, order fulfillment, pick list management, and role-based access control.

## Tech Stack

### Backend
- **Runtime:** Node.js, TypeScript
- **Framework:** Express 4
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **Logging:** Pino
- **Security:** Helmet, CORS, HPP, rate limiting (express-rate-limit)

### Frontend
- **Framework:** React 19, TypeScript
- **Build tool:** Vite 8
- **Routing:** React Router 7
- **State management:** Zustand + React Query (TanStack Query)
- **UI:** Tailwind CSS 4, Radix UI primitives, lucide-react icons
- **Forms:** react-hook-form + @hookform/resolvers + Zod
- **Charts:** Recharts, Three.js (3D warehouse visualization)
- **HTTP client:** Axios

---

## Features

- **Role-based access:** SuperAdmin, Manager, Worker — each with granular permissions
- **Warehouse hierarchy:** Warehouses → Zones → Aisles → Bins (4-level nesting)
- **Device management:** Track serialized devices with condition states (New, Open-Box, RMA, Good, Fair, Damaged)
- **Inventory movements:** Move devices between bins with full audit history
- **Order management:** Create, update, fulfill orders with automatic pick list generation
- **Pick lists:** Assign workers, track picking progress, complete/cancel workflows
- **Reporting:** Dashboard, device status, inventory, order status, pick list performance, warehouse utilization
- **Notifications:** System notifications with read/unread tracking
- **Admin panel:** User management (CRUD) for SuperAdmin
- **Audit logs:** Track all user actions across the system
- **ACID transactions:** MongoDB sessions with commit/abort for critical multi-document operations (pick list lifecycle, inventory moves, order fulfillment)

---

## Prerequisites

- **Node.js** ≥ 18.x
- **MongoDB** ≥ 6.0 (replica set required for transactions; a single-node replica set is sufficient for development)
- **npm** ≥ 9.x

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd wareX
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
HOST=localhost

# MongoDB connection string (must use replica set for transactions)
# Development replica set example: mongodb://localhost:27017/warex?replicaSet=rs0
MONGODB_URI=mongodb://localhost:27017/warex?replicaSet=rs0

# JWT
JWT_SECRET=your-secret-key-at-least-32-chars-long
JWT_EXPIRES_IN=7d

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
RATE_LIMIT_AUTH_MAX=50

# CORS
CORS_ORIGIN=http://localhost:5173

# SuperAdmin defaults (only used during seeding)
SUPER_ADMIN_EMAIL=superadmin@warex.com
SUPER_ADMIN_PASSWORD=superadmin123
SUPER_ADMIN_NAME=Super Admin

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=logs
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`.

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` if needed (defaults work for local development):

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Install and start:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> The Vite dev server proxies `/api/*` requests to `http://localhost:3000`, so the frontend can use relative `/api/v1` URLs in development.

### 4. Seed data

On first startup, the backend automatically seeds:
- **48 permissions** covering all modules
- **3 roles:** SuperAdmin, Manager, Worker (each with appropriate permissions)
- **1 SuperAdmin user:** `superadmin@warex.com` / `superadmin123`
- **1 Manager user:** `erfan@warex.com` (password: `worker123`)
- **3 Worker users:** `anshil@warex.com`, `hari@warex.com`, `shemil@warex.com` (password: `worker123`)

Seeding runs automatically when the server starts. To re-run, drop the database and restart.

---

## Project structure

```
wareX/
├── backend/
│   └── src/
│       ├── modules/          # Feature modules
│       │   ├── admin/        # User management (SuperAdmin)
│       │   ├── aisle/        # Aisle CRUD
│       │   ├── audit-log/    # Action audit trail
│       │   ├── auth/         # Login, register, profile
│       │   ├── bin/          # Bin CRUD
│       │   ├── device/       # Device CRUD
│       │   ├── inventory/    # Device moves & history
│       │   ├── notification/ # System notifications
│       │   ├── order/        # Order management
│       │   ├── permission/   # Permission definitions
│       │   ├── pick-list/    # Pick list lifecycle
│       │   ├── report/       # Dashboard & reports
│       │   ├── role/         # Role definitions
│       │   ├── warehouse/    # Warehouse CRUD
│       │   └── zone/         # Zone CRUD
│       ├── shared/
│       │   ├── config/       # App & env config
│       │   ├── constants/    # Shared constants
│       │   ├── database/     # MongoDB connection
│       │   ├── logger/       # Pino logger
│       │   ├── middleware/   # Auth, error, rate-limit, etc.
│       │   └── utils/        # Date, pagination helpers
│       ├── seed.ts           # Database seed logic
│       ├── server.ts         # Entry point
│       └── app.ts            # Express app setup
│
├── frontend/
│   └── src/
│       ├── components/       # Shared UI components
│       │   ├── common/       # DataTable, StatusBadge, etc.
│       │   └── ui/           # Button, Input, Card, etc.
│       ├── config/           # Env & theme config
│       ├── constants/        # Routes, query keys
│       ├── features/         # Feature modules (mirrors backend)
│       │   ├── admin/
│       │   ├── aisle/
│       │   ├── auth/
│       │   ├── bin/
│       │   ├── dashboard/
│       │   ├── device/
│       │   ├── inventory/
│       │   ├── notification/
│       │   ├── order/
│       │   ├── pick-list/
│       │   ├── reports/
│       │   ├── warehouse/
│       │   └── zone/
│       ├── layouts/          # Dashboard, Auth, Public layouts
│       ├── lib/              # Axios instance
│       ├── routes/           # React Router config
│       ├── stores/           # Zustand stores
│       └── styles/           # Global CSS
│
└── README.md
```

### Backend module convention

Each module follows a consistent pattern:

```
module/
├── module.model.ts       # Mongoose schema
├── module.types.ts       # TypeScript interfaces & DTOs
├── module.validation.ts  # Zod schemas
├── module.repository.ts  # Database queries
├── module.service.ts     # Business logic
├── module.controller.ts  # Request handlers
├── module.routes.ts      # Route definitions
└── index.ts              # Barrel export
```

---

## API overview

All API routes are prefixed with `/api/v1`.

| Module          | Method   | Endpoints                                              |
|-----------------|----------|--------------------------------------------------------|
| **Auth**        | POST     | `/auth/register`, `/auth/login`                        |
|                 | GET      | `/auth/me`                                             |
| **Warehouses**  | GET/POST | `/warehouses`                                          |
|                 | GET/PATCH/DELETE | `/warehouses/:id`                             |
| **Zones**       | GET/POST | `/zones`                                               |
|                 | GET      | `/warehouses/:warehouseId/zones`                       |
|                 | GET/PATCH/DELETE | `/zones/:id`                                   |
| **Aisles**      | GET/POST | `/aisles`                                              |
|                 | GET      | `/zones/:zoneId/aisles`                                |
|                 | GET/PATCH/DELETE | `/aisles/:id`                                   |
| **Bins**        | GET/POST | `/bins`                                                |
|                 | GET      | `/aisles/:aisleId/bins`                                |
|                 | GET/PATCH/DELETE | `/bins/:id`                                     |
| **Devices**     | GET/POST | `/devices`                                             |
|                 | GET/PATCH/DELETE | `/devices/:id`                                  |
| **Inventory**   | POST     | `/inventory/move`                                      |
|                 | GET      | `/inventory/history/:deviceId`                         |
| **Orders**      | GET/POST | `/orders`                                              |
|                 | GET/PATCH/DELETE | `/orders/:id`                                  |
|                 | POST     | `/orders/:id/generate-pick-list`                       |
|                 | POST     | `/orders/:id/fulfill`                                  |
| **Pick Lists**  | GET/POST | `/pick-lists`                                          |
|                 | GET      | `/pick-lists/worker/:workerId`                         |
|                 | GET/PATCH| `/pick-lists/:id`                                      |
|                 | PATCH    | `/pick-lists/:id/assign`                               |
|                 | PATCH    | `/pick-lists/:id/start`                                |
|                 | PATCH    | `/pick-lists/:id/complete`                             |
|                 | PATCH    | `/pick-lists/:id/cancel`                               |
| **Notifications**| GET/POST| `/notifications`                                       |
|                 | GET/PATCH/DELETE | `/notifications/:id`                          |
| **Reports**     | GET      | `/reports/dashboard`, `/reports/*`                     |
| **Admin**       | GET/POST | `/admin/users`                                         |
|                 | GET/PATCH/DELETE | `/admin/users/:id`                             |
| **Health**      | GET      | `/health`                                              |

---

## Roles & permissions

| Role        | Capabilities |
|-------------|-------------|
| **SuperAdmin** | Full system access — user management, role management, all CRUD operations, audit logs |
| **Manager** | Operational control — create/edit warehouses, zones, aisles, bins, devices; manage orders and pick lists (assign workers, cancel); view reports and audit logs |
| **Worker** | Floor execution — read pick lists, start/complete assigned pick lists, view warehouse/device details, view dashboard |

---

## Rate limiting

| Limiter           | Window   | Max requests | Applied to        |
|-------------------|----------|--------------|--------------------|
| Standard limiter  | 15 min   | 200 (configurable) | All API routes |
| Auth limiter      | 15 min   | 50 (configurable)  | `/auth/*` routes |

Configure via `RATE_LIMIT_MAX` and `RATE_LIMIT_AUTH_MAX` in `.env`.

---

## Scripts

### Backend

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start dev server with hot reload   |
| `npm run build`      | Compile TypeScript to `dist/`      |
| `npm start`          | Run compiled production build      |
| `npm run lint`       | Lint source files                  |
| `npm run typecheck`  | TypeScript type checking           |

### Frontend

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run dev`        | Start Vite dev server (port 5173)  |
| `npm run build`      | TypeScript check + production build|
| `npm run preview`    | Preview production build locally   |
| `npm run lint`       | Lint source files                  |
| `npm run typecheck`  | TypeScript type checking           |
| `npm run format`     | Format code with Prettier          |

---

## Environment variables

### Backend (`backend/.env`)

| Variable               | Default                        | Description                         |
|------------------------|--------------------------------|-------------------------------------|
| `NODE_ENV`             | `development`                  | Runtime environment                 |
| `PORT`                 | `3000`                         | Server port                         |
| `HOST`                 | `localhost`                    | Server host                         |
| `MONGODB_URI`          | _(required)_                   | MongoDB connection string           |
| `JWT_SECRET`           | `dev-secret-key-...`           | JWT signing secret (min 32 chars)   |
| `JWT_EXPIRES_IN`       | `7d`                           | JWT expiration duration             |
| `CORS_ORIGIN`          | `*`                            | Allowed CORS origins                |
| `RATE_LIMIT_WINDOW_MS`  | `900000`                      | Rate limit window (ms)              |
| `RATE_LIMIT_MAX`       | `100`                          | Max requests per window             |
| `RATE_LIMIT_AUTH_MAX`  | `10`                           | Max auth requests per window        |
| `BODY_LIMIT`           | `1mb`                          | Request body size limit             |
| `LOG_LEVEL`            | `info`                         | Pino log level                      |
| `LOG_FILE_PATH`        | `logs`                         | Log file directory                  |
| `SUPER_ADMIN_EMAIL`    | `superadmin@warex.com`         | Default SuperAdmin email            |
| `SUPER_ADMIN_PASSWORD` | `superadmin123`                | Default SuperAdmin password         |
| `SUPER_ADMIN_NAME`     | `Super Admin`                  | Default SuperAdmin display name     |

### Frontend (`frontend/.env`)

| Variable        | Default                              | Description               |
|-----------------|--------------------------------------|---------------------------|
| `VITE_API_URL`  | `http://localhost:3000/api/v1`       | Backend API base URL      |

---

## Transactions & concurrency

Critical multi-document operations use **MongoDB transactions** with retry logic:

- **Pick list creation:** Atomically reserves devices via `updateMany` with `{ status: 'Available' }` filter — if devices were already reserved concurrently, the operation throws a `ConflictError` and modified count is verified
- **Inventory moves:** Atomically updates source bin, destination bin, and device location
- **Order fulfillment:** Atomically updates order status and device statuses

> ⚠️ MongoDB requires a **replica set** for transactions. For local development, start a single-node replica set:
> ```
> mongod --replSet rs0
> mongosh --eval "rs.initiate()"
> ```

---

## Default credentials

| Role        | Email                    | Password        |
|-------------|--------------------------|-----------------|
| SuperAdmin  | superadmin@warex.com     | superadmin123   |
| Manager     | erfan@warex.com          | worker123       |
| Worker      | anshil@warex.com         | worker123       |
| Worker      | hari@warex.com           | worker123       |
| Worker      | shemil@warex.com         | worker123       |

> Manager accounts must be created via the SuperAdmin admin panel after login.
