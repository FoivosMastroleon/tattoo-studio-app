import axiosInstance from '@/lib/axiosInstance';
import type { Appointment } from '@/types';
import type { CreateAppointmentFields } from '@/schemas/appointment';

export const getAppointments = () =>
  axiosInstance.get<Appointment[]>('/appointments').then(r => r.data);

export const createAppointment = (data: CreateAppointmentFields) =>
  axiosInstance.post<Appointment>('/appointments', data).then(r => r.data);

export const updateAppointment = (id: string, data: Partial<CreateAppointmentFields>) =>
  axiosInstance.patch<Appointment>(`/appointments/${id}`, data).then(r => r.data);

export const confirmAppointment = (id: string) =>
  axiosInstance.patch<Appointment>(`/appointments/${id}/confirm`).then(r => r.data);

export const cancelAppointment = (id: string) =>
  axiosInstance.patch<Appointment>(`/appointments/${id}/cancel`).then(r => r.data);

export const completeAppointment = (id: string) =>
  axiosInstance.patch<Appointment>(`/appointments/${id}/complete`).then(r => r.data);
