import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .default(''),
  permissionIds: z
    .array(z.string({ required_error: 'Permission ID is required' }))
    .min(1, 'At least one permission is required'),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  permissionIds: z
    .array(z.string({ required_error: 'Permission ID is required' }))
    .optional(),
});
