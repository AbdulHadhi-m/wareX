import { z } from 'zod';

export const createDeviceSchema = z.object({
  binId: z.string().min(1, 'Bin is required'),
  deviceName: z
    .string()
    .min(1, 'Device name is required')
    .max(200, 'Device name must be at most 200 characters'),
  brand: z
    .string()
    .min(1, 'Brand is required')
    .max(100, 'Brand must be at most 100 characters'),
  model: z
    .string()
    .min(1, 'Model is required')
    .max(100, 'Model must be at most 100 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be at most 100 characters'),
  sku: z
    .string()
    .max(100, 'SKU must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  serialNumber: z
    .string()
    .min(1, 'Serial number is required')
    .max(100, 'Serial number must be at most 100 characters'),
  imei: z
    .string()
    .regex(/^\d{15}$/, 'IMEI must be exactly 15 digits')
    .optional()
    .or(z.literal('')),
  status: z.enum(
    ['Available', 'Reserved', 'Picked', 'Shipped', 'Damaged', 'Returned'],
    { required_error: 'Status is required' },
  ),
  condition: z.enum(['New', 'Good', 'Fair', 'Damaged'], {
    required_error: 'Condition is required',
  }),
  purchaseDate: z.string().optional().or(z.literal('')),
  warrantyExpiry: z.string().optional().or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
});

export const updateDeviceSchema = z.object({
  binId: z.string().min(1, 'Bin is required').optional(),
  deviceName: z
    .string()
    .min(1, 'Device name is required')
    .max(200, 'Device name must be at most 200 characters')
    .optional(),
  brand: z
    .string()
    .min(1, 'Brand is required')
    .max(100, 'Brand must be at most 100 characters')
    .optional(),
  model: z
    .string()
    .min(1, 'Model is required')
    .max(100, 'Model must be at most 100 characters')
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must be at most 100 characters')
    .optional(),
  sku: z
    .string()
    .max(100, 'SKU must be at most 100 characters')
    .optional()
    .or(z.literal('')),
  serialNumber: z
    .string()
    .min(1, 'Serial number is required')
    .max(100, 'Serial number must be at most 100 characters')
    .optional(),
  imei: z
    .string()
    .regex(/^\d{15}$/, 'IMEI must be exactly 15 digits')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['Available', 'Reserved', 'Picked', 'Shipped', 'Damaged', 'Returned'])
    .optional(),
  condition: z
    .enum(['New', 'Good', 'Fair', 'Damaged'])
    .optional(),
  purchaseDate: z.string().optional().or(z.literal('')),
  warrantyExpiry: z.string().optional().or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be at most 2000 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateDeviceFormData = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceFormData = z.infer<typeof updateDeviceSchema>;
