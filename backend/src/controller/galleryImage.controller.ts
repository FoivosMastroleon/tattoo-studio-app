import { Request, Response } from 'express';
import * as galleryService from '../services/galleryImage.service';
import { createGalleryImageSchema } from '../validators/galleryImage.validator';

export const getAllImages = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.json(await galleryService.getAllImages());
    } catch {
        res.status(500).json({ message: 'Failed to fetch images' });
    }
};

export const createImage = async (req: Request, res: Response): Promise<void> => {
    const parsed = createGalleryImageSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: parsed.error.issues[0].message }); return; }
    try {
        res.status(201).json(await galleryService.createImage(req.user!.userId, parsed.data));
    } catch (err: unknown) {
        res.status(400).json({ message: err instanceof Error ? err.message : 'Failed to upload image' });
    }
};

export const deleteImage = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        await galleryService.deleteImage(req.params.id);
        res.status(204).send();
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'Image not found' });
    }
};
