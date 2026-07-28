import { z } from 'zod';

export const auditLogQuerySchema = z.object({
  userId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid user ID')
    .optional(),
  module: z
    .string()
    .max(50)
    .optional(),
  action: z
    .string()
    .max(50)
    .optional(),
  resourceType: z
    .string()
    .max(50)
    .optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/, 'Invalid start date format')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/, 'Invalid end date format')
    .optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().positive().optional()),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().positive().max(100).optional()),
  sortBy: z
    .string()
    .optional()
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
});
