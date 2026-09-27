import type { PrismaClient } from '../generated/prisma/client.js';
import type { Pagination } from '../types/dto.js';
import { publicUserSelect } from './user.repository.js';

export class CommentRepository {
  constructor(private readonly db: PrismaClient) {}
  async list(hinh_id: number, paging: Pagination) {
    const [items, total] = await this.db.$transaction([
      this.db.comment.findMany({ where: { hinh_id }, skip: (paging.page - 1) * paging.limit, take: paging.limit,
        orderBy: [{ ngay_binh_luan: 'desc' }, { binh_luan_id: 'desc' }], include: { nguoi_dung: { select: publicUserSelect } } }),
      this.db.comment.count({ where: { hinh_id } }),
    ]);
    return { items, pagination: { ...paging, total, totalPages: Math.ceil(total / paging.limit) } };
  }
  create(nguoi_dung_id: number, hinh_id: number, noi_dung: string) {
    return this.db.comment.create({ data: { nguoi_dung_id, hinh_id, noi_dung }, include: { nguoi_dung: { select: publicUserSelect } } });
  }
}
