import { Request, Response, NextFunction } from 'express';
import * as styleService from '../services/tattooStyle.service';
import { createStyleSchema, updateStyleSchema } from '../validators/tattooStyle.validator';
import { AppError } from '../utils/AppError';

export const getAllStyles = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.json(await styleService.getAllStyles());
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to fetch styles', 500));
    }
};

export const createStyle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = createStyleSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        res.status(201).json(await styleService.createStyle(parsed.data));
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to create style', 409));
    }
};

export const updateStyle = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updateStyleSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        res.json(await styleService.updateStyle(req.params.id, parsed.data));
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Style not found', 404));
    }
};

export const deleteStyle = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        await styleService.deleteStyle(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Style not found', 404));
    }
};
