import Post, { IPost } from '../models/posts.model';

export const findAllPosts = () => Post.find().populate('publishedBy');
export const findPostById = (id: string) => Post.findById(id).populate('publishedBy');
export const createPost = (data: Partial<IPost>) => Post.create(data);
export const updatePostById = (id: string, data: Partial<IPost>) =>
  Post.findByIdAndUpdate(id, data, { new: true }).populate('publishedBy');
export const deletePostById = (id: string) => Post.findByIdAndDelete(id);
