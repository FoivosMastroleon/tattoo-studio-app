import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { updateUserSchema } from '../validators/user.validator';
import { AppError } from '../utils/AppError';

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to fetch users', 500));
    }
};

export const getUserById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'User not found', 404));
    }
};

export const updateUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        const user = await userService.updateUser(req.params.id, parsed.data);
        res.json(user);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Update failed', 404));
    }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'User not found', 404));
    }
};
