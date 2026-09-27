import type { Response } from 'express';

export function success<T>(res: Response, data: T, message = 'Thành công', statusCode = 200): void {
  res.status(statusCode).json({ statusCode, message, data, error: null });
}
