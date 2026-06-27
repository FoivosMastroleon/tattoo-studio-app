import { Router } from 'express';
import { uploadImage } from '../controller/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.post('/', authenticate, upload.single('image'), uploadImage);

export default router;
