import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  role: z.enum(['SuperAdmin', 'Manager', 'Worker'], {
    required_error: 'Role is required',
  }),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  role: z.enum(['SuperAdmin', 'Manager', 'Worker']).optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
