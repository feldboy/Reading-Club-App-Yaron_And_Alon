import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../services/token.service';

/**
 * Extend Express Request to include user
 */
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

/**
 * Middleware to verify JWT access token
 */
export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'error',
                message: 'No token provided',
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error: any) {
        res.status(401).json({
            status: 'error',
            message: error.message || 'Invalid token',
        });
    }
};

/**
 * Optional: Middleware to check if user is authenticated (doesn't block request)
 */
export const optionalAuth = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyAccessToken(token);
            req.user = decoded;
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
