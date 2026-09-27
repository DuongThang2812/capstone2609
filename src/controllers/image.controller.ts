import type { Request, Response } from 'express';
import type { ImageService } from '../services/image.service.js';
import { success } from '../common/response.js';
import { currentUserId, imageId, pagination, parseBody } from '../middlewares/validation.middleware.js';
import { commentSchema, emptySchema, searchSchema, uploadSchema } from '../types/dto.js';

export class ImageController {
  constructor(private readonly service: ImageService) {}
  list = async (req: Request, res: Response) => success(res, await this.service.list(pagination(req)));
  search = async (req: Request, res: Response) => {
    const { name, ...paging } = searchSchema.parse(req.query);
    success(res, await this.service.list(paging, name));
  };
  detail = async (req: Request, res: Response) => success(res, await this.service.detail(imageId(req)));
  comments = async (req: Request, res: Response) => success(res, await this.service.listComments(imageId(req), pagination(req)));
  comment = async (req: Request, res: Response) => success(res, await this.service.comment(imageId(req), currentUserId(req), parseBody(commentSchema, req).noi_dung), 'Đã thêm bình luận', 201);
  isSaved = async (req: Request, res: Response) => {
    emptySchema.parse(req.query);
    success(res, await this.service.isSaved(imageId(req), currentUserId(req)));
  };
  upload = async (req: Request, res: Response) => success(res, await this.service.upload(currentUserId(req), parseBody(uploadSchema, req), req.file), 'Đăng ảnh thành công', 201);
  delete = async (req: Request, res: Response) => {
    emptySchema.parse(req.query); emptySchema.parse(req.body ?? {});
    success(res, await this.service.delete(imageId(req), currentUserId(req)), 'Đã xóa ảnh');
  };
}
