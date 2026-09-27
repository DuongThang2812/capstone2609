import type { PrismaClient, Prisma } from '../generated/prisma/client.js';
import type { ProfileInput } from '../types/dto.js';

export const publicUserSelect = {
  nguoi_dung_id: true, email: true, ho_ten: true, tuoi: true, anh_dai_dien: true,
} satisfies Prisma.UserSelect;

export class UserRepository {
  constructor(private readonly db: PrismaClient) {}
  findCredentials(email: string) { return this.db.user.findUnique({ where: { email } }); }
  findById(id: number) { return this.db.user.findUnique({ where: { nguoi_dung_id: id }, select: publicUserSelect }); }
  create(data: Prisma.UserCreateInput) { return this.db.user.create({ data, select: publicUserSelect }); }
  update(id: number, data: ProfileInput) {
    return this.db.user.update({ where: { nguoi_dung_id: id }, data, select: publicUserSelect });
  }
}
