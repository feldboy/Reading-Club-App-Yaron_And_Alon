import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { uploadProfileImage } from '../middleware/upload.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * All routes require authentication
 */
router.use(verifyToken);

/**
 * Profile routes
 */
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post(
    '/profile/image',
    uploadProfileImage.single('image'),
    userController.uploadProfileImage
);

export default router;
