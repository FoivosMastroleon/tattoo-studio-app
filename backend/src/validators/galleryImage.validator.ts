import { z } from 'zod';

export const createGalleryImageSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    imageUrl: z.string().url('Invalid image URL'),
    description: z.string().max(500).optional(),
    style: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid style ID').optional(),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
