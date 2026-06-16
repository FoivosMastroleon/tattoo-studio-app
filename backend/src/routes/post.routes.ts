import { Router } from 'express';
import { getAllPosts, createPost, updatePost, deletePost } from '../controller/post.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', getAllPosts);
router.post('/', authenticate, requireRole('admin'), createPost);
router.put('/:id', authenticate, requireRole('admin'), updatePost);
router.delete('/:id', authenticate, requireRole('admin'), deletePost);

export default router;
