import multer from 'multer';
import { AppError } from '../utils/AppError';
import { Request } from 'express';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req: Request, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only JPEG, PNG, WEBP and GIF images are allowed', 400) as unknown as null, false);
    }
  },
});
