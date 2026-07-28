"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aisleIdParamSchema = exports.binIdSchema = exports.updateBinSchema = exports.createBinSchema = void 0;
const zod_1 = require("zod");
exports.createBinSchema = zod_1.z.object({
    aisleId: zod_1.z
        .string({ required_error: 'Aisle ID is required' })
        .regex(/^[a-f\d]{24}$/i, 'Invalid aisle ID'),
    name: zod_1.z
        .string({ required_error: 'Bin name is required' })
        .min(1, 'Bin name cannot be empty')
        .max(200, 'Bin name must be at most 200 characters'),
    code: zod_1.z
        .string({ required_error: 'Bin code is required' })
        .min(1, 'Bin code cannot be empty')
        .max(50, 'Bin code must be at most 50 characters'),
    description: zod_1.z
        .string()
        .max(1000, 'Description must be at most 1000 characters')
        .optional(),
    capacity: zod_1.z
        .number({ required_error: 'Capacity is required' })
        .int('Capacity must be a positive integer')
        .positive('Capacity must be greater than zero'),
    status: zod_1.z.enum(['Available', 'Full', 'Blocked', 'Inactive'], {
        required_error: 'Status is required',
        invalid_type_error: 'Status must be one of: Available, Full, Blocked, Inactive',
    }),
});
exports.updateBinSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Bin name cannot be empty')
        .max(200, 'Bin name must be at most 200 characters')
        .optional(),
    code: zod_1.z
        .string()
        .min(1, 'Bin code cannot be empty')
        .max(50, 'Bin code must be at most 50 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(1000, 'Description must be at most 1000 characters')
        .optional(),
    capacity: zod_1.z
        .number()
        .int('Capacity must be a positive integer')
        .positive('Capacity must be greater than zero')
        .optional(),
    status: zod_1.z
        .enum(['Available', 'Full', 'Blocked', 'Inactive'], {
        invalid_type_error: 'Status must be one of: Available, Full, Blocked, Inactive',
    })
        .optional(),
});
exports.binIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid bin ID'),
});
exports.aisleIdParamSchema = zod_1.z.object({
    aisleId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid aisle ID'),
});
//# sourceMappingURL=bin.validation.js.map