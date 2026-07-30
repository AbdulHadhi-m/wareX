import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleId: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
}).refine((data) => data.roleId || data.role, {
  message: 'Role is required',
  path: ['role'],
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').or(z.literal('')).optional(),
  roleId: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const userListQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  roleId: z.string().optional(),
  role: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
});
