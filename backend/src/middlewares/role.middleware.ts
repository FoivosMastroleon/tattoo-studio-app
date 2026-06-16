import { Request, Response, NextFunction } from 'express';

export const requireRole = (...roles: ('admin' | 'artist' | 'customer')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }

        next();
    };
};