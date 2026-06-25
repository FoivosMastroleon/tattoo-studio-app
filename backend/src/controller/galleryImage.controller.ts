import { Request, Response, NextFunction } from 'express';
import * as galleryService from '../services/galleryImage.service';
import { createGalleryImageSchema } from '../validators/galleryImage.validator';
import { AppError } from '../utils/AppError';

export const getAllImages = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.json(await galleryService.getAllImages());
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to fetch images', 500));
    }
};

export const createImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = createGalleryImageSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        res.status(201).json(await galleryService.createImage(req.user!.userId, parsed.data));
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to upload image', 400));
    }
};

export const deleteImage = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        await galleryService.deleteImage(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Image not found', 404));
    }
};
