import { z } from 'zod';

export const createPickListSchema = z.object({
  workerId: z.string().optional().or(z.literal('')),
  deviceIds: z
    .array(z.string().min(1, 'Device ID is required'))
    .min(1, 'At least one device is required')
    .refine((ids) => new Set(ids).size === ids.length, {
      message: 'Duplicate devices are not allowed',
    }),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent'], {
    required_error: 'Priority is required',
  }),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
});

export const assignWorkerSchema = z.object({
  workerId: z.string().min(1, 'Worker ID is required'),
});

export type CreatePickListFormData = z.infer<typeof createPickListSchema>;
export type AssignWorkerFormData = z.infer<typeof assignWorkerSchema>;
