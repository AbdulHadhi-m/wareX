# wareX — Warehouse Management System

A production-ready warehouse management system built with React 19, TypeScript, and modern frontend tooling.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Language | TypeScript 6.x |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Data Fetching | TanStack Query v5 |
| HTTP Client | Axios |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| UI Library | shadcn/ui primitives |
| Icons | Lucide React |
| Charts | Recharts |
| Notifications | Sonner |
| Linting | ESLint + Prettier |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

Feature-based architecture with shared UI components:

```
frontend/
├── src/
│   ├── app/                  # App root, providers
│   ├── components/
│   │   ├── common/           # Shared reusable components
│   │   ├── layouts/          # Layout components (Dashboard, Auth, Public)
│   │   └── ui/               # shadcn/ui primitives
│   ├── config/               # Environment and theme configuration
│   ├── constants/            # Route paths, query keys
│   ├── features/             # Feature modules
│   │   ├── auth/             # Authentication (login, token, guards)
│   │   ├── dashboard/        # Dashboard with KPIs and charts
│   │   ├── warehouse/        # Warehouse CRUD
│   │   ├── zone/             # Zone CRUD
│   │   ├── aisle/            # Aisle CRUD
│   │   ├── bin/              # Bin CRUD
│   │   ├── device/           # Device tracking
│   │   ├── inventory/        # Inventory management, moves
│   │   ├── order/            # Order management
│   │   ├── pick-list/        # Pick list management
│   │   ├── notification/     # Notification center
│   │   ├── reports/          # Reports and analytics
│   │   └── placeholder/      # Coming soon pages
│   ├── hooks/                # Shared hooks
│   ├── lib/                  # Axios instance, utility library
│   ├── routes/               # React Router configuration
│   ├── services/             # TanStack Query client
│   ├── store/                # Zustand stores
│   ├── styles/               # Global CSS, Tailwind theme
│   ├── types/                # Shared TypeScript types
│   └── utils/                # Utility functions
```

## Features

- **Authentication**: JWT-based login, protected routes, role-based access (Manager/Worker)
- **Dashboard**: 9 KPI metric cards, 4 interactive Recharts visualizations, recent activity feed, quick actions
- **Warehouse Management**: Full CRUD with search, sort, pagination
- **Zone Management**: Filtered by warehouse, CRUD operations
- **Aisle Management**: Warehouse > Zone cascade filtering
- **Bin Management**: Full hierarchical location tracking
- **Device Tracking**: 14-column table, 9 cascade filters, status/condition tracking, location hierarchy
- **Inventory Management**: Device movement with location history
- **Order Management**: Status workflow, device assignment, pick list generation
- **Pick List Management**: Worker assignment, item tracking
- **Notification Center**: Real-time unread count, mark as read, dropdown preview
- **Reports & Analytics**: 5 report pages, CSV export, status breakdowns
- **UX Features**: Global search (⌘K), command palette, sticky table headers, skeleton loading, mobile navigation drawer, error boundaries, 404/403 pages, dark mode toggle

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Backend API (see [Backend Integration](#backend-integration))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/warex.git
cd warex/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on src/ |
| `npm run typecheck` | TypeScript type checking |
| `npm run format` | Format code with Prettier |

## Environment Variables

Create a `.env.local` file in `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:3000/api/v1` | Backend API base URL |

In production (Vercel), set `VITE_API_URL` in the Vercel project environment variables.

## Production Build

```bash
npm run build
```

Output is in `dist/`. The build includes:
- TypeScript type checking
- Vite production bundling
- Code splitting for each feature module
- CSS extraction and minification
- Asset hashing for cache busting

## Vercel Deployment

Deploy the frontend to Vercel in two ways:

### Option 1: Vercel Dashboard

1. Push code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api/v1`
5. Click **Deploy**

Vercel automatically detects the `vercel.json` configuration:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Option 2: Vercel CLI

```bash
npm i -g vercel
cd frontend
vercel --prod
```

### SPA Routing

`vercel.json` rewrites all routes to `index.html`, ensuring React Router handles navigation correctly including direct URL access and page refresh on nested routes.

## Backend Integration

The frontend connects to a Node.js/Express backend deployed on Render.

### Local Development

```bash
# Start the backend (from backend/ directory)
npm run dev
# Backend runs on http://localhost:3000

# Vite proxy forwards /api requests to the backend
# No CORS issues during development
```

### Production

1. Deploy the backend to Render
2. Set `VITE_API_URL` to your Render backend URL in Vercel environment variables
3. The Axios instance uses `baseURL: env.API_URL` for all requests
4. CORS must be configured on the backend to allow Vercel origin

### Request Flow

```
Browser → Vercel (static files) → Axios → Render (API) → Database
```

- Static assets served from Vercel CDN
- API calls go directly to Render backend
- JWT token stored in localStorage, attached via Axios interceptor
- 401 responses trigger automatic logout

## Screenshots

<!-- TODO: Add screenshots -->
<!--
### Dashboard
![Dashboard](screenshots/dashboard.png)

### Device Management
![Devices](screenshots/devices.png)

### Reports
![Reports](screenshots/reports.png)

### Mobile Navigation
![Mobile](screenshots/mobile-nav.png)
-->

## Project Status

Production-ready. Built for a technical interview demonstrating:

- Enterprise-grade React with TypeScript
- Clean, feature-based architecture
- State management with TanStack Query and Zustand
- Complete authentication and authorization flow
- Reusable component library
- Full CRUD across multiple entities
- Data visualization with Recharts
- Responsive design with mobile navigation
- Accessibility best practices
- Code splitting and performance optimization
- Production deployment configuration
