"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseIdSchema = exports.updateWarehouseSchema = exports.createWarehouseSchema = void 0;
const zod_1 = require("zod");
exports.createWarehouseSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Warehouse name is required' })
        .min(1, 'Warehouse name cannot be empty')
        .max(200, 'Warehouse name must be at most 200 characters'),
    code: zod_1.z
        .string({ required_error: 'Warehouse code is required' })
        .min(1, 'Warehouse code cannot be empty')
        .max(50, 'Warehouse code must be at most 50 characters'),
    description: zod_1.z
        .string()
        .max(1000, 'Description must be at most 1000 characters')
        .optional(),
    address: zod_1.z
        .string()
        .max(500, 'Address must be at most 500 characters')
        .optional(),
    city: zod_1.z
        .string()
        .max(100, 'City must be at most 100 characters')
        .optional(),
    state: zod_1.z
        .string()
        .max(100, 'State must be at most 100 characters')
        .optional(),
    country: zod_1.z
        .string()
        .max(100, 'Country must be at most 100 characters')
        .optional(),
    postalCode: zod_1.z
        .string()
        .max(20, 'Postal code must be at most 20 characters')
        .optional(),
    status: zod_1.z.enum(['Active', 'Inactive'], {
        required_error: 'Status is required',
        invalid_type_error: 'Status must be either Active or Inactive',
    }),
});
exports.updateWarehouseSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Warehouse name cannot be empty')
        .max(200, 'Warehouse name must be at most 200 characters')
        .optional(),
    code: zod_1.z
        .string()
        .min(1, 'Warehouse code cannot be empty')
        .max(50, 'Warehouse code must be at most 50 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(1000, 'Description must be at most 1000 characters')
        .optional(),
    address: zod_1.z
        .string()
        .max(500, 'Address must be at most 500 characters')
        .optional(),
    city: zod_1.z
        .string()
        .max(100, 'City must be at most 100 characters')
        .optional(),
    state: zod_1.z
        .string()
        .max(100, 'State must be at most 100 characters')
        .optional(),
    country: zod_1.z
        .string()
        .max(100, 'Country must be at most 100 characters')
        .optional(),
    postalCode: zod_1.z
        .string()
        .max(20, 'Postal code must be at most 20 characters')
        .optional(),
    status: zod_1.z
        .enum(['Active', 'Inactive'], {
        invalid_type_error: 'Status must be either Active or Inactive',
    })
        .optional(),
});
exports.warehouseIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid warehouse ID'),
});
//# sourceMappingURL=warehouse.validation.js.map