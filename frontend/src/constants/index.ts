export const API_PREFIX = '/api/v1';

export const ROUTES = {
  DASHBOARD: '/dashboard',
  WAREHOUSES: '/warehouses',
  ZONES: '/zones',
  AISLES: '/aisles',
  BINS: '/bins',
  DEVICES: '/devices',
  INVENTORY: '/inventory',
  PICK_LISTS: '/pick-lists',
  ORDERS: '/orders',
  NOTIFICATIONS: '/notifications',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  NOT_FOUND: '/404',
  ACCESS_DENIED: '/access-denied',
} as const;

export const QUERY_KEYS = {
  WAREHOUSES: ['warehouses'] as const,
  ZONES: ['zones'] as const,
  AISLES: ['aisles'] as const,
  BINS: ['bins'] as const,
  DEVICES: ['devices'] as const,
  INVENTORY: ['inventory'] as const,
  PICK_LISTS: ['pick-lists'] as const,
  ORDERS: ['orders'] as const,
  NOTIFICATIONS: ['notifications'] as const,
  REPORTS: ['reports'] as const,
  ADMIN_USERS: ['admin-users'] as const,
  AUDIT_LOGS: ['audit-logs'] as const,
  DASHBOARD: {
    SUMMARY: ['dashboard', 'summary'] as const,
    DEVICE_STATUS: ['dashboard', 'device-status'] as const,
    ORDER_STATUS: ['dashboard', 'order-status'] as const,
    WAREHOUSE_UTILIZATION: ['dashboard', 'warehouse-utilization'] as const,
    RECENT_ORDERS: ['dashboard', 'recent-orders'] as const,
    RECENT_PICK_LISTS: ['dashboard', 'recent-pick-lists'] as const,
    RECENT_NOTIFICATIONS: ['dashboard', 'recent-notifications'] as const,
  },
} as const;
