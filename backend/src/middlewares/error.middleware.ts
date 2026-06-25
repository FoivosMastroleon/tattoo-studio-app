import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Error) {
    const e = err as Error & { code?: number | string };

    if (e.code === 11000) {
      res.status(409).json({ message: 'Duplicate value — resource already exists' });
      return;
    }
    if (e.name === 'CastError') {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    if (e.name === 'ValidationError') {
      res.status(400).json({ message: e.message });
      return;
    }
    if (e.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    if (e.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
  }

  logger.error('[Unhandled Error]', { error: err });
  res.status(500).json({ message: 'Internal server error' });
};

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
};
