import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';
import { swaggerSpec } from './swagger';
import logger from './utils/logger';

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

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
  skip: () => process.env.NODE_ENV === 'test',
}));
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/styles', styleRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
