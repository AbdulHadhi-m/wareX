import { z } from 'zod';

export const createWarehouseSchema = z.object({
  name: z
    .string()
    .min(1, 'Warehouse name is required')
    .max(200, 'Name must be at most 200 characters'),
  code: z
    .string()
    .min(1, 'Warehouse code is required')
    .max(50, 'Code must be at most 50 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional().or(z.literal('')),
  address: z.string().max(500, 'Address must be at most 500 characters').optional().or(z.literal('')),
  city: z.string().max(100, 'City must be at most 100 characters').optional().or(z.literal('')),
  state: z.string().max(100, 'State must be at most 100 characters').optional().or(z.literal('')),
  country: z.string().max(100, 'Country must be at most 100 characters').optional().or(z.literal('')),
  postalCode: z.string().max(20, 'Postal code must be at most 20 characters').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive'], { required_error: 'Status is required' }),
});

export const updateWarehouseSchema = z.object({
  name: z.string().min(1, 'Warehouse name is required').max(200, 'Name must be at most 200 characters').optional(),
  code: z.string().min(1, 'Warehouse code is required').max(50, 'Code must be at most 50 characters').optional(),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional().or(z.literal('')),
  address: z.string().max(500, 'Address must be at most 500 characters').optional().or(z.literal('')),
  city: z.string().max(100, 'City must be at most 100 characters').optional().or(z.literal('')),
  state: z.string().max(100, 'State must be at most 100 characters').optional().or(z.literal('')),
  country: z.string().max(100, 'Country must be at most 100 characters').optional().or(z.literal('')),
  postalCode: z.string().max(20, 'Postal code must be at most 20 characters').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive']).optional(),
});

export type CreateWarehouseFormData = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseFormData = z.infer<typeof updateWarehouseSchema>;
