"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleSchema = exports.createRoleSchema = void 0;
const zod_1 = require("zod");
exports.createRoleSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters'),
    description: zod_1.z
        .string()
        .max(500, 'Description must be at most 500 characters')
        .optional()
        .default(''),
    permissionIds: zod_1.z
        .array(zod_1.z.string({ required_error: 'Permission ID is required' }))
        .min(1, 'At least one permission is required'),
});
exports.updateRoleSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(500, 'Description must be at most 500 characters')
        .optional(),
    permissionIds: zod_1.z
        .array(zod_1.z.string({ required_error: 'Permission ID is required' }))
        .optional(),
});
//# sourceMappingURL=role.validation.js.map