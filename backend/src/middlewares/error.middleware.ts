import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[${status}] ${message}`);
  res.status(status).json({ message });
};

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
};