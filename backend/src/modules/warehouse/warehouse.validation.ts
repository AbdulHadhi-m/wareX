import { z } from 'zod';

export const createWarehouseSchema = z.object({
  name: z
    .string({ required_error: 'Warehouse name is required' })
    .min(1, 'Warehouse name cannot be empty')
    .max(200, 'Warehouse name must be at most 200 characters'),
  code: z
    .string({ required_error: 'Warehouse code is required' })
    .min(1, 'Warehouse code cannot be empty')
    .max(50, 'Warehouse code must be at most 50 characters'),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  address: z
    .string()
    .max(500, 'Address must be at most 500 characters')
    .optional(),
  city: z
    .string()
    .max(100, 'City must be at most 100 characters')
    .optional(),
  state: z
    .string()
    .max(100, 'State must be at most 100 characters')
    .optional(),
  country: z
    .string()
    .max(100, 'Country must be at most 100 characters')
    .optional(),
  postalCode: z
    .string()
    .max(20, 'Postal code must be at most 20 characters')
    .optional(),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be either Active or Inactive',
  }),
});

export const updateWarehouseSchema = z.object({
  name: z
    .string()
    .min(1, 'Warehouse name cannot be empty')
    .max(200, 'Warehouse name must be at most 200 characters')
    .optional(),
  code: z
    .string()
    .min(1, 'Warehouse code cannot be empty')
    .max(50, 'Warehouse code must be at most 50 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  address: z
    .string()
    .max(500, 'Address must be at most 500 characters')
    .optional(),
  city: z
    .string()
    .max(100, 'City must be at most 100 characters')
    .optional(),
  state: z
    .string()
    .max(100, 'State must be at most 100 characters')
    .optional(),
  country: z
    .string()
    .max(100, 'Country must be at most 100 characters')
    .optional(),
  postalCode: z
    .string()
    .max(20, 'Postal code must be at most 20 characters')
    .optional(),
  status: z
    .enum(['Active', 'Inactive'], {
      invalid_type_error: 'Status must be either Active or Inactive',
    })
    .optional(),
});

export const warehouseIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid warehouse ID'),
});
