import axiosInstance from '@/lib/axiosInstance';
import type { TattooStyle } from '@/types';

type StyleData = {
  name: string;
  description?: string;
  imageUrl?: string;
};

export const getTattooStyles = () =>
  axiosInstance.get<TattooStyle[]>('/styles').then(r => r.data);

export const createTattooStyle = (data: StyleData) =>
  axiosInstance.post<TattooStyle>('/styles', data).then(r => r.data);

export const updateTattooStyle = (id: string, data: Partial<StyleData>) =>
  axiosInstance.put<TattooStyle>(`/styles/${id}`, data).then(r => r.data);

export const deleteTattooStyle = (id: string) =>
  axiosInstance.delete<void>(`/styles/${id}`).then(r => r.data);
