import { z } from 'zod';

export const createAppointmentSchema = z.object({
  tattooStyle: z.string().min(1, 'Please select a style'),
  appointmentDate: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Please select a time slot').regex(/^\d{2}:\d{2}$/, { message: 'Time must be in HH:MM format' }),
  phone: z.string().min(1, 'Phone number is required').regex(/^\+?[\d\s\-()\d]{7,15}$/, 'Invalid phone number'),
  clientNotes: z.string().max(500).optional(),
  referenceImageUrl: z.string().min(1, 'Reference image URL is required').regex(/^https?:\/\/.+\..+/, { message: 'Please enter a valid URL (https://...)' }),
});

export type CreateAppointmentFields = z.infer<typeof createAppointmentSchema>;

