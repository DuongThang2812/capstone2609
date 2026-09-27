import multer from 'multer';
import { AppError } from '../common/app-error.js';

export function createUpload(maxBytes: number) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 1, fields: 4, fieldSize: 16384, parts: 6 },
    fileFilter: (_req, file, cb) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
        cb(new AppError(415, 'Chỉ hỗ trợ ảnh JPEG, PNG, WebP', 'UNSUPPORTED_IMAGE'));
      } else cb(null, true);
    },
  });
}
