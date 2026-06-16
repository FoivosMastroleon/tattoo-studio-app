import axiosInstance from '@/lib/axiosInstance';
import type { User, UserRole } from '@/types';

type UpdateUserData = {
  username?: string;
  phone?: string;
  role?: UserRole;
};

export const getUsers = () =>
  axiosInstance.get<User[]>('/users').then(r => r.data);

export const getUserById = (id: string) =>
  axiosInstance.get<User>(`/users/${id}`).then(r => r.data);

export const updateUser = (id: string, data: UpdateUserData) =>
  axiosInstance.patch<User>(`/users/${id}`, data).then(r => r.data);

export const deleteUser = (id: string) =>
  axiosInstance.delete<void>(`/users/${id}`).then(r => r.data);
