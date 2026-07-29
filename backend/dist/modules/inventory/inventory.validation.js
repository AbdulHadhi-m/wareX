"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryQuerySchema = exports.aisleIdParamSchema = exports.zoneIdParamSchema = exports.warehouseIdParamSchema = exports.binIdParamSchema = exports.deviceIdParamSchema = exports.moveDeviceSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');
exports.moveDeviceSchema = zod_1.z.object({
    deviceId: objectId.refine((v) => v.length === 24, 'Invalid device ID'),
    toBinId: objectId.refine((v) => v.length === 24, 'Invalid bin ID'),
    movementType: zod_1.z.enum(['Initial Placement', 'Transfer', 'Return', 'Adjustment'], { required_error: 'Movement type is required', invalid_type_error: 'Invalid movement type' }),
    reason: zod_1.z
        .string()
        .max(500, 'Reason must be at most 500 characters')
        .optional(),
});
exports.deviceIdParamSchema = zod_1.z.object({
    deviceId: objectId.refine((v) => v.length === 24, 'Invalid device ID'),
});
exports.binIdParamSchema = zod_1.z.object({
    binId: objectId.refine((v) => v.length === 24, 'Invalid bin ID'),
});
exports.warehouseIdParamSchema = zod_1.z.object({
    warehouseId: objectId.refine((v) => v.length === 24, 'Invalid warehouse ID'),
});
exports.zoneIdParamSchema = zod_1.z.object({
    zoneId: objectId.refine((v) => v.length === 24, 'Invalid zone ID'),
});
exports.aisleIdParamSchema = zod_1.z.object({
    aisleId: objectId.refine((v) => v.length === 24, 'Invalid aisle ID'),
});
exports.inventoryQuerySchema = zod_1.z.object({
    status: zod_1.z
        .enum(['Available', 'Reserved', 'Picked', 'Shipped', 'Damaged', 'Returned'])
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
});
//# sourceMappingURL=inventory.validation.js.map