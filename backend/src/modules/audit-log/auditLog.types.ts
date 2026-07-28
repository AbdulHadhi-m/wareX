export interface IAuditLog {
  _id: string;
  userId: string;
  userName: string | null;
  userRole: string;
  module: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  previousData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface AuditLogResponse {
  id: string;
  userId: string;
  userName: string | null;
  userRole: string;
  module: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  previousData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogSearchParams {
  userId?: string;
  module?: string;
  action?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface AuditLogCreateDTO {
  userId: string;
  userRole: string;
  module: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  previousData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
}
