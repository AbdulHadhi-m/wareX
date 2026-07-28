"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoneIdParamSchema = exports.aisleIdSchema = exports.updateAisleSchema = exports.createAisleSchema = void 0;
const zod_1 = require("zod");
exports.createAisleSchema = zod_1.z.object({
    zoneId: zod_1.z
        .string({ required_error: 'Zone ID is required' })
        .regex(/^[a-f\d]{24}$/i, 'Invalid zone ID'),
    name: zod_1.z
        .string({ required_error: 'Aisle name is required' })
        .min(1, 'Aisle name cannot be empty')
        .max(200, 'Aisle name must be at most 200 characters'),
    code: zod_1.z
        .string({ required_error: 'Aisle code is required' })
        .min(1, 'Aisle code cannot be empty')
        .max(50, 'Aisle code must be at most 50 characters'),
    description: zod_1.z
        .string()
        .max(1000, 'Description must be at most 1000 characters')
        .optional(),
    status: zod_1.z.enum(['Active', 'Inactive'], {
        required_error: 'Status is required',
        invalid_type_error: 'Status must be either Active or Inactive',
    }),
});
exports.updateAisleSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Aisle name cannot be empty')
        .max(200, 'Aisle name must be at most 200 characters')
        .optional(),
    code: zod_1.z
        .string()
        .min(1, 'Aisle code cannot be empty')
        .max(50, 'Aisle code must be at most 50 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(1000, 'Description must be at most 1000 characters')
        .optional(),
    status: zod_1.z
        .enum(['Active', 'Inactive'], {
        invalid_type_error: 'Status must be either Active or Inactive',
    })
        .optional(),
});
exports.aisleIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid aisle ID'),
});
exports.zoneIdParamSchema = zod_1.z.object({
    zoneId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid zone ID'),
});
//# sourceMappingURL=aisle.validation.js.map