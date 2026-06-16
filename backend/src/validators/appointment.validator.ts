import { z } from 'zod';

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID format');

export const createAppointmentSchema = z.object({
    tattooStyle: objectId,
    appointmentDate: z.coerce.date({ error: 'Appointment date is required' }).refine(date => date > new Date(), {
        message: 'Appointment date must be in the future',
    }),
    timeSlot: z.string({ error: 'Time slot is required' }).regex(/^\d{2}:\d{2}$/, 'Time slot must be in HH:MM format'),
    clientNotes: z.string().max(500).optional(),
    referenceImageUrl: z.string().url('Invalid URL').optional(),
});

export const updateAppointmentSchema = z.object({
    artist: objectId.optional(),
    tattooStyle: objectId.optional(),
    appointmentDate: z.coerce.date().refine(date => date > new Date(), {
        message: 'Appointment date must be in the future',
    }).optional(),
    timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Time slot must be in HH:MM format').optional(),
    artistNotes: z.string().max(500).optional(),
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type AppointmentStatus = z.infer<typeof updateAppointmentSchema>['status'];
