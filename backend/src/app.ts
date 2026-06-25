import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import appointmentRoutes from './routes/appointment.routes';
import galleryRoutes from './routes/galleryImage.routes';
import postRoutes from './routes/post.routes';
import styleRoutes from './routes/tattooStyle.routes';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/styles', styleRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
