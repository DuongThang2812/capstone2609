import type { Request, Response } from 'express';
import type { AuthService } from '../services/auth.service.js';
import { success } from '../common/response.js';
import { parseBody } from '../middlewares/validation.middleware.js';
import { registerSchema, loginSchema } from '../types/dto.js';

export class AuthController {
  constructor(private readonly service: AuthService) {}
  register = async (req: Request, res: Response) => success(res, await this.service.register(parseBody(registerSchema, req)), 'Đăng ký thành công', 201);
  login = async (req: Request, res: Response) => success(res, await this.service.login(parseBody(loginSchema, req)), 'Đăng nhập thành công');
}
