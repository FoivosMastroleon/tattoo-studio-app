import axiosInstance from '@/lib/axiosInstance';
import type { LoginFields, RegisterFields } from '@/schemas/auth';
import type { User } from '@/types';

type AuthResponse = {
  user: User;
  token: string;
};

export const register = (data: RegisterFields) =>
  axiosInstance.post<AuthResponse>('/auth/register', data).then(r => r.data);

export const login = (data: LoginFields) =>
  axiosInstance.post<AuthResponse>('/auth/login', data).then(r => r.data);

export const getMe = () =>
  axiosInstance.get<User>('/auth/me').then(r => r.data);

export const googleLogin = (idToken: string) =>
  axiosInstance.post<AuthResponse>('/auth/google', { idToken }).then(r => r.data);

