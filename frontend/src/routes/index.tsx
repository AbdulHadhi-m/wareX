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
import {
  ZoneListPage,
  CreateZonePage,
  EditZonePage,
  ZoneDetailsPage,
} from '@/features/zone';
import {
  BinListPage,
  CreateBinPage,
  EditBinPage,
  BinDetailsPage,
} from '@/features/bin';
import {
  DeviceListPage,
  CreateDevicePage,
  EditDevicePage,
  DeviceDetailsPage,
} from '@/features/device';
import {
  InventoryDashboardPage,
  MoveDevicePage,
  DeviceHistoryPage,
} from '@/features/inventory';
import {
  OrderListPage,
  CreateOrderPage,
  EditOrderPage,
  OrderDetailsPage,
} from '@/features/order';

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
        children: [
          { index: true, element: <ZoneListPage /> },
          { path: 'new', element: <CreateZonePage /> },
          { path: ':id', element: <ZoneDetailsPage /> },
          { path: ':id/edit', element: <EditZonePage /> },
        ],
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
        children: [
          { index: true, element: <BinListPage /> },
          { path: 'new', element: <CreateBinPage /> },
          { path: ':id', element: <BinDetailsPage /> },
          { path: ':id/edit', element: <EditBinPage /> },
        ],
      },
      {
        path: ROUTES.DEVICES,
        children: [
          { index: true, element: <DeviceListPage /> },
          { path: 'new', element: <CreateDevicePage /> },
          { path: ':id', element: <DeviceDetailsPage /> },
          { path: ':id/edit', element: <EditDevicePage /> },
        ],
      },
      {
        path: ROUTES.INVENTORY,
        children: [
          { index: true, element: <InventoryDashboardPage /> },
          { path: 'move/:deviceId', element: <MoveDevicePage /> },
          { path: 'history/:deviceId', element: <DeviceHistoryPage /> },
        ],
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
        children: [
          { index: true, element: <OrderListPage /> },
          { path: 'new', element: <CreateOrderPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
          { path: ':id/edit', element: <EditOrderPage /> },
        ],
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
