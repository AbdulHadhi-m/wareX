import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .max(200, 'Customer name must be at most 200 characters'),
  customerReference: z
    .string()
    .max(100, 'Reference must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  deviceIds: z
    .array(objectId, { required_error: 'Device IDs are required' })
    .min(1, 'At least one device is required')
    .refine((ids) => new Set(ids).size === ids.length, {
      message: 'Duplicate devices are not allowed',
    }),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent'], {
    required_error: 'Priority is required',
  }),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
});

export const updateOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .max(200, 'Customer name must be at most 200 characters')
    .optional(),
  customerReference: z
    .string()
    .max(100, 'Reference must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  deviceIds: z
    .array(objectId)
    .min(1, 'At least one device is required')
    .refine((ids) => new Set(ids).size === ids.length, {
      message: 'Duplicate devices are not allowed',
    })
    .optional(),
  priority: z
    .enum(['Low', 'Medium', 'High', 'Urgent'])
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
