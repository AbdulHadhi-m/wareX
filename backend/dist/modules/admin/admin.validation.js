"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userListQuerySchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    role: zod_1.z.enum(['SuperAdmin', 'Manager', 'Worker'], {
        required_error: 'Role is required',
    }),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters').optional(),
    role: zod_1.z.enum(['SuperAdmin', 'Manager', 'Worker']).optional(),
});
exports.userListQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().positive().optional(),
    limit: zod_1.z.coerce.number().positive().max(100).optional(),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    role: zod_1.z.enum(['SuperAdmin', 'Manager', 'Worker']).optional(),
});
//# sourceMappingURL=admin.validation.js.map