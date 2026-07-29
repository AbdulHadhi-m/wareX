import { z } from 'zod';

export const createAisleSchema = z.object({
  zoneId: z.string().min(1, 'Zone is required'),
  name: z
    .string()
    .min(1, 'Aisle name is required')
    .max(200, 'Name must be at most 200 characters'),
  code: z
    .string()
    .min(1, 'Aisle code is required')
    .max(50, 'Code must be at most 50 characters'),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive'], { required_error: 'Status is required' }),
});

export const updateAisleSchema = z.object({
  name: z.string().min(1, 'Aisle name is required').max(200, 'Name must be at most 200 characters').optional(),
  code: z.string().min(1, 'Aisle code is required').max(50, 'Code must be at most 50 characters').optional(),
  description: z.string().max(1000, 'Description must be at most 1000 characters').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive']).optional(),
});

export type CreateAisleFormData = z.infer<typeof createAisleSchema>;
export type UpdateAisleFormData = z.infer<typeof updateAisleSchema>;
