import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import type { AuthController } from '../controllers/auth.controller.js';

export function authRoutes(controller: AuthController) {
  const router = Router();
  router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { statusCode: 429, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau', data: null, error: { code: 'RATE_LIMITED' } } }));
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  return router;
}
