import { z } from 'zod';

export const moveDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device is required'),
  toBinId: z.string().min(1, 'Destination bin is required'),
  movementType: z.enum(
    ['Initial Placement', 'Transfer', 'Return', 'Adjustment'],
    { required_error: 'Movement type is required' },
  ),
  reason: z
    .string()
    .max(500, 'Reason must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

export type MoveDeviceFormData = z.infer<typeof moveDeviceSchema>;
