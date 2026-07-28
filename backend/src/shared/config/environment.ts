import { config } from 'dotenv';
import { z } from 'zod';

config();

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default('localhost'),
  MONGODB_URI: z.string().url(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_FILE_PATH: z.string().default('logs'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters in production').default('dev-secret-key-min-32-chars-long!!'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().positive().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().positive().default(10),
  BODY_LIMIT: z.string().default('1mb'),
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

export const environment = parsed.data;
