import { z } from 'zod';

export const createBinSchema = z.object({
  aisleId: z.string().min(1, 'Aisle is required'),
  name: z
    .string()
    .min(1, 'Bin name is required')
    .max(200, 'Name must be at most 200 characters'),
  code: z
    .string()
    .min(1, 'Bin code is required')
    .max(50, 'Code must be at most 50 characters'),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
  capacity: z
    .number({ required_error: 'Capacity is required', invalid_type_error: 'Capacity must be a number' })
    .int('Capacity must be a whole number')
    .positive('Capacity must be greater than zero'),
  status: z.enum(['Available', 'Full', 'Blocked', 'Inactive'], {
    required_error: 'Status is required',
  }),
});

export const updateBinSchema = z.object({
  name: z
    .string()
    .min(1, 'Bin name is required')
    .max(200, 'Name must be at most 200 characters')
    .optional(),
  code: z
    .string()
    .min(1, 'Bin code is required')
    .max(50, 'Code must be at most 50 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
  capacity: z
    .number({ invalid_type_error: 'Capacity must be a number' })
    .int('Capacity must be a whole number')
    .positive('Capacity must be greater than zero')
    .optional(),
  status: z.enum(['Available', 'Full', 'Blocked', 'Inactive']).optional(),
});

export type CreateBinFormData = z.infer<typeof createBinSchema>;
export type UpdateBinFormData = z.infer<typeof updateBinSchema>;
