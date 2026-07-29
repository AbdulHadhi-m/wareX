"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const environmentSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().positive().default(3000),
    HOST: zod_1.z.string().default('localhost'),
    MONGODB_URI: zod_1.z.string().url(),
    LOG_LEVEL: zod_1.z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    LOG_FILE_PATH: zod_1.z.string().default('logs'),
    JWT_SECRET: zod_1.z.string().min(32, 'JWT secret must be at least 32 characters in production').default('dev-secret-key-min-32-chars-long!!'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    CORS_ORIGIN: zod_1.z.string().default('*'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().positive().default(900000),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().positive().default(100),
    RATE_LIMIT_AUTH_MAX: zod_1.z.coerce.number().positive().default(10),
    BODY_LIMIT: zod_1.z.string().default('1mb'),
    SUPER_ADMIN_EMAIL: zod_1.z.string().email().default('superadmin@warex.com'),
    SUPER_ADMIN_PASSWORD: zod_1.z.string().min(8).default('superadmin123'),
    SUPER_ADMIN_NAME: zod_1.z.string().min(1).default('Super Admin'),
});
const parsed = environmentSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
if (parsed.data.NODE_ENV === 'production' && parsed.data.JWT_SECRET === 'dev-secret-key-min-32-chars-long!!') {
    console.error('JWT_SECRET must be configured in production');
    process.exit(1);
}
exports.environment = parsed.data;
//# sourceMappingURL=environment.js.map