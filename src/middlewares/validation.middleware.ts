import type { Request } from 'express';
import { z } from 'zod';
import { AppError } from '../common/app-error.js';
import { idSchema, paginationSchema } from '../types/dto.js';

export function parseBody<T extends z.ZodType>(schema: T, req: Request): z.output<T> {
  return schema.parse(req.body as unknown);
}
export function imageId(req: Request): number { return idSchema.parse(req.params['id']); }
export function pagination(req: Request) { return paginationSchema.parse(req.query); }
export function currentUserId(req: Request): number {
  if (!req.auth) throw new AppError(401, 'Vui lòng đăng nhập', 'UNAUTHORIZED');
  return req.auth.userId;
}
