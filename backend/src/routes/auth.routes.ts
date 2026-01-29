import { Router } from 'express';
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
 * Protected routes
 */
router.post('/logout', verifyToken, authController.logout);

export default router;
