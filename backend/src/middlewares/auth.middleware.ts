import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface JwtPayload {
  userId: string;
  role: 'admin' | 'artist' | 'customer';
}


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Invalid or missing authorization header" });
    }

    const token = header.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Invalid Authorization format" });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload as JwtPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};