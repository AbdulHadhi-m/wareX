# wareX Architecture

## Table of Contents

1. [System Overview](#system-overview)
2. [Backend Architecture](#backend-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Database Schema & Relationships](#database-schema--relationships)
5. [Data Flow](#data-flow)
6. [Security Model](#security-model)
7. [Key Design Decisions](#key-design-decisions)

---

## System Overview

wareX is a full-stack warehouse management system with a **monorepo** structure containing two independently deployable applications:

```
wareX/
├── backend/     Express + Mongoose REST API (port 3000)
├── frontend/    React + Vite SPA (port 5173)
└── ARCHITECTURE.md
```

```
┌─────────────┐       ┌──────────────────┐       ┌──────────┐
│  Browser     │──────▶│  Vite Dev Proxy   │──────▶│ Express  │
│  React SPA   │◀──────│  /api → :3000     │◀──────│  API     │
└─────────────┘       └──────────────────┘       └────┬─────┘
                                                       │
                                                       ▼
                                                ┌──────────┐
                                                │ Mongoose  │
                                                │  MongoDB  │
                                                └──────────┘
```

In production, the frontend is built as static assets and served via a CDN or reverse proxy, talking directly to the API.

---

## Backend Architecture

### Layer Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Middleware Pipeline                    │
│  helmet → cors → compression → hpp → requestId →        │
│  requestLogger → standardLimiter → authLimiter           │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                      Routes                              │
│  /api/v1/auth, /warehouses, /zones, /aisles, /bins,     │
│  /devices, /inventory, /orders, /pick-lists,             │
│  /notifications, /reports, /admin/users, /permissions,   │
│  /roles, /audit-logs                                     │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                     Controllers                           │
│  Parse request → call service → format response          │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                      Services                             │
│  Business logic, validation, transactions, events        │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    Repositories                           │
│  Database queries (find, create, update, softDelete)     │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                     Models (Mongoose)                    │
│  Schema definition, indexes, toJSON transforms           │
└─────────────────────────────────────────────────────────┘
```

### Module Convention

Every feature module follows a **strict 7-file convention**:

| File                | Responsibility                                              |
|---------------------|-------------------------------------------------------------|
| `module.model.ts`   | Mongoose schema, indexes, toJSON transform                  |
| `module.types.ts`   | TypeScript interfaces, DTOs, response types                 |
| `module.validation.ts` | Zod schemas for request validation                       |
| `module.repository.ts` | Data access layer (find, create, update, softDelete)    |
| `module.service.ts` | Business logic, cross-module calls, transactions, events    |
| `module.controller.ts` | HTTP request/response handling, audit logging             |
| `module.routes.ts`  | Route definitions with auth middleware                      |
| `index.ts`          | Barrel export                                                |

### Shared Layer (`backend/src/shared/`)

| Directory       | Contents                                                              |
|-----------------|-----------------------------------------------------------------------|
| `config/`       | `app.ts` (app metadata), `database.ts` (MongoDB options), `environment.ts` (env validation via Zod) |
| `constants/`    | HTTP status codes, app constants                                      |
| `database/`     | `connection.ts` (connect/disconnect/isConnected with event listeners) |
| `errors/`       | Error class hierarchy: `AppError` → `AuthenticationError`, `AuthorizationError`, `ConflictError`, `NotFoundError`, `ValidationError` |
| `events/`       | `EventEmitter` instance + event name constants for cross-module pub/sub |
| `logger/`       | Pino logger with file transport in production                         |
| `middleware/`   | `requestId` (UUID), `requestLogger`, `rateLimiter`, `errorHandler`, `notFoundHandler`, `asyncHandler` |
| `query/`        | `QueryParser` + `QueryBuilder` for dynamic MongoDB queries from query params |
| `types/`        | Global type definitions (ApiResponse, PaginationMeta)                 |
| `utils/`        | `pagination`, `date` formatting, `api-response` helpers               |
| `validation/`   | Request validation middleware factory using Zod                       |
| `cache/`        | In-memory permission cache (Map-based, TTL-aware)                     |

### Error Handling

A custom error class hierarchy maps to HTTP status codes:

```
AppError (base)
├── AuthenticationError  → 401
├── AuthorizationError   → 403
├── NotFoundError        → 404
├── ConflictError        → 409
└── ValidationError      → 422

InternalError            → 500 (non-operational, logged as fatal)
```

- Controllers wrap service calls in `try/catch` and pass errors to `next()`
- The global `errorHandler` middleware formats errors into a consistent `{ success, error: { name, message, details } }` shape
- Operational errors are logged at `warn` level, non-operational (InternalError) at `fatal`

### Auth Middleware

Two middleware functions in `auth.middleware.ts`:

1. **`authenticate`** — Extracts JWT from `Authorization: Bearer <token>`, verifies with `jwt.verify`, sets `req.userId`
2. **`authorize(...permissions)`** — Looks up the user, populates role, checks `isSuperAdmin` (bypass), otherwise checks permission codes against a **cached in-memory set** (permission codes cached per roleId after first lookup)

### Event System

The `eventEmitter` (Node.js EventEmitter) decouples services:

```typescript
// In pickList.service.ts after completing a pick list:
eventEmitter.emit(Events.PICK_LIST_COMPLETED, { ... });

// In notification listeners (registered at app startup):
eventEmitter.on(Events.PICK_LIST_COMPLETED, async (data) => {
  await NotificationModel.create({ recipientId: data.createdBy, ... });
  await AuditLogModel.create({ ... });
});
```

---

## Frontend Architecture

### Component Tree

```
<App>
  <AuthInitializer />              ← Checks JWT on mount, hydrates store
  <RouterProvider>
    <RootLayout>
      ├── <HeroPage />             ← Public landing page (index)
      ├── <DashboardLayout>        ← Protected, sidebar + header
      │   ├── <Sidebar />          ← Navigation links with active state
      │   ├── <Header />           ← Theme toggle, search, notifications, user menu
      │   ├── <MobileNav />        ← Responsive drawer
      │   └── <Suspense>           ← Lazy-loaded feature pages
      │       └── <Outlet />
      ├── <AuthLayout>             ← Centered card layout
      │   ├── <LoginPage />
      │   └── <RegisterPage />
      └── <PublicLayout>           ← Minimal layout
```

### State Management

| Store        | Library   | Persistence     | Purpose                      |
|-------------|-----------|-----------------|------------------------------|
| Auth Store   | Zustand   | JWT in localStorage | User, token, isAuthenticated, isLoading |
| Theme Store  | Zustand   | localStorage    | Light/dark/system theme      |
| Server State | React Query | Cache in memory | All API data (CRUD lists, details) |

### Feature Module Convention

```
features/device/
├── types/index.ts          TypeScript interfaces + DTOs
├── schemas/device-schema.ts  Zod form validation schemas
├── api/device-api.ts        Axios API client
├── hooks/use-devices.ts     React Query hooks (list, detail, mutations)
├── components/              Presentation components
│   ├── device-table.tsx      TanStack Table (columns, sorting, pagination)
│   ├── device-form.tsx      react-hook-form wrapper
│   └── device-info-card.tsx  Details display
├── pages/                   Route-level page components
│   ├── device-list-page.tsx  Search, filters, pagination orchestration
│   ├── device-create-page.tsx  Form + mutation wiring
│   ├── device-edit-page.tsx
│   └── device-details-page.tsx
└── index.ts                 Barrel export
```

### Common Components

| Component        | Purpose                                              |
|-----------------|------------------------------------------------------|
| `PageContainer`  | Max-width wrapper (max-w-7xl, responsive padding)    |
| `PageHeader`     | Title, description, action buttons, separator        |
| `DataTable`      | Generic TanStack Table wrapper with loading/empty states |
| `StatusBadge`    | Color-coded badge based on status string             |
| `Breadcrumb`     | Navigation breadcrumbs                               |
| `SearchInput`    | Debounced search input with clear button             |
| `EmptyState`     | Illustration + message + optional CTA                |
| `ErrorState`     | Error message + retry button                         |
| `LoadingSpinner` | Centered spinner with optional label                 |
| `ConfirmDialog`  | Confirmation modal (Radix Dialog)                    |
| `GlobalSearch`   | Command palette for quick navigation                 |

### Routing Architecture

```
createBrowserRouter([
  path: '/'
    index: HeroPage
    dashboard/* → ProtectedRoute → DashboardLayout
      index: DashboardPage
      warehouses/* → List, Create, :id, :id/edit
      zones/* → List, Create, :id, :id/edit
      aisles/* → List, Create, :id, :id/edit
      bins/* → List, Create, :id, :id/edit
      devices/* → List, Create, :id, :id/edit
      inventory/* → Dashboard, Move/:deviceId, History/:deviceId
      pick-lists/* → List, Create, :id/edit
      orders/* → List, Create, :id, :id/edit
      notifications/* → List, :id
      reports/* → Dashboard, Devices, Inventory, Orders, PickLists
      settings → ProtectedRoute(Manager) → ComingSoon
      admin/users → ProtectedRoute(SuperAdmin) → List, Create, :id, :id/edit
      admin/audit-logs → ProtectedRoute(SuperAdmin) → ComingSoon
      access-denied
    auth/* → GuestRoute → AuthLayout
      login, register
    public/* → PublicLayout
    /* → Redirects to /dashboard/* + NotFoundPage
])
```

Key patterns:
- **Lazy loading**: Every page is `React.lazy(() => import(...))` with `SuspenseWrapper`
- **Nested routes**: CRUD children under each module path using `<Outlet />`
- **Redirect rules**: Old top-level paths (`/warehouses/*`) redirect to `/dashboard/warehouses`
- **Role guards**: `ProtectedRoute` supports `roles` prop for Manager/SuperAdmin-only routes

---

## Database Schema & Relationships

### Entity Relationship Diagram

```
                  ┌─────────────┐
                  │ Permission   │
                  │─────────────│
                  │ code (PK)    │
                  │ module       │
                  └──────┬──────┘
                         │ *
                         │
                  ┌──────▼──────┐
                  │ Role         │
                  │─────────────│
                  │ name (PK)    │
                  │ isSuperAdmin │
                  └──────┬──────┘
                         │ 1
                         │
                  ┌──────▼──────┐
                  │ User         │
                  │─────────────│
                  │ email (PK)   │
                  │ password     │
                  │ roleId ──────┘
                  └─────────────┘

┌──────────────┐    1    ┌─────────────┐    1    ┌────────────┐    1    ┌───────────┐
│  Warehouse    │────────▶│   Zone       │────────▶│   Aisle     │────────▶│   Bin     │
│──────────────│         │─────────────│         │────────────│         │───────────│
│ code (unique) │         │ warehouseId  │         │ zoneId      │         │ aisleId   │
│ status        │         │ code (unique │         │ code (unique│         │ code (uniq│
│ address...    │         │   per WH)    │         │   per Zone) │         │ capacity  │
│ isDeleted     │         │ isDeleted    │         │ isDeleted   │         │ status    │
└──────────────┘         └─────────────┘         └────────────┘         │ isDeleted │
                                                                        └─────┬─────┘
                                                                              │ 1
                                                                              │
┌─────────────────────────────────────────────────────────────────────────────┴──┐
│                                  Device                                       │
│───────────────────────────────────────────────────────────────────────────────│
│ serialNumber (unique), deviceName, brand, model, category, sku                │
│ binId, aisleId, zoneId, warehouseId  (denormalized location hierarchy)         │
│ status (Available/Reserved/Picked/Shipped/Damaged/Returned)                   │
│ condition (New/Open-Box/RMA/Good/Fair/Damaged)                                │
│ imei (sparse unique), purchaseDate, warrantyExpiry, notes                      │
│ isDeleted                                                                     │
└───────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐    ┌────────────────────┐
│      Order       │    │     PickList       │
│──────────────────│    │────────────────────│
│ orderNumber (PK) │    │ pickListNumber (PK)│
│ customerName     │    │ workerId           │
│ deviceIds[]      │    │ deviceIds[]        │
│ status           │    │ status             │
│ priority         │    │ priority           │
│ pickListId ──────┤───▶│ startedAt          │
└──────────────────┘    │ completedAt        │
                        └────────────────────┘

┌──────────────────┐    ┌────────────────────┐
│   Notification   │    │     AuditLog       │
│──────────────────│    │────────────────────│
│ recipientId      │    │ userId, userName   │
│ title, message   │    │ module, action     │
│ type (enum)      │    │ resourceType       │
│ priority         │    │ previousData       │
│ isRead, readAt   │    │ newData            │
│ relatedModule    │    │ ipAddress          │
│ relatedResourceId│    │ userAgent          │
│ isDeleted        │    └────────────────────┘
└──────────────────┘
```

### Key Schema Decisions

1. **Denormalized location on Device**: Each `Device` stores its full location path (`binId`, `aisleId`, `zoneId`, `warehouseId`) so that queries and displays don't require multi-collection joins. When a device is moved, all four fields are updated atomically in a transaction.

2. **String IDs for cross-references**: Foreign keys (`warehouseId`, `zoneId`, `aisleId`, `binId`, `roleId`, `workerId`, `pickListId`) are stored as plain strings (or ObjectIds where Mongoose population is needed), avoiding the need to populate in most list queries.

3. **Soft deletes everywhere**: Every mutable entity has `isDeleted: Boolean` and `deletedAt: Date`. Compound unique indexes include `isDeleted` so soft-deleted records don't block re-creation of the same code.

4. **No cascade deletes**: Soft-deleting a warehouse does not delete its zones/aisles/bins. The application layer checks for child entities before deletion, returning `ConflictError` if children exist.

---

## Data Flow

### Authentication Flow

```
1. User submits login form (email + password)
2. ✉️ POST /api/v1/auth/login
3. auth.controller.ts → auth.service.ts:
   a. Finds user by email (with password select: true)
   b. bcrypt.compare(password, user.password)
   c. Generates JWT { userId } signed with JWT_SECRET
   d. Populates roleId to get role name
   e. Returns { token, user: { id, name, email, role } }
4. Frontend stores token in localStorage via authService
5. Axios interceptor attaches "Authorization: Bearer <token>" to all requests
6. On app mount, AuthInitializer component:
   a. Reads token from localStorage
   b. Calls GET /api/v1/auth/me to validate and hydrate auth store
   c. If 401, clears token and store
```

### Pick List Lifecycle

```
Manager:  Create → [Assign Worker] → (Worker sees assigned)
Worker:                         → Start → Complete
Manager/Cancel:                                       → Cancel

CREATE (transaction):
  1. Validate worker exists (if workerId provided)
  2. Check devices not in another active pick list
  3. Atomic: DeviceModel.updateMany({ _id: $in, status: 'Available' }, status: 'Reserved')
     - If modifiedCount !== expected → throw ConflictError
  4. Generate pickListNumber (PL-00001)
  5. Create PickList document
  6. commitTransaction
  7. emit PICK_LIST_ASSIGNED (if worker assigned)

START:
  1. Verify pickList.status === 'Assigned'
  2. Verify req.userId === pickList.workerId
  3. Update status → 'In Progress', set startedAt
  4. emit PICK_LIST_STARTED

COMPLETE (transaction):
  1. Verify status === 'In Progress'
  2. Verify workerId === userId
  3. Update pickList → status: 'Completed', completedAt
  4. DeviceModel.updateMany → status: 'Picked'
  5. commitTransaction
  6. emit PICK_LIST_COMPLETED

CANCEL (transaction):
  1. Verify status not 'Completed' or 'Cancelled'
  2. Update pickList → status: 'Cancelled'
  3. DeviceModel.updateMany → status: 'Available' (release devices)
  4. commitTransaction
  5. emit PICK_LIST_CANCELLED
```

### Order → Pick List Generation

```
POST /api/v1/orders/:id/generate-pick-list (transaction):
  1. Load order, verify status (Draft or Pending)
  2. Verify order.pickListId is null
  3. Atomic: DeviceModel.updateMany({ _id: $in, status: 'Available' }, status: 'Reserved')
     - If modifiedCount !== expected → throw ConflictError
  4. Generate pick list number
  5. Create PickList document (status: Draft)
  6. Update order: status → 'Picking', pickListId
  7. commitTransaction
```

### Device Movement

```
POST /api/v1/inventory/move (transaction):
  1. Load device, verify not deleted
  2. Load source bin (current binId)
  3. Load destination bin
  4. Verify destination has capacity (usedBinCount < capacity)
  5. Update device: binId, aisleId, zoneId, warehouseId
  6. commitTransaction
  7. Create AuditLog
```

---

## Security Model

### Authentication

- **JWT-based**: Tokens signed with `JWT_SECRET`, default expiry 7 days
- **Password hashing**: bcrypt with 12 salt rounds
- **Token storage**: localStorage (frontend), `Authorization: Bearer` header (API)
- **Auto-logout**: Axios response interceptor catches 401, clears token, redirects to login

### Authorization (Role/Permission Matrix)

Three roles, each with a set of permission codes:

```
SuperAdmin → all permissions (bypass check via isSuperAdmin flag)
Manager    → warehouse/zone/aisle/bin/device/order/pick-list CRUD,
             inventory move, notifications, reports
Worker     → warehouse.read, inventory.read, order.read,
             pick-list.read/start/complete, report.view-dashboard
```

Permission checking is **code-based**, not role-name-based:

```
authorize('warehouse.create', 'warehouse.update')
```

This allows future roles to be created with custom permission sets without code changes.

### Permission Caching

Permissions are cached **in-memory per roleId** after first lookup:

```typescript
cache = Map<string, { permissions: Set<string>, timestamp: number }>
```

- TTL: 5 minutes
- Cleared on permission/role updates via `admin.update` events
- Not shared across server instances (acceptable for single-server deployments)

### Rate Limiting

| Limiter        | Window | Max   | Scope     |
|----------------|--------|-------|-----------|
| Standard       | 15 min | 200   | All routes|
| Auth           | 15 min | 50    | /auth/*   |

Both use in-memory store (express-rate-limit default). In production with multiple instances, a shared store (Redis) should be used.

### Input Validation

- **Zod schemas** at the route level validate request bodies, params, and query strings
- **Mongoose schema validation** provides a second layer of defense
- **HPP** (HTTP Parameter Pollution) protection whitelists known parameters
- **Helmet** sets secure HTTP headers

---

## Key Design Decisions

### 1. Why Soft Deletes with Compound Unique Indexes?

Soft deletes allow data recovery and audit trails while maintaining unique constraint enforcement:
```
warehouseSchema.index({ isDeleted: 1, code: 1 }, { unique: true });
```
This allows re-creating a warehouse with the same code after soft-deleting the original, without conflicts.

### 2. Why Atomic `updateMany` Instead of Read-Then-Write?

**Problem**: Two managers creating pick lists simultaneously could read the same device as "Available", then both attempt to reserve it.

**Solution**: Use MongoDB's atomic `updateMany` with a status filter:
```typescript
const result = await DeviceModel.updateMany(
  { _id: { $in: deviceIds }, status: 'Available' },
  { $set: { status: 'Reserved' } },
);
if (result.modifiedCount !== deviceIds.length) {
  throw new ConflictError('Devices no longer available');
}
```
This is a **compare-and-swap** pattern — only documents matching both `_id` and `status: 'Available'` are updated. If any device was already reserved, `modifiedCount` will be less than expected, and the operation throws.

This avoids the need for pessimistic locks and works without a replica set (though transactions are used for multi-collection consistency).

### 3. Why Denormalized Location on Device?

Devices store their full location path (`binId`, `aisleId`, `zoneId`, `warehouseId`) rather than just `binId`. This eliminates multi-collection joins for:

- Filtering devices by warehouse or zone
- Displaying location in tables without population
- Generating inventory reports

The tradeoff is that moving a device requires updating 4 fields (done atomically in a transaction), but reads are significantly faster.

### 4. Why Repository Pattern?

The repository layer abstracts Mongoose queries behind interfaces, providing:

- **Consistent soft-delete filtering**: All `find` queries automatically filter `isDeleted: { $ne: true }` (except when explicitly overridden)
- **Session propagation**: Methods accept an optional `ClientSession` parameter for transaction support
- **Testability**: Repositories can be mocked for unit testing services

### 5. Why EventEmitter for Notifications/Audit?

Rather than coupling services directly to notification and audit logic, the `EventEmitter` pattern decouples them:

```
pickListService.complete()
  → emit('pick-list:completed', data)
     → listener creates Notification
     → listener creates AuditLog
     → (future) listener sends email/push
```

This keeps services focused on their primary domain logic and allows adding side effects without modifying existing code.

### 6. Why Zustand + React Query Instead of Redux?

- **React Query** handles all server state (caching, background refetch, optimistic updates, pagination), eliminating the most common cause of Redux boilerplate
- **Zustand** handles a small amount of client-only state (auth user/token, theme) with minimal code
- No middleware, no reducers, no action types

### 7. Why Lazy Loading for All Pages?

Every route page uses `React.lazy()` + `Suspense`, splitting the bundle per feature module:

```
dist/assets/
├── warehouse-BdmQUPH0.js      15.6 kB
├── zone-DbxId62v.js           16.8 kB
├── device-RRWud-g_.js         31.1 kB
├── pick-list-DySuZay7.js      20.5 kB
├── order-CbDV3QlX.js          23.8 kB
└── index-D2MMumIP.js         395.6 kB  (shared vendor chunk)
```

This ensures users only download the code for the page they visit.

### 8. MongoDB Requirements

- **Replica set** required for transactions (pick list create/complete/cancel, inventory move, order fulfill)
- A single-node replica set is sufficient for development: `mongod --replSet rs0`
- Connection string must include `?replicaSet=rs0` (or appropriate name)
- Standard settings: `retryWrites=true`, `w=majority`, `maxPoolSize=10`
