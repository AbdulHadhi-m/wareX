"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogQuerySchema = void 0;
const zod_1 = require("zod");
exports.auditLogQuerySchema = zod_1.z.object({
    userId: zod_1.z
        .string()
        .regex(/^[a-f\d]{24}$/i, 'Invalid user ID')
        .optional(),
    module: zod_1.z
        .string()
        .max(50)
        .optional(),
    action: zod_1.z
        .string()
        .max(50)
        .optional(),
    resourceType: zod_1.z
        .string()
        .max(50)
        .optional(),
    startDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/, 'Invalid start date format')
        .optional(),
    endDate: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/, 'Invalid end date format')
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
    sortBy: zod_1.z
        .string()
        .optional()
        .default('createdAt'),
    sortOrder: zod_1.z
        .enum(['asc', 'desc'])
        .optional()
        .default('desc'),
});
//# sourceMappingURL=auditLog.validation.js.map