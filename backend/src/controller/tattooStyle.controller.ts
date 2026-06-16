import { Request, Response } from 'express';
import * as styleService from '../services/tattooStyle.service';
import { createStyleSchema, updateStyleSchema } from '../validators/tattooStyle.validator';

export const getAllStyles = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.json(await styleService.getAllStyles());
    } catch {
        res.status(500).json({ message: 'Failed to fetch styles' });
    }
};

export const createStyle = async (req: Request, res: Response): Promise<void> => {
    const parsed = createStyleSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: parsed.error.issues[0].message }); return; }
    try {
        res.status(201).json(await styleService.createStyle(parsed.data));
    } catch (err: unknown) {
        res.status(409).json({ message: err instanceof Error ? err.message : 'Failed to create style' });
    }
};

export const updateStyle = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const parsed = updateStyleSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: parsed.error.issues[0].message }); return; }
    try {
        res.json(await styleService.updateStyle(req.params.id, parsed.data));
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'Style not found' });
    }
};

export const deleteStyle = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        await styleService.deleteStyle(req.params.id);
        res.status(204).send();
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'Style not found' });
    }
};
