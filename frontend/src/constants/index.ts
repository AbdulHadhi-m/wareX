export const API_PREFIX = '/api/v1';

export const ROUTES = {
  DASHBOARD: '/',
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
  DASHBOARD: ['dashboard'] as const,
} as const;
