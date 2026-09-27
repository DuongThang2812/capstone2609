import 'dotenv/config';
import path from 'node:path';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3071),
  DATABASE_URL: z.string().url().refine((s) => s.startsWith('mysql://'), 'Expected mysql:// URL'),
  JWT_SECRET: z.string().min(32).refine((s) => !s.startsWith('replace-with-'), 'Generate a real JWT secret'),
  JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().min(60).max(86400).default(3600),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_UPLOAD_BYTES: z.coerce.number().int().positive().max(10485760).default(5242880),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
}
export const env = { ...parsed.data, UPLOAD_DIR: path.resolve(parsed.data.UPLOAD_DIR) };
