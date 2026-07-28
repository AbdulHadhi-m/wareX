"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters'),
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters'),
    role: zod_1.z.enum(['Manager', 'Worker'], {
        required_error: 'Role is required',
        invalid_type_error: 'Role must be either Manager or Worker',
    }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(1, 'Password is required'),
});
//# sourceMappingURL=auth.validation.js.map