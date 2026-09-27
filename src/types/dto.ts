import { z } from 'zod';

const email = z.string().trim().email().max(255).transform((s) => s.toLowerCase());
const password = z.string().min(8).max(72).refine((s) => Buffer.byteLength(s, 'utf8') <= 72, 'Mật khẩu tối đa 72 bytes');
const name = z.string().trim().min(1).max(255);
const age = z.number().int().min(0).max(150);
const multipartAge = z.preprocess((value: unknown) => typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value, age);
const avatarUrl = z.string().max(255).url().refine((s) => /^https?:\/\//.test(s), 'Avatar URL phải dùng HTTP/HTTPS');

export const registerSchema = z.object({ email, mat_khau: password, ho_ten: name, tuoi: age.optional() }).strict();
export const loginSchema = z.object({ email, mat_khau: z.string().min(1).max(72) }).strict();
export const profileSchema = z.object({
  ho_ten: name.optional(), tuoi: multipartAge.nullable().optional(), anh_dai_dien: avatarUrl.nullable().optional(),
}).strict();
export const uploadSchema = z.object({ ten_hinh: name, mo_ta: z.string().trim().max(5000).optional() }).strict();
export const commentSchema = z.object({ noi_dung: z.string().trim().min(1).max(5000) }).strict();
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();
export const searchSchema = paginationSchema.extend({ name: name });
export const idSchema = z.coerce.number().int().positive().max(2147483647);
export const emptySchema = z.object({}).strict();
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type UploadInput = z.infer<typeof uploadSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
