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
    JWT_SECRET: zod_1.z.string().min(1, 'JWT secret is required'),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
});
const parsed = environmentSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.environment = parsed.data;
//# sourceMappingURL=environment.js.map