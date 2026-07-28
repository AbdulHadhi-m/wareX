export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    name: string;
    message: string;
    details?: unknown;
  };
  meta?: PaginationMeta;
}

import type { ComponentType } from 'react';

export interface NavigationItem {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
}
