"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceIdSchema = exports.updateDeviceSchema = exports.createDeviceSchema = void 0;
const zod_1 = require("zod");
exports.createDeviceSchema = zod_1.z.object({
    deviceName: zod_1.z
        .string({ required_error: 'Device name is required' })
        .min(1, 'Device name cannot be empty')
        .max(200, 'Device name must be at most 200 characters'),
    brand: zod_1.z
        .string({ required_error: 'Brand is required' })
        .min(1, 'Brand cannot be empty')
        .max(100, 'Brand must be at most 100 characters'),
    model: zod_1.z
        .string({ required_error: 'Model is required' })
        .min(1, 'Model cannot be empty')
        .max(100, 'Model must be at most 100 characters'),
    category: zod_1.z
        .string({ required_error: 'Category is required' })
        .min(1, 'Category cannot be empty')
        .max(100, 'Category must be at most 100 characters'),
    imei: zod_1.z
        .string()
        .regex(/^\d{15}$/, 'IMEI must be exactly 15 digits')
        .optional(),
    serialNumber: zod_1.z
        .string({ required_error: 'Serial number is required' })
        .min(1, 'Serial number cannot be empty')
        .max(100, 'Serial number must be at most 100 characters'),
    sku: zod_1.z
        .string({ required_error: 'SKU is required' })
        .min(1, 'SKU cannot be empty')
        .max(100, 'SKU must be at most 100 characters'),
    binId: zod_1.z
        .string({ required_error: 'Bin ID is required' })
        .regex(/^[a-f\d]{24}$/i, 'Invalid bin ID'),
    status: zod_1.z.enum(['Available', 'Reserved', 'Picked', 'Shipped', 'Damaged', 'Returned'], { required_error: 'Status is required', invalid_type_error: 'Invalid device status' }),
    condition: zod_1.z.enum(['New', 'Good', 'Fair', 'Damaged'], { required_error: 'Condition is required', invalid_type_error: 'Invalid device condition' }),
    purchaseDate: zod_1.z.string().optional(),
    warrantyExpiry: zod_1.z.string().optional(),
    notes: zod_1.z
        .string()
        .max(2000, 'Notes must be at most 2000 characters')
        .optional(),
});
exports.updateDeviceSchema = zod_1.z.object({
    deviceName: zod_1.z
        .string()
        .min(1, 'Device name cannot be empty')
        .max(200, 'Device name must be at most 200 characters')
        .optional(),
    brand: zod_1.z
        .string()
        .min(1, 'Brand cannot be empty')
        .max(100, 'Brand must be at most 100 characters')
        .optional(),
    model: zod_1.z
        .string()
        .min(1, 'Model cannot be empty')
        .max(100, 'Model must be at most 100 characters')
        .optional(),
    category: zod_1.z
        .string()
        .min(1, 'Category cannot be empty')
        .max(100, 'Category must be at most 100 characters')
        .optional(),
    imei: zod_1.z
        .string()
        .regex(/^\d{15}$/, 'IMEI must be exactly 15 digits')
        .optional(),
    serialNumber: zod_1.z
        .string()
        .min(1, 'Serial number cannot be empty')
        .max(100, 'Serial number must be at most 100 characters')
        .optional(),
    sku: zod_1.z
        .string()
        .min(1, 'SKU cannot be empty')
        .max(100, 'SKU must be at most 100 characters')
        .optional(),
    binId: zod_1.z
        .string()
        .regex(/^[a-f\d]{24}$/i, 'Invalid bin ID')
        .optional(),
    status: zod_1.z
        .enum(['Available', 'Reserved', 'Picked', 'Shipped', 'Damaged', 'Returned'], {
        invalid_type_error: 'Invalid device status',
    })
        .optional(),
    condition: zod_1.z
        .enum(['New', 'Good', 'Fair', 'Damaged'], {
        invalid_type_error: 'Invalid device condition',
    })
        .optional(),
    purchaseDate: zod_1.z.string().optional(),
    warrantyExpiry: zod_1.z.string().optional(),
    notes: zod_1.z
        .string()
        .max(2000, 'Notes must be at most 2000 characters')
        .optional(),
});
exports.deviceIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid device ID'),
});
//# sourceMappingURL=device.validation.js.map