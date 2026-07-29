import { z } from 'zod';

export const createPermissionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  code: z
    .string({ required_error: 'Code is required' })
    .min(1, 'Code is required')
    .max(100, 'Code must be at most 100 characters')
    .regex(/^[a-z]+\.[a-z-]+$/, 'Code must be in format "module.action" (e.g., warehouse.create)'),
  module: z
    .string({ required_error: 'Module is required' })
    .min(1, 'Module is required')
    .max(50, 'Module must be at most 50 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .default(''),
});

export const updatePermissionSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
});
