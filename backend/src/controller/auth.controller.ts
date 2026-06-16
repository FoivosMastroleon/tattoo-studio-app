import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { registerSchema, loginSchema, googleAuthSchema } from '../validators/auth.validator';

export const register = async (req: Request, res: Response): Promise<void> => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues[0].message });
        return;
    }
    try {
        const result = await authService.register(parsed.data.username, parsed.data.email, parsed.data.password);
        res.status(201).json(result);
    } catch (err: unknown) {
        res.status(409).json({ message: err instanceof Error ? err.message : 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues[0].message });
        return;
    }
    try {
        const result = await authService.login(parsed.data.email, parsed.data.password);
        res.json(result);
    } catch (err: unknown) {
        res.status(401).json({ message: err instanceof Error ? err.message : 'Login failed' });
    }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues[0].message });
        return;
    }
    try {
        const result = await authService.googleLogin(parsed.data.idToken);
        res.json(result);
    } catch (err: unknown) {
        res.status(400).json({ message: err instanceof Error ? err.message : 'Google auth failed' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await authService.getMe(req.user!.userId);
        res.json(user);
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'User not found' });
    }
};
