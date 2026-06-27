import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/AppError';

export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('CLOUDINARY ENV:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***set***' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***set***' : 'MISSING',
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!req.file) {
    next(new AppError('No file provided', 400));
    return;
  }

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'tattoo-studio', resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'));
          resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    next(new AppError(err instanceof Error ? err.message : 'Upload failed', 500));
  }
};
