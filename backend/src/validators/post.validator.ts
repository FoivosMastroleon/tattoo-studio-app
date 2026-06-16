import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string({ error: 'Title is required' }).min(1, 'Title is required').max(200),
    content: z.string({ error: 'Content is required' }).min(10, 'Content must be at least 10 characters'),
    imageUrl: z.string().url('Invalid URL').optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;