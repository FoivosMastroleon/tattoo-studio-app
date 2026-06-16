import { Router } from 'express';
import { getAllImages, createImage, deleteImage } from '../controller/galleryImage.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', getAllImages);
router.post('/', authenticate, requireRole('admin', 'artist'), createImage);
router.delete('/:id', authenticate, requireRole('admin'), deleteImage);

export default router;
