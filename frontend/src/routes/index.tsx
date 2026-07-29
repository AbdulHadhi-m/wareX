import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout, AuthLayout, PublicLayout } from '@/components/layouts';
import { ROUTES } from '@/constants';
import { ComingSoonPage } from '@/features/placeholder/pages/coming-soon-page';
import { ProtectedRoute, GuestRoute, LoginPage, RegisterPage } from '@/features/auth';
import { NotFoundPage } from '@/components/common/not-found-page';
import { AccessDeniedPage } from '@/components/common/access-denied-page';
import { LoadingSpinner } from '@/components/common/loading-spinner';

function SuspenseWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-[60vh]" />}>
      <Outlet />
    </Suspense>
  );
}

const DashboardPage = lazy(() =>
  import('@/features/dashboard').then((m) => ({ default: m.DashboardPage })),
);
const WarehouseListPage = lazy(() =>
  import('@/features/warehouse').then((m) => ({ default: m.WarehouseListPage })),
);
const CreateWarehousePage = lazy(() =>
  import('@/features/warehouse').then((m) => ({ default: m.CreateWarehousePage })),
);
const EditWarehousePage = lazy(() =>
  import('@/features/warehouse').then((m) => ({ default: m.EditWarehousePage })),
);
const WarehouseDetailsPage = lazy(() =>
  import('@/features/warehouse').then((m) => ({ default: m.WarehouseDetailsPage })),
);
const ZoneListPage = lazy(() =>
  import('@/features/zone').then((m) => ({ default: m.ZoneListPage })),
);
const CreateZonePage = lazy(() =>
  import('@/features/zone').then((m) => ({ default: m.CreateZonePage })),
);
const EditZonePage = lazy(() =>
  import('@/features/zone').then((m) => ({ default: m.EditZonePage })),
);
const ZoneDetailsPage = lazy(() =>
  import('@/features/zone').then((m) => ({ default: m.ZoneDetailsPage })),
);
const AisleListPage = lazy(() =>
  import('@/features/aisle').then((m) => ({ default: m.AisleListPage })),
);
const CreateAislePage = lazy(() =>
  import('@/features/aisle').then((m) => ({ default: m.CreateAislePage })),
);
const EditAislePage = lazy(() =>
  import('@/features/aisle').then((m) => ({ default: m.EditAislePage })),
);
const AisleDetailsPage = lazy(() =>
  import('@/features/aisle').then((m) => ({ default: m.AisleDetailsPage })),
);
const BinListPage = lazy(() =>
  import('@/features/bin').then((m) => ({ default: m.BinListPage })),
);
const CreateBinPage = lazy(() =>
  import('@/features/bin').then((m) => ({ default: m.CreateBinPage })),
);
const EditBinPage = lazy(() =>
  import('@/features/bin').then((m) => ({ default: m.EditBinPage })),
);
const BinDetailsPage = lazy(() =>
  import('@/features/bin').then((m) => ({ default: m.BinDetailsPage })),
);
const DeviceListPage = lazy(() =>
  import('@/features/device').then((m) => ({ default: m.DeviceListPage })),
);
const CreateDevicePage = lazy(() =>
  import('@/features/device').then((m) => ({ default: m.CreateDevicePage })),
);
const EditDevicePage = lazy(() =>
  import('@/features/device').then((m) => ({ default: m.EditDevicePage })),
);
const DeviceDetailsPage = lazy(() =>
  import('@/features/device').then((m) => ({ default: m.DeviceDetailsPage })),
);
const InventoryDashboardPage = lazy(() =>
  import('@/features/inventory').then((m) => ({ default: m.InventoryDashboardPage })),
);
const MoveDevicePage = lazy(() =>
  import('@/features/inventory').then((m) => ({ default: m.MoveDevicePage })),
);
const DeviceHistoryPage = lazy(() =>
  import('@/features/inventory').then((m) => ({ default: m.DeviceHistoryPage })),
);
const OrderListPage = lazy(() =>
  import('@/features/order').then((m) => ({ default: m.OrderListPage })),
);
const CreateOrderPage = lazy(() =>
  import('@/features/order').then((m) => ({ default: m.CreateOrderPage })),
);
const EditOrderPage = lazy(() =>
  import('@/features/order').then((m) => ({ default: m.EditOrderPage })),
);
const OrderDetailsPage = lazy(() =>
  import('@/features/order').then((m) => ({ default: m.OrderDetailsPage })),
);
const NotificationListPage = lazy(() =>
  import('@/features/notification').then((m) => ({ default: m.NotificationListPage })),
);
const NotificationDetailsPage = lazy(() =>
  import('@/features/notification').then((m) => ({ default: m.NotificationDetailsPage })),
);
const ReportsDashboardPage = lazy(() =>
  import('@/features/reports').then((m) => ({ default: m.ReportsDashboardPage })),
);
const DeviceReportsPage = lazy(() =>
  import('@/features/reports').then((m) => ({ default: m.DeviceReportsPage })),
);
const InventoryReportsPage = lazy(() =>
  import('@/features/reports').then((m) => ({ default: m.InventoryReportsPage })),
);
const OrderReportsPage = lazy(() =>
  import('@/features/reports').then((m) => ({ default: m.OrderReportsPage })),
);
const PickListReportsPage = lazy(() =>
  import('@/features/reports').then((m) => ({ default: m.PickListReportsPage })),
);

const AdminUserListPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.UserListPage })),
);
const AdminCreateUserPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.CreateUserPage })),
);
const AdminEditUserPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.EditUserPage })),
);
const AdminUserDetailsPage = lazy(() =>
  import('@/features/admin').then((m) => ({ default: m.UserDetailsPage })),
);

const HeroPage = lazy(() =>
  import('@/features/hero').then((m) => ({ default: m.HeroPage })),
);

function RootLayout() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HeroPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: 'warehouses',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <WarehouseListPage /> },
              { path: 'new', element: <CreateWarehousePage /> },
              { path: ':id', element: <WarehouseDetailsPage /> },
              { path: ':id/edit', element: <EditWarehousePage /> },
            ],
          },
          {
            path: 'zones',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <ZoneListPage /> },
              { path: 'new', element: <CreateZonePage /> },
              { path: ':id', element: <ZoneDetailsPage /> },
              { path: ':id/edit', element: <EditZonePage /> },
            ],
          },
          {
            path: 'aisles',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <AisleListPage /> },
              { path: 'new', element: <CreateAislePage /> },
              { path: ':id', element: <AisleDetailsPage /> },
              { path: ':id/edit', element: <EditAislePage /> },
            ],
          },
          {
            path: 'bins',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <BinListPage /> },
              { path: 'new', element: <CreateBinPage /> },
              { path: ':id', element: <BinDetailsPage /> },
              { path: ':id/edit', element: <EditBinPage /> },
            ],
          },
          {
            path: 'devices',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <DeviceListPage /> },
              { path: 'new', element: <CreateDevicePage /> },
              { path: ':id', element: <DeviceDetailsPage /> },
              { path: ':id/edit', element: <EditDevicePage /> },
            ],
          },
          {
            path: 'inventory',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <InventoryDashboardPage /> },
              { path: 'move/:deviceId', element: <MoveDevicePage /> },
              { path: 'history/:deviceId', element: <DeviceHistoryPage /> },
            ],
          },
          {
            path: 'pick-lists',
            element: (
              <ComingSoonPage
                title="Pick Lists"
                description="Create and manage picking tasks for orders."
              />
            ),
          },
          {
            path: 'orders',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <OrderListPage /> },
              { path: 'new', element: <CreateOrderPage /> },
              { path: ':id', element: <OrderDetailsPage /> },
              { path: ':id/edit', element: <EditOrderPage /> },
            ],
          },
          {
            path: 'notifications',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <NotificationListPage /> },
              { path: ':id', element: <NotificationDetailsPage /> },
            ],
          },
          {
            path: 'reports',
            element: <SuspenseWrapper />,
            children: [
              { index: true, element: <ReportsDashboardPage /> },
              { path: 'devices', element: <DeviceReportsPage /> },
              { path: 'inventory', element: <InventoryReportsPage /> },
              { path: 'orders', element: <OrderReportsPage /> },
              { path: 'pick-lists', element: <PickListReportsPage /> },
            ],
          },
          {
            path: 'settings',
            element: (
              <ProtectedRoute roles={['Manager']}>
                <ComingSoonPage
                  title="Settings"
                  description="Configure system preferences and user settings."
                />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admin/users',
            element: (
              <ProtectedRoute roles={['SuperAdmin']}>
                <SuspenseWrapper />
              </ProtectedRoute>
            ),
            children: [
              { index: true, element: <AdminUserListPage /> },
              { path: 'new', element: <AdminCreateUserPage /> },
              { path: ':id', element: <AdminUserDetailsPage /> },
              { path: ':id/edit', element: <AdminEditUserPage /> },
            ],
          },
          {
            path: 'admin/audit-logs',
            element: (
              <ProtectedRoute roles={['SuperAdmin']}>
                <SuspenseWrapper />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: (
                  <ComingSoonPage
                    title="Audit Logs"
                    description="View system-wide audit logs for all user actions."
                  />
                ),
              },
            ],
          },
          {
            path: 'access-denied',
            element: <AccessDeniedPage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
      {
        path: 'auth',
        element: (
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        ),
        children: [
          { index: true, element: <Navigate to={ROUTES.AUTH.LOGIN} replace /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
      {
        path: 'public',
        element: <PublicLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
        ],
      },
      { path: 'warehouses/*', element: <Navigate to="/dashboard/warehouses" replace /> },
      { path: 'zones/*', element: <Navigate to="/dashboard/zones" replace /> },
      { path: 'aisles/*', element: <Navigate to="/dashboard/aisles" replace /> },
      { path: 'bins/*', element: <Navigate to="/dashboard/bins" replace /> },
      { path: 'devices/*', element: <Navigate to="/dashboard/devices" replace /> },
      { path: 'inventory/*', element: <Navigate to="/dashboard/inventory" replace /> },
      { path: 'orders/*', element: <Navigate to="/dashboard/orders" replace /> },
      { path: 'reports/*', element: <Navigate to="/dashboard/reports" replace /> },
      { path: 'settings/*', element: <Navigate to="/dashboard/settings" replace /> },
      { path: 'users/*', element: <Navigate to="/dashboard/admin/users" replace /> },
      { path: 'audit-logs/*', element: <Navigate to="/dashboard/admin/audit-logs" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
