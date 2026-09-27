import type { RequestHandler } from 'express';
import { AppError } from '../common/app-error.js';
import type { TokenService } from '../services/token.service.js';
import type { UserRepository } from '../repositories/user.repository.js';

export function verifyToken(tokens: TokenService, users: UserRepository): RequestHandler {
  return async (req, _res, next) => {
    const match = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization ?? '');
    if (!match?.[1]) throw new AppError(401, 'Cần Bearer token trong Authorization', 'UNAUTHORIZED');
    const userId = tokens.verify(match[1]);
    if (!await users.findById(userId)) throw new AppError(401, 'Tài khoản không tồn tại', 'UNAUTHORIZED');
    req.auth = { userId };
    next();
  };
}
