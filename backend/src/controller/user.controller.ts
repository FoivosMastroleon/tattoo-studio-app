import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { updateUserSchema } from '../validators/user.validator';

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err: unknown) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

export const getUserById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'User not found' });
    }
};

export const updateUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues[0].message });
        return;
    }
    try {
        const user = await userService.updateUser(req.params.id, parsed.data);
        res.json(user);
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'Update failed' });
    }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'User not found' });
    }
};
