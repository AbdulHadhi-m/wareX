import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

export const moveDeviceSchema = z.object({
  deviceId: objectId.refine((v) => v.length === 24, 'Invalid device ID'),
  toBinId: objectId.refine((v) => v.length === 24, 'Invalid bin ID'),
  movementType: z.enum(
    ['Initial Placement', 'Transfer', 'Return', 'Adjustment'],
    { required_error: 'Movement type is required', invalid_type_error: 'Invalid movement type' },
  ),
  reason: z
    .string()
    .max(500, 'Reason must be at most 500 characters')
    .optional(),
});

export const deviceIdParamSchema = z.object({
  deviceId: objectId.refine((v) => v.length === 24, 'Invalid device ID'),
});

export const binIdParamSchema = z.object({
  binId: objectId.refine((v) => v.length === 24, 'Invalid bin ID'),
});

export const warehouseIdParamSchema = z.object({
  warehouseId: objectId.refine((v) => v.length === 24, 'Invalid warehouse ID'),
});

export const zoneIdParamSchema = z.object({
  zoneId: objectId.refine((v) => v.length === 24, 'Invalid zone ID'),
});

export const aisleIdParamSchema = z.object({
  aisleId: objectId.refine((v) => v.length === 24, 'Invalid aisle ID'),
});

export const inventoryQuerySchema = z.object({
  status: z
    .enum(['Available', 'Reserved', 'Picked', 'Shipped', 'Damaged', 'Returned'])
    .optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().positive().optional()),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().positive().max(100).optional()),
});
