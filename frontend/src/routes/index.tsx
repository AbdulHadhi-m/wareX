import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout, AuthLayout, PublicLayout } from '@/components/layouts';
import { ROUTES } from '@/constants';
import { ComingSoonPage } from '@/features/placeholder/pages/coming-soon-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <ComingSoonPage
            title="Dashboard"
            description="Overview of warehouse operations and key metrics."
          />
        ),
      },
      {
        path: ROUTES.WAREHOUSES,
        element: (
          <ComingSoonPage
            title="Warehouses"
            description="Manage warehouse locations and facilities."
          />
        ),
      },
      {
        path: ROUTES.ZONES,
        element: (
          <ComingSoonPage
            title="Zones"
            description="Organize warehouse spaces into functional zones."
          />
        ),
      },
      {
        path: ROUTES.AISLES,
        element: (
          <ComingSoonPage
            title="Aisles"
            description="Configure aisles within warehouse zones."
          />
        ),
      },
      {
        path: ROUTES.BINS,
        element: (
          <ComingSoonPage
            title="Bins"
            description="Define storage bins for device placement."
          />
        ),
      },
      {
        path: ROUTES.DEVICES,
        element: (
          <ComingSoonPage
            title="Devices"
            description="Track and manage all devices in inventory."
          />
        ),
      },
      {
        path: ROUTES.INVENTORY,
        element: (
          <ComingSoonPage
            title="Inventory"
            description="View and manage device locations and movements."
          />
        ),
      },
      {
        path: ROUTES.PICK_LISTS,
        element: (
          <ComingSoonPage
            title="Pick Lists"
            description="Create and manage picking tasks for orders."
          />
        ),
      },
      {
        path: ROUTES.ORDERS,
        element: (
          <ComingSoonPage
            title="Orders"
            description="Manage customer orders and fulfillment."
          />
        ),
      },
      {
        path: ROUTES.NOTIFICATIONS,
        element: (
          <ComingSoonPage
            title="Notifications"
            description="View system alerts and notifications."
          />
        ),
      },
      {
        path: ROUTES.REPORTS,
        element: (
          <ComingSoonPage
            title="Reports"
            description="Generate and view operational reports."
          />
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <ComingSoonPage
            title="Settings"
            description="Configure system preferences and user settings."
          />
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: 'login',
        element: (
          <ComingSoonPage
            title="Sign In"
            description="Authentication coming soon."
          />
        ),
      },
      {
        path: 'register',
        element: (
          <ComingSoonPage
            title="Create Account"
            description="Registration coming soon."
          />
        ),
      },
    ],
  },
  {
    path: '/public',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
