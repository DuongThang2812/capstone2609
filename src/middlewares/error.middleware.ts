import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';
import { Prisma } from '../generated/prisma/client.js';
import { AppError } from '../common/app-error.js';

export const notFound: RequestHandler = (_req, _res, next) => next(new AppError(404, 'API không tồn tại', 'NOT_FOUND'));

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Lỗi máy chủ';
  let code = 'INTERNAL_ERROR';
  let details: unknown;
  if (error instanceof AppError) {
    ({ statusCode, message, code } = error);
  } else if (error instanceof ZodError) {
    statusCode = 400; message = 'Dữ liệu không hợp lệ'; code = 'VALIDATION_ERROR';
    details = error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }));
  } else if (error instanceof multer.MulterError) {
    statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = error.code === 'LIMIT_FILE_SIZE' ? 'Ảnh vượt quá dung lượng cho phép' : 'Dữ liệu upload không hợp lệ';
    code = error.code;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') { statusCode = 409; message = 'Dữ liệu đã tồn tại'; code = 'CONFLICT'; }
    if (error.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; code = 'NOT_FOUND'; }
    if (error.code === 'P2003') { statusCode = 409; message = 'Dữ liệu liên quan không còn tồn tại'; code = 'RELATION_CONFLICT'; }
  } else if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400; message = 'JSON không hợp lệ'; code = 'INVALID_JSON';
  } else if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.too.large') {
    statusCode = 413; message = 'Request quá lớn'; code = 'PAYLOAD_TOO_LARGE';
  }
  if (statusCode === 500) console.error('[API] Unhandled error:', error instanceof Error ? error.name : 'UnknownError');
  res.status(statusCode).json({ statusCode, message, data: null, error: { code, ...(details ? { details } : {}) } });
};
