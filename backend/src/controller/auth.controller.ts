import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { registerSchema, loginSchema, googleAuthSchema } from '../validators/auth.validator';
import { AppError } from '../utils/AppError';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        const result = await authService.register(parsed.data.username, parsed.data.email, parsed.data.password);
        res.status(201).json(result);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Registration failed', 409));
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        const result = await authService.login(parsed.data.email, parsed.data.password);
        res.json(result);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Login failed', 401));
    }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        const result = await authService.googleLogin(parsed.data.idToken);
        res.json(result);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Google auth failed', 400));
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await authService.getMe(req.user!.userId);
        res.json(user);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'User not found', 404));
    }
};
