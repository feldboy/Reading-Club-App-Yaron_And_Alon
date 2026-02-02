import { Router } from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * Public routes
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

/**
 * Google OAuth routes
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`
    }),
    authController.googleAuthCallback
);

/**
 * Protected routes
 */
router.post('/logout', verifyToken, authController.logout);

export default router;
