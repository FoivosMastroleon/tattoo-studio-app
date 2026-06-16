import axiosInstance from '@/lib/axiosInstance';
import type { GalleryImage } from '@/types';

type CreateGalleryImageData = {
  title: string;
  imageUrl: string;
  description?: string;
  style?: string;
};

export const getGalleryImages = () =>
  axiosInstance.get<GalleryImage[]>('/gallery').then(r => r.data);

export const createGalleryImage = (data: CreateGalleryImageData) =>
  axiosInstance.post<GalleryImage>('/gallery', data).then(r => r.data);

export const deleteGalleryImage = (id: string) =>
  axiosInstance.delete<void>(`/gallery/${id}`).then(r => r.data);
