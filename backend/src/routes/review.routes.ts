import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management endpoints
 */

/**
 * Protected routes for likes
 */
router.post('/reviews/:id/like', verifyToken, reviewController.likeReview);
router.delete('/reviews/:id/like', verifyToken, reviewController.unlikeReview);

export default router;


