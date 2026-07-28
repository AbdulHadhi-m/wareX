import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

export const createPickListSchema = z.object({
  workerId: objectId.optional(),
  deviceIds: z
    .array(objectId, { required_error: 'Device IDs are required' })
    .min(1, 'At least one device is required')
    .refine((ids) => new Set(ids).size === ids.length, {
      message: 'Duplicate device IDs are not allowed',
    }),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent'], {
    required_error: 'Priority is required',
    invalid_type_error: 'Invalid priority',
  }),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional(),
});

export const assignPickListSchema = z.object({
  workerId: objectId.refine((v) => v.length === 24, 'Invalid worker ID'),
});

export const pickListIdParamSchema = z.object({
  id: objectId.refine((v) => v.length === 24, 'Invalid pick list ID'),
});

export const workerIdParamSchema = z.object({
  workerId: objectId.refine((v) => v.length === 24, 'Invalid worker ID'),
});

export const pickListQuerySchema = z.object({
  status: z
    .enum(['Draft', 'Assigned', 'In Progress', 'Completed', 'Cancelled'])
    .optional(),
  workerId: objectId.optional(),
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
