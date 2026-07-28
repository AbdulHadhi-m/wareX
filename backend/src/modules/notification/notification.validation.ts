import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

export const createNotificationSchema = z.object({
  recipientId: objectId.refine((v) => v.length === 24, 'Invalid recipient ID'),
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be at most 200 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be at most 2000 characters'),
  type: z.enum(
    [
      'Order Created',
      'Order Cancelled',
      'Order Fulfilled',
      'Pick List Assigned',
      'Pick List Started',
      'Pick List Completed',
      'Pick List Cancelled',
      'Device Reserved',
      'Device Moved',
      'Inventory Updated',
      'System',
    ],
    { required_error: 'Type is required', invalid_type_error: 'Invalid notification type' },
  ),
  priority: z
    .enum(['Low', 'Medium', 'High', 'Critical'], {
      required_error: 'Priority is required',
      invalid_type_error: 'Invalid priority',
    })
    .default('Medium'),
  relatedModule: z
    .string()
    .max(50)
    .optional(),
  relatedResourceId: z
    .string()
    .max(100)
    .optional(),
});

export const notificationIdParamSchema = z.object({
  id: objectId.refine((v) => v.length === 24, 'Invalid notification ID'),
});

export const notificationQuerySchema = z.object({
  isRead: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  type: z
    .enum([
      'Order Created',
      'Order Cancelled',
      'Order Fulfilled',
      'Pick List Assigned',
      'Pick List Started',
      'Pick List Completed',
      'Pick List Cancelled',
      'Device Reserved',
      'Device Moved',
      'Inventory Updated',
      'System',
    ])
    .optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().positive().optional()),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().positive().max(100).optional()),
  sortBy: z
    .string()
    .optional()
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
});
