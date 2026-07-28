import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout, AuthLayout, PublicLayout } from '@/components/layouts';
import { ROUTES } from '@/constants';
import { ComingSoonPage } from '@/features/placeholder/pages/coming-soon-page';
import { ProtectedRoute, GuestRoute, LoginPage } from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import {
  WarehouseListPage,
  CreateWarehousePage,
  EditWarehousePage,
  WarehouseDetailsPage,
} from '@/features/warehouse';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.WAREHOUSES,
        children: [
          { index: true, element: <WarehouseListPage /> },
          { path: 'new', element: <CreateWarehousePage /> },
          { path: ':id', element: <WarehouseDetailsPage /> },
          { path: ':id/edit', element: <EditWarehousePage /> },
        ],
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
          <ProtectedRoute roles={['Manager']}>
            <ComingSoonPage
              title="Settings"
              description="Configure system preferences and user settings."
            />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
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
