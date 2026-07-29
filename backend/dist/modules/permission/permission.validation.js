"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePermissionSchema = exports.createPermissionSchema = void 0;
const zod_1 = require("zod");
exports.createPermissionSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters'),
    code: zod_1.z
        .string({ required_error: 'Code is required' })
        .min(1, 'Code is required')
        .max(100, 'Code must be at most 100 characters')
        .regex(/^[a-z]+\.[a-z-]+$/, 'Code must be in format "module.action" (e.g., warehouse.create)'),
    module: zod_1.z
        .string({ required_error: 'Module is required' })
        .min(1, 'Module is required')
        .max(50, 'Module must be at most 50 characters'),
    description: zod_1.z
        .string()
        .max(500, 'Description must be at most 500 characters')
        .optional()
        .default(''),
});
exports.updatePermissionSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(500, 'Description must be at most 500 characters')
        .optional(),
});
//# sourceMappingURL=permission.validation.js.map