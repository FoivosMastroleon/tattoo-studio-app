import { z } from 'zod';

export const updateUserSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters').optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;