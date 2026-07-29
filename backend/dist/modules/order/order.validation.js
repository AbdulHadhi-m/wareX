"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.orderIdParamSchema = exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');
exports.createOrderSchema = zod_1.z.object({
    customerName: zod_1.z
        .string({ required_error: 'Customer name is required' })
        .min(1, 'Customer name cannot be empty')
        .max(200, 'Customer name must be at most 200 characters'),
    customerReference: zod_1.z
        .string()
        .max(100, 'Customer reference must be at most 100 characters')
        .optional(),
    deviceIds: zod_1.z
        .array(objectId, { required_error: 'Device IDs are required' })
        .min(1, 'At least one device is required')
        .refine((ids) => new Set(ids).size === ids.length, {
        message: 'Duplicate device IDs are not allowed',
    }),
    priority: zod_1.z.enum(['Low', 'Medium', 'High', 'Urgent'], {
        required_error: 'Priority is required',
        invalid_type_error: 'Invalid priority',
    }),
    notes: zod_1.z
        .string()
        .max(1000, 'Notes must be at most 1000 characters')
        .optional(),
});
exports.updateOrderSchema = zod_1.z.object({
    customerName: zod_1.z
        .string()
        .min(1, 'Customer name cannot be empty')
        .max(200, 'Customer name must be at most 200 characters')
        .optional(),
    customerReference: zod_1.z
        .string()
        .max(100, 'Customer reference must be at most 100 characters')
        .optional(),
    deviceIds: zod_1.z
        .array(objectId)
        .min(1, 'At least one device is required')
        .refine((ids) => new Set(ids).size === ids.length, {
        message: 'Duplicate device IDs are not allowed',
    })
        .optional(),
    priority: zod_1.z
        .enum(['Low', 'Medium', 'High', 'Urgent'], {
        invalid_type_error: 'Invalid priority',
    })
        .optional(),
    notes: zod_1.z
        .string()
        .max(1000, 'Notes must be at most 1000 characters')
        .optional(),
});
exports.orderIdParamSchema = zod_1.z.object({
    id: objectId.refine((v) => v.length === 24, 'Invalid order ID'),
});
exports.orderQuerySchema = zod_1.z.object({
    status: zod_1.z
        .enum(['Draft', 'Pending', 'Picking', 'Ready', 'Fulfilled', 'Cancelled'])
        .optional(),
    customerName: zod_1.z
        .string()
        .max(200)
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
//# sourceMappingURL=order.validation.js.map