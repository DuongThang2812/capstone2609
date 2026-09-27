import type { PrismaClient, Prisma } from '../generated/prisma/client.js';
import type { Pagination } from '../types/dto.js';
import { publicUserSelect } from './user.repository.js';

export class ImageRepository {
  constructor(private readonly db: PrismaClient) {}
  findById(hinh_id: number) {
    return this.db.image.findUnique({ where: { hinh_id }, include: { nguoi_tao: { select: publicUserSelect } } });
  }
  async list(paging: Pagination, where: Prisma.ImageWhereInput = {}) {
    const [items, total] = await this.db.$transaction([
      this.db.image.findMany({ where, skip: (paging.page - 1) * paging.limit, take: paging.limit,
        orderBy: { hinh_id: 'desc' }, include: { nguoi_tao: { select: publicUserSelect } } }),
      this.db.image.count({ where }),
    ]);
    return { items, pagination: { ...paging, total, totalPages: Math.ceil(total / paging.limit) } };
  }
  create(data: Prisma.ImageUncheckedCreateInput) { return this.db.image.create({ data }); }
  deleteOwned(hinh_id: number, nguoi_dung_id: number) {
    return this.db.image.deleteMany({ where: { hinh_id, nguoi_dung_id } });
  }
  isSaved(nguoi_dung_id: number, hinh_id: number) {
    return this.db.savedImage.findUnique({ where: { nguoi_dung_id_hinh_id: { nguoi_dung_id, hinh_id } } });
  }
  async savedImages(nguoi_dung_id: number, paging: Pagination) {
    const where = { nguoi_dung_id };
    const [items, total] = await this.db.$transaction([
      this.db.savedImage.findMany({ where, skip: (paging.page - 1) * paging.limit, take: paging.limit,
        orderBy: [{ ngay_luu: 'desc' }, { hinh_id: 'desc' }],
        include: { hinh_anh: { include: { nguoi_tao: { select: publicUserSelect } } } } }),
      this.db.savedImage.count({ where }),
    ]);
    return { items, pagination: { ...paging, total, totalPages: Math.ceil(total / paging.limit) } };
  }
}
