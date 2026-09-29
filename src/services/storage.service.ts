import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
import { AppError } from '../common/app-error.js';

export class StorageService {
  constructor(readonly directory: string) {}
  async store(file: Express.Multer.File): Promise<string> {
    let output: Buffer;
    try {
      const image = sharp(file.buffer, { limitInputPixels: 25000000, failOn: 'warning' });
      const metadata = await image.metadata();
      if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format) || (metadata.pages ?? 1) > 1) {
        throw new Error('Unsupported image content');
      }
      output = await image.rotate().resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    } catch {
      throw new AppError(415, 'File không phải ảnh JPEG/PNG/WebP hợp lệ hoặc ảnh quá lớn (25 MP)', 'INVALID_IMAGE');
    }
    await mkdir(this.directory, { recursive: true });
    const filename = `${randomUUID()}.webp`;
    await writeFile(path.join(this.directory, filename), output, { flag: 'wx' });
    return `/uploads/${filename}`;
  }
  async remove(url: string | null | undefined): Promise<void> {
    const match = /^\/uploads\/([0-9a-f-]{36}\.webp)$/.exec(url ?? '');
    if (!match?.[1]) return;
    try { await unlink(path.join(this.directory, match[1])); }
    catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) console.error('[STORAGE] Unable to clean up an image file');
    }
  }
}
