import type { Request, Response } from 'express';
import type { UserService } from '../services/user.service.js';
import { success } from '../common/response.js';
import { currentUserId, pagination, parseBody } from '../middlewares/validation.middleware.js';
import { emptySchema, profileSchema } from '../types/dto.js';

export class UserController {
  constructor(private readonly service: UserService) {}
  profile = async (req: Request, res: Response) => { emptySchema.parse(req.query); success(res, await this.service.profile(currentUserId(req))); };
  update = async (req: Request, res: Response) => success(res, await this.service.update(currentUserId(req), parseBody(profileSchema, req), req.file), 'Đã cập nhật hồ sơ');
  saved = async (req: Request, res: Response) => success(res, await this.service.saved(currentUserId(req), pagination(req)));
  created = async (req: Request, res: Response) => success(res, await this.service.created(currentUserId(req), pagination(req)));
}
