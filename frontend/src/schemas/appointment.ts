import { z } from 'zod';

export const createAppointmentSchema = z.object({
  tattooStyle: z.string().min(1, 'Please select a style'),
  appointmentDate: z.string().min(1, 'Date is required'),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  clientNotes: z.string().max(500).optional(),
  referenceImageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type CreateAppointmentFields = z.infer<typeof createAppointmentSchema>;

