import { z } from 'zod';

export const updateUserSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters').optional(),
    phone: z.string().regex(/^\+?[\d\s\-()\d]{7,15}$/, 'Invalid phone number').optional(),
    avatar: z.string().url('Invalid URL').optional(),
    role: z.enum(['customer', 'artist', 'admin']).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;