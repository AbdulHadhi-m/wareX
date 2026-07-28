import { z } from 'zod';

export const createBinSchema = z.object({
  aisleId: z
    .string({ required_error: 'Aisle ID is required' })
    .regex(/^[a-f\d]{24}$/i, 'Invalid aisle ID'),
  name: z
    .string({ required_error: 'Bin name is required' })
    .min(1, 'Bin name cannot be empty')
    .max(200, 'Bin name must be at most 200 characters'),
  code: z
    .string({ required_error: 'Bin code is required' })
    .min(1, 'Bin code cannot be empty')
    .max(50, 'Bin code must be at most 50 characters'),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  capacity: z
    .number({ required_error: 'Capacity is required' })
    .int('Capacity must be a positive integer')
    .positive('Capacity must be greater than zero'),
  status: z.enum(['Available', 'Full', 'Blocked', 'Inactive'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be one of: Available, Full, Blocked, Inactive',
  }),
});

export const updateBinSchema = z.object({
  name: z
    .string()
    .min(1, 'Bin name cannot be empty')
    .max(200, 'Bin name must be at most 200 characters')
    .optional(),
  code: z
    .string()
    .min(1, 'Bin code cannot be empty')
    .max(50, 'Bin code must be at most 50 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  capacity: z
    .number()
    .int('Capacity must be a positive integer')
    .positive('Capacity must be greater than zero')
    .optional(),
  status: z
    .enum(['Available', 'Full', 'Blocked', 'Inactive'], {
      invalid_type_error: 'Status must be one of: Available, Full, Blocked, Inactive',
    })
    .optional(),
});

export const binIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid bin ID'),
});

export const aisleIdParamSchema = z.object({
  aisleId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid aisle ID'),
});
