import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management endpoints
 */

/**
 * Public routes
 */
router.get('/reviews/:reviewId/comments', commentController.getComments);

/**
 * Protected routes
 */
router.post('/reviews/:reviewId/comments', verifyToken, commentController.addComment);
router.delete('/comments/:commentId', verifyToken, commentController.deleteComment);

export default router;

