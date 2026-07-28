import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

export const createOrderSchema = z.object({
  customerName: z
    .string({ required_error: 'Customer name is required' })
    .min(1, 'Customer name cannot be empty')
    .max(200, 'Customer name must be at most 200 characters'),
  customerReference: z
    .string()
    .max(100, 'Customer reference must be at most 100 characters')
    .optional(),
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

export const updateOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name cannot be empty')
    .max(200, 'Customer name must be at most 200 characters')
    .optional(),
  customerReference: z
    .string()
    .max(100, 'Customer reference must be at most 100 characters')
    .optional(),
  deviceIds: z
    .array(objectId)
    .min(1, 'At least one device is required')
    .refine((ids) => new Set(ids).size === ids.length, {
      message: 'Duplicate device IDs are not allowed',
    })
    .optional(),
  priority: z
    .enum(['Low', 'Medium', 'High', 'Urgent'], {
      invalid_type_error: 'Invalid priority',
    })
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional(),
});

export const orderIdParamSchema = z.object({
  id: objectId.refine((v) => v.length === 24, 'Invalid order ID'),
});

export const orderQuerySchema = z.object({
  status: z
    .enum(['Draft', 'Pending', 'Picking', 'Ready', 'Fulfilled', 'Cancelled'])
    .optional(),
  customerName: z
    .string()
    .max(200)
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
