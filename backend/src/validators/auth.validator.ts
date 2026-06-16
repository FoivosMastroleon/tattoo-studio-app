import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string({ error: 'Username is required' }).min(2, 'Username must be at least 2 characters'),
    email: z.string({ error: 'Email is required' }).email('Invalid email'),
    password: z.string({ error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

export const googleAuthSchema = z.object({
    idToken: z.string().min(1, 'Google ID token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;


