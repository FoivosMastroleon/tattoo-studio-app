import axiosInstance from '@/lib/axiosInstance';
import type { Post } from '@/types';

type PostData = {
  title: string;
  content: string;
  imageUrl?: string;
};

export const getPosts = () =>
  axiosInstance.get<Post[]>('/posts').then(r => r.data);

export const createPost = (data: PostData) =>
  axiosInstance.post<Post>('/posts', data).then(r => r.data);

export const updatePost = (id: string, data: Partial<PostData>) =>
  axiosInstance.put<Post>(`/posts/${id}`, data).then(r => r.data);

export const deletePost = (id: string) =>
  axiosInstance.delete<void>(`/posts/${id}`).then(r => r.data);
