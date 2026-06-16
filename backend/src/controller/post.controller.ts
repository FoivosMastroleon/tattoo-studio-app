import { Request, Response } from 'express';
import * as postService from '../services/post.service';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';

export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
    try {
        res.json(await postService.getAllPosts());
    } catch {
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: parsed.error.issues[0].message }); return; }
    try {
        res.status(201).json(await postService.createPost(req.user!.userId, parsed.data));
    } catch (err: unknown) {
        res.status(400).json({ message: err instanceof Error ? err.message : 'Failed to create post' });
    }
};

export const updatePost = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: parsed.error.issues[0].message }); return; }
    try {
        res.json(await postService.updatePost(req.params.id, parsed.data));
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'Post not found' });
    }
};

export const deletePost = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        await postService.deletePost(req.params.id);
        res.status(204).send();
    } catch (err: unknown) {
        res.status(404).json({ message: err instanceof Error ? err.message : 'Post not found' });
    }
};
