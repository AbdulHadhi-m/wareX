"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseIdParamSchema = exports.zoneIdSchema = exports.updateZoneSchema = exports.createZoneSchema = void 0;
const zod_1 = require("zod");
exports.createZoneSchema = zod_1.z.object({
    warehouseId: zod_1.z
        .string({ required_error: 'Warehouse ID is required' })
        .regex(/^[a-f\d]{24}$/i, 'Invalid warehouse ID'),
    name: zod_1.z
        .string({ required_error: 'Zone name is required' })
        .min(1, 'Zone name cannot be empty')
        .max(200, 'Zone name must be at most 200 characters'),
    code: zod_1.z
        .string({ required_error: 'Zone code is required' })
        .min(1, 'Zone code cannot be empty')
        .max(50, 'Zone code must be at most 50 characters'),
    description: zod_1.z
        .string()
        .max(1000, 'Description must be at most 1000 characters')
        .optional(),
    status: zod_1.z.enum(['Active', 'Inactive'], {
        required_error: 'Status is required',
        invalid_type_error: 'Status must be either Active or Inactive',
    }),
});
exports.updateZoneSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Zone name cannot be empty')
        .max(200, 'Zone name must be at most 200 characters')
        .optional(),
    code: zod_1.z
        .string()
        .min(1, 'Zone code cannot be empty')
        .max(50, 'Zone code must be at most 50 characters')
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
exports.zoneIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid zone ID'),
});
exports.warehouseIdParamSchema = zod_1.z.object({
    warehouseId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid warehouse ID'),
});
//# sourceMappingURL=zone.validation.js.map