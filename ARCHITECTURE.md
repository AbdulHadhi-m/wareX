# wareX — Warehouse Management System

## Architecture Documentation

---

# 1. Project Overview

wareX is a Warehouse Management System (WMS) designed to streamline inventory tracking, order fulfillment, staff task management, and warehouse zone utilization for mid-size logistics operations. It exposes a RESTful API consumed by a frontend SPA and mobile clients.

**Tech Stack**

| Layer | Technology |
|---|---|
| Runtime | Node.js (≥18 LTS) |
| Language | TypeScript (strict mode) |
| Web Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| API Style | REST / JSON |
| Architecture | Clean Architecture + Modular Monolith |

---

# 2. Business Problem

Mid-size warehouses operate dozens of daily workflows — receiving, put-away, picking, packing, shipping, cycle counting — that are currently managed via spreadsheets, legacy desktop applications, or siloed point solutions. This causes:

- **Inventory drift** — real stock levels rarely match the system of record.
- **Order delays** — pickers and packers lack visibility into priority queues.
- **Wasted labor** — staff are assigned to zones manually, leading to idle time or congestion.
- **Poor traceability** — no audit trail for stock movements or user actions.
- **Integration friction** — existing systems expose no APIs, making automation impossible.

wareX replaces this with a single, API-first system that provides real-time inventory accuracy, role-based task orchestration, and an integration-ready interface.

---

# 3. Functional Requirements

### FR-1 — Inventory Management
- Create, read, update, soft-delete products (SKU, name, category, dimensions, weight).
- Track stock levels per product across multiple warehouse zones (zone-level inventory).
- Record inventory transactions (receipt, transfer, adjustment, removal) with reason codes.
- Support cycle counting workflows (generate count requests, record counts, resolve discrepancies).

### FR-2 — Order Fulfillment
- Ingest sales orders via API (order lines, priority, shipping address, requested date).
- Allocate inventory to orders from available zone stock.
- Generate pick lists grouped by warehouse zone for efficiency.
- Support pick → pack → ship workflow with status transitions and timestamps.
- Handle partial shipments, back-orders, and order cancellations.

### FR-3 — Warehouse Zone & Location Management
- Define zones (Receiving, Bulk Storage, Fast-Moving, Cold Storage, Shipping).
- Define locations within zones (rack, shelf, bin) with capacity constraints.
- Assign products to preferred locations; support location recommendations on put-away.

### FR-4 — Staff & Task Management
- Authenticate users via email/password or API keys (for machine-to-machine).
- Authorize actions via role-based access control (RBAC).
- Create and assign tasks (pick, pack, receive, count) to users or teams.
- Track task status, duration, and completion rate.

### FR-5 — Reporting & Audit
- Export inventory snapshot (CSV / JSON) at any point in time.
- Audit log for every state-changing operation (who, what, when, previous value, new value).
- Basic operational dashboard metrics: open orders, pick completion rate, inventory accuracy %.

---

# 4. Non-Functional Requirements

| ID | Requirement | Rationale |
|---|---|---|
| NFR-1 | Response time < 300 ms (p95) for read endpoints; < 500 ms for writes under normal load | Warehouse staff cannot wait for screens to load. |
| NFR-2 | Support 200 concurrent users with ≤ 32 GB RAM, 8 vCPU | Mid-size warehouse shifts. |
| NFR-3 | System availability ≥ 99.5% (exc. planned maintenance) | Operations run 16 h/day, 6 days/week. |
| NFR-4 | All state changes must be idempotent or deduplicated where possible | Network retries must not create duplicate orders or inventory movements. |
| NFR-5 | Every mutation must produce an audit event | Compliance and traceability. |
| NFR-6 | New features must be addable without modifying existing modules (open/closed principle) | Team will scale from 1 to 4+ developers. |
| NFR-7 | Horizontal scaling: API layer must be stateless; database must support read replicas | Future growth without rewrite. |

---

# 5. User Roles

| Role | Description | Typical Actions |
|---|---|---|
| `Admin` | Full system access, configuration | Manage users, roles, zones, system settings. |
| `Manager` | Operational oversight | View dashboards, resolve cycle-count discrepancies, reallocate inventory. |
| `Supervisor` | Team coordination | Create & assign tasks, review completion, override allocations. |
| `Operator` | Warehouse floor worker | View assigned tasks, record pick/pack/receive actions. |
| `Integration` (API key) | External system | Ingest orders, query stock levels, push shipment confirmations. |

---

# 6. System Modules

Each module is a vertically-sliced feature owning its domain logic, persistence, and API surface. Modules communicate only through well-defined interfaces — never by importing each other's internals.

| Module | Responsibility | Key Entities |
|---|---|---|
| **Catalog** | Product definitions, categories, attributes | `Product`, `Category` |
| **Inventory** | Stock levels, zone-location assignments, transactions | `StockItem`, `InventoryTransaction` |
| **Ordering** | Sales orders, allocation, pick-list generation | `Order`, `OrderLine`, `Allocation` |
| **Warehouse** | Zones, locations, capacity, put-away strategies | `Zone`, `Location` |
| **Fulfillment** | Task orchestration: pick, pack, ship workflows | `Task`, `Shipment`, `PackingList` |
| **CycleCount** | Count requests, recording, discrepancy resolution | `CountRequest`, `CountEntry` |
| **Identity** | Users, roles, authentication, API keys | `User`, `Role`, `ApiKey` |
| **Audit** | Immutable event log for all state changes | `AuditEvent` |
| **Dashboard** | Read-model projections for operational metrics | Projection documents (denormalized) |

---

# 7. Architecture Decisions

## AD-1: Clean Architecture over MVC

**Decision**: Adopt Clean Architecture (Domain → Application → Infrastructure → Presentation) within each module.

**Context**: MVC couples business logic to framework concerns (controllers, ORM models), making it difficult to swap infrastructure or test business rules without HTTP or database setup.

**Consequence**: Domain entities have zero dependencies. Application services depend only on domain abstractions (ports). Infrastructure implements those ports. Express controllers (presentation) merely translate HTTP to application calls.

## AD-2: Modular Monolith over Microservices

**Decision**: Deploy as a single process with modules isolated by language boundaries (TypeScript modules) and package-level access control.

**Context**: The team is small (1–4). Microservices would introduce network latency, distributed transaction complexity, and operational overhead for no current scaling benefit.

**Consequence**: Modules are strongly encapsulated — no direct imports across module boundaries. Communication happens via in-memory events (EventEmitter) or a shared command bus. If one module grows beyond sustainable complexity, it can be extracted into a separate service with minimal changes because cross-module interfaces are already abstract.

## AD-3: Feature-Based Module Slicing

**Decision**: Organize code by business capability, not technical layer.

**Context**: A layered grouping (e.g., `controllers/`, `services/`, `models/`) causes high coupling — any feature change touches every folder. Feature-based slicing ensures each module is independently understandable and changeable.

**Consequence**: Each module contains its own Clean Architecture layers. A folder like `modules/ordering/` holds `domain/`, `application/`, `infrastructure/`, `presentation/`. Cross-cutting code (shared value objects, base classes) lives in a `shared/` kernel.

## AD-4: Event-Driven Module Communication

**Decision**: Modules emit and subscribe to domain events via an in-memory event bus.

**Context**: When an order is allocated, the Inventory module must reduce stock, and the Audit module must record the event. Direct calls would create coupling.

**Consequence**: Modules publish events like `OrderAllocated`. Any module can subscribe without the publisher knowing. Events are typed and carry only primitive data (no domain objects). This keeps modules decoupled and makes future extraction to microservices (with a message broker) straightforward.

## AD-5: Repository Pattern with Mongoose

**Decision**: Each aggregate root has a repository interface in the domain layer and a Mongoose-backed implementation in infrastructure.

**Context**: Domain logic must not depend on Mongoose specifics (schema, middleware, queries). Otherwise, swapping the database would require rewriting domain logic.

**Consequence**: `IProductRepository` defines `findById`, `save`, `search` — all returning domain entities. `MongooseProductRepository` translates between Mongoose documents and domain objects. Repositories are injected into application services via constructor injection.

## AD-6: Read Models for Queries

**Decision**: Commands go through domain aggregates (CQRS-light); queries read from denormalized projections.

**Context**: Joining across zones, orders, and tasks for the dashboard is slow and convoluted through aggregates.

**Consequence**: On relevant domain events, a projection updater writes to a read-optimized collection (e.g., `dashboard_order_summary`). Queries hit these projections directly, never the transactional collections. This avoids aggregation pipelines at request time.

## AD-7: Soft Deletes with Tombstones

**Decision**: All destructive operations perform soft deletes (`deletedAt` timestamp) rather than physical removal.

**Context**: Audit requirements and historical reporting need to reference entities that are "deleted" (e.g., a discontinued product that appears on old orders).

**Consequence**: Repositories filter out `deletedAt != null` by default, with an explicit `includeDeleted()` option. Unique indexes on SKU or name are partial (`deletedAt: null`) to allow reuse.

---

# 8. Folder Structure

```
wareX/
├── src/
│   ├── shared/                          # Shared Kernel
│   │   ├── domain/
│   │   │   ├── Entity.ts
│   │   │   ├── ValueObject.ts
│   │   │   ├── AggregateRoot.ts
│   │   │   ├── DomainEvent.ts
│   │   │   └── errors/
│   │   ├── application/
│   │   │   ├── Command.ts
│   │   │   ├── Query.ts
│   │   │   ├── CommandHandler.ts
│   │   │   └── QueryHandler.ts
│   │   ├── infrastructure/
│   │   │   ├── EventBus.ts
│   │   │   ├── MongoConnection.ts
│   │   │   ├── BaseMongooseRepository.ts
│   │   │   └── middleware/
│   │   │       ├── errorHandler.ts
│   │   │       ├── authGuard.ts
│   │   │       └── requestLogger.ts
│   │   └── presentation/
│   │       ├── BaseController.ts
│   │       └── responseFormatter.ts
│   │
│   ├── modules/
│   │   ├── catalog/
│   │   │   ├── domain/
│   │   │   │   ├── Product.ts
│   │   │   │   ├── Category.ts
│   │   │   │   ├── IProductRepository.ts
│   │   │   │   └── events/
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   ├── queries/
│   │   │   │   └── services/
│   │   │   ├── infrastructure/
│   │   │   │   ├── schemas/
│   │   │   │   ├── MongooseProductRepository.ts
│   │   │   │   └── projections/
│   │   │   └── presentation/
│   │   │       ├── ProductController.ts
│   │   │       ├── routes.ts
│   │   │       ├── validators.ts
│   │   │       └── dtos/
│   │   │
│   │   ├── inventory/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │
│   │   ├── ordering/
│   │   │   └── ... (same structure)
│   │   │
│   │   ├── warehouse/
│   │   │   └── ...
│   │   │
│   │   ├── fulfillment/
│   │   │   └── ...
│   │   │
│   │   ├── cycle-count/
│   │   │   └── ...
│   │   │
│   │   ├── identity/
│   │   │   └── ...
│   │   │
│   │   ├── audit/
│   │   │   └── ...
│   │   │
│   │   └── dashboard/
│   │       └── ...
│   │
│   ├── app.ts                           # Express app setup, middleware registration
│   ├── server.ts                        # Entry point, bootstrap
│   └── container.ts                     # DI container wiring (manual / Awilix)
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/
│   ├── seed.ts
│   └── migrate.ts
│
├── .env.example
├── tsconfig.json
├── package.json
└── ARCHITECTURE.md
```

### Module Internal Structure (repeats per module)

```
module-name/
├── domain/
│   ├── <Entity>.ts              # Domain entity (plain TS class, no ORM)
│   ├── <ValueObject>.ts         # Immutable value objects
│   ├── <Aggregate>.ts           # Aggregate root (extends AggregateRoot)
│   ├── I<Repository>.ts         # Repository port (interface)
│   └── events/                  # Domain event classes
│       └── <Something>Happened.ts
├── application/
│   ├── commands/                # Command + Handler pairs
│   │   ├── DoSomethingCommand.ts
│   │   └── DoSomethingHandler.ts
│   ├── queries/                 # Query + Handler pairs
│   │   ├── GetSomethingQuery.ts
│   │   └── GetSomethingHandler.ts
│   ├── services/                # Orchestrators that compose handlers
│   └── dto/                     # Application-level data transfer objects
├── infrastructure/
│   ├── schemas/                 # Mongoose schema + model definitions
│   ├── <Mongoose>Repository.ts  # Repository adapter (implements domain interface)
│   ├── subscriptions/           # Event subscriptions (listeners)
│   └── projections/             # Read-model updaters
└── presentation/
    ├── <Entity>Controller.ts    # Express request handler
    ├── routes.ts                # Express Router (mounted by app.ts)
    ├── validators.ts            # Request validation (Zod or Joi)
    └── dto/                     # API-specific DTOs (input / output)
```

---

# 9. Development Roadmap

## Phase 1 — Foundation (Week 1–2)
- [ ] Set up TypeScript project with strict config, lint, format, pre-commit hooks.
- [ ] Implement shared kernel: `Entity`, `AggregateRoot`, `ValueObject`, `DomainEvent`, base repository.
- [ ] Implement `EventBus` (in-memory) and `MongoConnection` singleton.
- [ ] Wire Express app with global middleware (error handler, request logger, CORS, JSON parser).
- [ ] Implement manual DI container (`container.ts`) for service wiring.
- [ ] Implement **Identity module**: User registration, login, JWT issuance, RBAC guard middleware.
- [ ] Write integration test for identity endpoints.
- [ ] Dockerize application + MongoDB for local development.

## Phase 2 — Core Inventory (Week 3–4)
- [ ] Implement **Catalog module**: CRUD for products and categories.
- [ ] Implement **Warehouse module**: CRUD for zones and locations, capacity validation.
- [ ] Implement **Inventory module**: Zone-level stock tracking, transaction recording, stock adjustments.
- [ ] Wire domain events: `ProductCreated` → audit log; `StockAdjusted` → audit log.
- [ ] Implement inventory lookup query with read model projection.

## Phase 3 — Order Lifecycle (Week 5–6)
- [ ] Implement **Ordering module**: Order ingestion, inventory allocation algorithm, pick-list generation.
- [ ] Implement **Fulfillment module**: Task creation (pick, pack, ship), status tracking, task assignment.
- [ ] Wire events: `OrderAllocated` → reduce stock, create pick tasks; `TaskCompleted` → update shipment status.
- [ ] Implement partial shipment and back-order logic.
- [ ] Integration test for full order → pick → pack → ship flow.

## Phase 4 — Quality & Operations (Week 7–8)
- [ ] Implement **CycleCount module**: Generate count requests, record counts, discrepancy report.
- [ ] Implement **Audit module**: Centralized immutable event log with query API.
- [ ] Implement **Dashboard module**: Projection-based read models for key metrics.
- [ ] Add request rate-limiting, pagination, filtering, sorting where missing.
- [ ] Performance test under 200 concurrent users; optimize slow queries with indexes.
- [ ] API documentation (OpenAPI / Swagger).
- [ ] Production deployment guide (env vars, health check, graceful shutdown).

---

# 10. Assumptions

1. **Single-tenant deployment** — wareX runs as one instance per warehouse. Multi-tenancy is not in scope.
2. **Eventual consistency is acceptable** for dashboard projections and cross-module state (e.g., order → inventory stock reduction propagates within < 1 s).
3. **No real-time / WebSocket** in initial version — clients poll or refresh to see updated state.
4. **External integrations** consume REST APIs; the system does not push webhooks in the first iteration.
5. **Network latency between app and MongoDB is < 2 ms** (same data center / local network).
6. **No barcode / RFID scanning** in initial version — staff type or select from dropdowns (UI scope).
7. **MongoDB is the source of truth** — no read-through cache layer in the initial version.
8. **The team uses feature branches + PR review** — trunk-based development is not a goal.

---

# 11. Trade-offs

| Decision | Benefit | Cost |
|---|---|---|
| **Modular Monolith** vs. Microservices | Simple deployment, no network overhead, easy debugging, strong consistency within a module transaction | Cannot scale modules independently; one long-running request can starve others; eventual extraction effort if monolith grows too large |
| **MongoDB** vs. PostgreSQL | Flexible schema for variable product attributes; native JSON; horizontal scaling via sharding; simpler dev setup | No built-in joins (need application-level or denormalization); weaker ACID guarantees across collections; no schema enforcement at the database level |
| **Mongoose** vs. raw driver | Schema validation at the application layer; middleware (pre-save hashing, etc.); rich query builder with population | Leaky abstraction — it's easy to accidentally couple domain logic to Mongoose documents; performance overhead from document hydration |
| **In-memory EventBus** vs. message broker (RabbitMQ, Kafka) | Zero infrastructure, no latency, no serialization, simpler testing | Events lost on process crash; no replay capability; no consumer group load balancing; extraction to broker later requires interface migration |
| **Manual DI** vs. framework (Awilix, Inversify) | No extra dependency; full control; easier to understand for a small team | Boilerplate grows as modules increase; no auto-resolution or lifecycle management |
| **Soft Deletes** vs. hard deletes | Audit integrity; referential continuity for historical data | Query performance (need `deletedAt` filter on every query); storage bloat over time; potential for unique-index conflicts |
| **Read Models (projections)** vs. aggregation pipelines | Fast queries; simple controller logic; projection data shaped for specific UI needs | Lag between write and read (eventual consistency); duplication of data; additional event handlers to maintain |

---

*wareX v1.0 — Architecture Document — 2026*
