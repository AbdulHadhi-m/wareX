"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickListQuerySchema = exports.workerIdParamSchema = exports.pickListIdParamSchema = exports.assignPickListSchema = exports.createPickListSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');
exports.createPickListSchema = zod_1.z.object({
    workerId: objectId.optional(),
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
exports.assignPickListSchema = zod_1.z.object({
    workerId: objectId.refine((v) => v.length === 24, 'Invalid worker ID'),
});
exports.pickListIdParamSchema = zod_1.z.object({
    id: objectId.refine((v) => v.length === 24, 'Invalid pick list ID'),
});
exports.workerIdParamSchema = zod_1.z.object({
    workerId: objectId.refine((v) => v.length === 24, 'Invalid worker ID'),
});
exports.pickListQuerySchema = zod_1.z.object({
    status: zod_1.z
        .enum(['Draft', 'Assigned', 'In Progress', 'Completed', 'Cancelled'])
        .optional(),
    workerId: objectId.optional(),
    startDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/, 'Invalid start date format')
        .optional(),
    endDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/, 'Invalid end date format')
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
//# sourceMappingURL=pickList.validation.js.map