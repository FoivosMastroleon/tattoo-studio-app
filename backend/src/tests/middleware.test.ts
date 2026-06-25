import type { Request, Response, NextFunction } from 'express';
import { errorMiddleware, notFoundMiddleware } from '../middlewares/error.middleware';
import { AppError } from '../utils/AppError';

const makeRes = () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { res: { status } as unknown as Response, json, status };
};

const req = {} as Request;
const next = jest.fn() as unknown as NextFunction;

describe('errorMiddleware', () => {
  it('handles AppError with correct statusCode', () => {
    const { res, status, json } = makeRes();
    errorMiddleware(new AppError('Not found', 404), req, res, next);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('handles Mongoose duplicate key error (code 11000) → 409', () => {
    const { res, status } = makeRes();
    const err = Object.assign(new Error('dup key'), { code: 11000 });
    errorMiddleware(err, req, res, next);
    expect(status).toHaveBeenCalledWith(409);
  });

  it('handles Mongoose CastError → 400', () => {
    const { res, status } = makeRes();
    const err = Object.assign(new Error('cast error'), { name: 'CastError' });
    errorMiddleware(err, req, res, next);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('handles Mongoose ValidationError → 400', () => {
    const { res, status } = makeRes();
    const err = Object.assign(new Error('validation failed'), { name: 'ValidationError' });
    errorMiddleware(err, req, res, next);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('handles JsonWebTokenError → 401', () => {
    const { res, status } = makeRes();
    const err = Object.assign(new Error('jwt malformed'), { name: 'JsonWebTokenError' });
    errorMiddleware(err, req, res, next);
    expect(status).toHaveBeenCalledWith(401);
  });

  it('handles TokenExpiredError → 401', () => {
    const { res, status } = makeRes();
    const err = Object.assign(new Error('jwt expired'), { name: 'TokenExpiredError' });
    errorMiddleware(err, req, res, next);
    expect(status).toHaveBeenCalledWith(401);
  });

  it('handles generic Error → 500', () => {
    const { res, status } = makeRes();
    errorMiddleware(new Error('unexpected'), req, res, next);
    expect(status).toHaveBeenCalledWith(500);
  });

  it('handles non-Error unknown value → 500', () => {
    const { res, status } = makeRes();
    errorMiddleware('string error', req, res, next);
    expect(status).toHaveBeenCalledWith(500);
  });
});

describe('notFoundMiddleware', () => {
  it('returns 404 with method and path', () => {
    const { res, status, json } = makeRes();
    const notFoundReq = { method: 'GET', path: '/nonexistent' } as Request;
    notFoundMiddleware(notFoundReq, res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'Route GET /nonexistent not found' });
  });
});
