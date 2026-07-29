import { z } from 'zod';

export const createZoneSchema = z.object({
  warehouseId: z.string().min(1, 'Warehouse is required'),
  name: z
    .string()
    .min(1, 'Zone name is required')
    .max(200, 'Name must be at most 200 characters'),
  code: z
    .string()
    .min(1, 'Zone code is required')
    .max(50, 'Code must be at most 50 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive'], { required_error: 'Status is required' }),
});

export const updateZoneSchema = z.object({
  name: z.string().min(1, 'Zone name is required').max(200, 'Name must be at most 200 characters').optional(),
  code: z.string().min(1, 'Zone code is required').max(50, 'Code must be at most 50 characters').optional(),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive']).optional(),
});

export type CreateZoneFormData = z.infer<typeof createZoneSchema>;
export type UpdateZoneFormData = z.infer<typeof updateZoneSchema>;
