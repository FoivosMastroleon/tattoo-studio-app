import axiosInstance from '@/lib/axiosInstance';
import type { Appointment } from '@/types';
import type { CreateAppointmentFields } from '@/schemas/appointment';

export const getAppointments = () =>
  axiosInstance.get<Appointment[]>('/appointments').then(r => r.data);

export const createAppointment = (data: CreateAppointmentFields) =>
  axiosInstance.post<Appointment>('/appointments', data).then(r => r.data);

type UpdateAppointmentData = {
  artist?: string;
  tattooStyle?: string;
  appointmentDate?: string;
  timeSlot?: string;
  artistNotes?: string;
};

export const updateAppointment = (id: string, data: UpdateAppointmentData) =>
  axiosInstance.patch<Appointment>(`/appointments/${id}`, data).then(r => r.data);

export const confirmAppointment = (id: string) =>
  axiosInstance.patch<Appointment>(`/appointments/${id}/confirm`).then(r => r.data);

export const cancelAppointment = (id: string) =>
  axiosInstance.patch<Appointment>(`/appointments/${id}/cancel`).then(r => r.data);

export const completeAppointment = (id: string) =>
  axiosInstance.patch<Appointment>(`/appointments/${id}/complete`).then(r => r.data)

export const getBookedSlots = (month: string): Promise<Record<string, string[]>> =>
  axiosInstance.get(`/appointments/booked-slots?month=${month}`).then(r => r.data)

export const getPendingCount = (): Promise<{ count: number }> =>
  axiosInstance.get('/appointments/pending-count').then(r => r.data);
