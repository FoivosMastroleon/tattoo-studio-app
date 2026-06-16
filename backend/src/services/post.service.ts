import { Types } from 'mongoose';
import * as postDao from '../dao/post.dao';
import { toPostDTO } from '../mappers/post.mapper';
import { CreatePostInput, UpdatePostInput } from '../validators/post.validator';

export const getAllPosts = async () => {
    const posts = await postDao.findAllPosts();
    return posts.map(toPostDTO);
};

export const createPost = async (publishedBy: string, data: CreatePostInput) => {
    const created = await postDao.createPost({
        ...data,
        publishedBy: new Types.ObjectId(publishedBy),
    });
    const populated = await postDao.findPostById(String(created._id));
    if (!populated) throw new Error('Failed to create post');
    return toPostDTO(populated);
};

export const updatePost = async (id: string, data: UpdatePostInput) => {
    const updated = await postDao.updatePostById(id, data);
    if (!updated) throw new Error('Post not found');
    return toPostDTO(updated);
};

export const deletePost = async (id: string) => {
    const post = await postDao.findPostById(id);
    if (!post) throw new Error('Post not found');
    await postDao.deletePostById(id);
};
