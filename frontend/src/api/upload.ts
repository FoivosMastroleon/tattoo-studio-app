import axiosInstance from '@/lib/axiosInstance';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axiosInstance.post<{ url: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url;
};
