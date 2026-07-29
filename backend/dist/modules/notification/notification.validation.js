"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationQuerySchema = exports.notificationIdParamSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');
exports.createNotificationSchema = zod_1.z.object({
    recipientId: objectId.refine((v) => v.length === 24, 'Invalid recipient ID'),
    title: zod_1.z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title cannot be empty')
        .max(200, 'Title must be at most 200 characters'),
    message: zod_1.z
        .string({ required_error: 'Message is required' })
        .min(1, 'Message cannot be empty')
        .max(2000, 'Message must be at most 2000 characters'),
    type: zod_1.z.enum([
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
    ], { required_error: 'Type is required', invalid_type_error: 'Invalid notification type' }),
    priority: zod_1.z
        .enum(['Low', 'Medium', 'High', 'Critical'], {
        required_error: 'Priority is required',
        invalid_type_error: 'Invalid priority',
    })
        .default('Medium'),
    relatedModule: zod_1.z
        .string()
        .max(50)
        .optional(),
    relatedResourceId: zod_1.z
        .string()
        .max(100)
        .optional(),
});
exports.notificationIdParamSchema = zod_1.z.object({
    id: objectId.refine((v) => v.length === 24, 'Invalid notification ID'),
});
exports.notificationQuerySchema = zod_1.z.object({
    isRead: zod_1.z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
    type: zod_1.z
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
    page: zod_1.z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : undefined))
        .pipe(zod_1.z.number().int().positive().optional()),
    limit: zod_1.z
        .string()
        .optional()
        .transform((v) => (v ? parseInt(v, 10) : undefined))
        .pipe(zod_1.z.number().int().positive().max(100).optional()),
    sortBy: zod_1.z
        .string()
        .optional()
        .default('createdAt'),
    sortOrder: zod_1.z
        .enum(['asc', 'desc'])
        .optional()
        .default('desc'),
});
//# sourceMappingURL=notification.validation.js.map