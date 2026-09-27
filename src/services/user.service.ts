import { AppError } from '../common/app-error.js';
import type { UserRepository } from '../repositories/user.repository.js';
import type { ImageRepository } from '../repositories/image.repository.js';
import type { StorageService } from './storage.service.js';
import type { Pagination, ProfileInput } from '../types/dto.js';

export class UserService {
  constructor(private readonly users: UserRepository, private readonly images: ImageRepository, private readonly storage: StorageService) {}
  async profile(id: number) {
    const user = await this.users.findById(id);
    if (!user) throw new AppError(404, 'Không tìm thấy người dùng', 'USER_NOT_FOUND');
    return user;
  }
  async update(id: number, input: ProfileInput, file?: Express.Multer.File) {
    if (Object.keys(input).length === 0 && !file) throw new AppError(400, 'Chưa có thông tin cần cập nhật', 'EMPTY_UPDATE');
    if (file && input.anh_dai_dien !== undefined) throw new AppError(400, 'Chọn file avatar hoặc URL, không gửi cả hai', 'AVATAR_CONFLICT');
    const before = await this.profile(id);
    const newAvatar = file ? await this.storage.store(file) : undefined;
    try {
      const user = await this.users.update(id, { ...input, ...(newAvatar ? { anh_dai_dien: newAvatar } : {}) });
      if (before.anh_dai_dien !== user.anh_dai_dien) await this.storage.remove(before.anh_dai_dien);
      return user;
    } catch (error) { if (newAvatar) await this.storage.remove(newAvatar); throw error; }
  }
  saved(id: number, paging: Pagination) { return this.images.savedImages(id, paging); }
  created(id: number, paging: Pagination) { return this.images.list(paging, { nguoi_dung_id: id }); }
}
