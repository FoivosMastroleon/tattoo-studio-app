import { Request, Response, NextFunction } from 'express';
import * as postService from '../services/post.service';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';
import { AppError } from '../utils/AppError';

export const getAllPosts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.json(await postService.getAllPosts());
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to fetch posts', 500));
    }
};

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        res.status(201).json(await postService.createPost(req.user!.userId, parsed.data));
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to create post', 400));
    }
};

export const updatePost = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        res.json(await postService.updatePost(req.params.id, parsed.data));
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Post not found', 404));
    }
};

export const deletePost = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        await postService.deletePost(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Post not found', 404));
    }
};
