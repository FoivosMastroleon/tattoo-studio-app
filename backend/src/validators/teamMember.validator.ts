import { z } from 'zod';

export const createTeamMemberSchema = z.object({
    name: z.string({ error: 'Name is required' }).min(1, 'Name is required').max(80),
    role: z.string({ error: 'Role is required' }).min(1, 'Role is required').max(80),
    imageUrl: z.string().url('Invalid image URL').optional(),
    position: z.string().max(20).optional(),
    order: z.number().optional(),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
