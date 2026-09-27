import { AppError } from '../common/app-error.js';
import type { ImageRepository } from '../repositories/image.repository.js';
import type { CommentRepository } from '../repositories/comment.repository.js';
import type { StorageService } from './storage.service.js';
import type { Pagination, UploadInput } from '../types/dto.js';

export class ImageService {
  constructor(private readonly images: ImageRepository, private readonly comments: CommentRepository, private readonly storage: StorageService) {}
  list(paging: Pagination, name?: string) {
    return this.images.list(paging, name === undefined ? {} : { ten_hinh: { contains: name } });
  }
  async detail(id: number) {
    const image = await this.images.findById(id);
    if (!image) throw new AppError(404, 'Không tìm thấy hình ảnh', 'IMAGE_NOT_FOUND');
    return image;
  }
  async listComments(id: number, paging: Pagination) { await this.detail(id); return this.comments.list(id, paging); }
  async comment(id: number, userId: number, content: string) { await this.detail(id); return this.comments.create(userId, id, content); }
  async isSaved(id: number, userId: number) { await this.detail(id); return { isSaved: !!await this.images.isSaved(userId, id) }; }
  async upload(userId: number, input: UploadInput, file?: Express.Multer.File) {
    if (!file) throw new AppError(400, 'Cần file ảnh ở trường image', 'IMAGE_REQUIRED');
    const duong_dan = await this.storage.store(file);
    try { return await this.images.create({ ...input, duong_dan, nguoi_dung_id: userId }); }
    catch (error) { await this.storage.remove(duong_dan); throw error; }
  }
  async delete(id: number, userId: number) {
    const image = await this.detail(id);
    if (image.nguoi_dung_id !== userId) throw new AppError(403, 'Bạn chỉ được xóa ảnh của mình', 'FORBIDDEN');
    const result = await this.images.deleteOwned(id, userId);
    if (result.count === 0) throw new AppError(404, 'Hình ảnh đã bị xóa', 'IMAGE_NOT_FOUND');
    await this.storage.remove(image.duong_dan);
    return { hinh_id: id };
  }
}
