import { Router } from 'express';
import { getAllStyles, createStyle, updateStyle, deleteStyle } from '../controller/tattooStyle.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', getAllStyles);
router.post('/', authenticate, requireRole('admin'), createStyle);
router.put('/:id', authenticate, requireRole('admin'), updateStyle);
router.delete('/:id', authenticate, requireRole('admin'), deleteStyle);

export default router;
