import { z } from 'zod';

export const createStyleSchema = z.object({
    name: z.string({ error: 'Name is required' }).min(1, 'Name is required').max(50),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url('Invalid URL').optional(),
});

export const updateStyleSchema = createStyleSchema.partial();

export type CreateStyleInput = z.infer<typeof createStyleSchema>;
export type UpdateStyleInput = z.infer<typeof updateStyleSchema>;
