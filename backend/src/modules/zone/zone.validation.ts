import { z } from 'zod';

export const createZoneSchema = z.object({
  warehouseId: z
    .string({ required_error: 'Warehouse ID is required' })
    .regex(/^[a-f\d]{24}$/i, 'Invalid warehouse ID'),
  name: z
    .string({ required_error: 'Zone name is required' })
    .min(1, 'Zone name cannot be empty')
    .max(200, 'Zone name must be at most 200 characters'),
  code: z
    .string({ required_error: 'Zone code is required' })
    .min(1, 'Zone code cannot be empty')
    .max(50, 'Zone code must be at most 50 characters'),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be either Active or Inactive',
  }),
});

export const updateZoneSchema = z.object({
  name: z
    .string()
    .min(1, 'Zone name cannot be empty')
    .max(200, 'Zone name must be at most 200 characters')
    .optional(),
  code: z
    .string()
    .min(1, 'Zone code cannot be empty')
    .max(50, 'Zone code must be at most 50 characters')
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

export const zoneIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid zone ID'),
});

export const warehouseIdParamSchema = z.object({
  warehouseId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid warehouse ID'),
});
