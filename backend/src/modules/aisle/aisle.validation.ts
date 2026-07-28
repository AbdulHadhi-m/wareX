import { z } from 'zod';

export const createAisleSchema = z.object({
  zoneId: z
    .string({ required_error: 'Zone ID is required' })
    .regex(/^[a-f\d]{24}$/i, 'Invalid zone ID'),
  name: z
    .string({ required_error: 'Aisle name is required' })
    .min(1, 'Aisle name cannot be empty')
    .max(200, 'Aisle name must be at most 200 characters'),
  code: z
    .string({ required_error: 'Aisle code is required' })
    .min(1, 'Aisle code cannot be empty')
    .max(50, 'Aisle code must be at most 50 characters'),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be either Active or Inactive',
  }),
});

export const updateAisleSchema = z.object({
  name: z
    .string()
    .min(1, 'Aisle name cannot be empty')
    .max(200, 'Aisle name must be at most 200 characters')
    .optional(),
  code: z
    .string()
    .min(1, 'Aisle code cannot be empty')
    .max(50, 'Aisle code must be at most 50 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  status: z
    .enum(['Active', 'Inactive'], {
      invalid_type_error: 'Status must be either Active or Inactive',
    })
    .optional(),
});

export const aisleIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid aisle ID'),
});

export const zoneIdParamSchema = z.object({
  zoneId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid zone ID'),
});
