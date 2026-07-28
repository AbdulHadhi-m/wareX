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
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const environment = parsed.data;
