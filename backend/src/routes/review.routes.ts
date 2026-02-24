import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { uploadReviewImage } from '../middleware/upload.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management endpoints
 */

// CRUD routes
router.post('/', verifyToken, uploadReviewImage.single('reviewImage'), reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/book/:googleBookId', reviewController.getBookReviews);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', verifyToken, uploadReviewImage.single('reviewImage'), reviewController.updateReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);

// Like/Unlike routes
router.post('/:id/like', verifyToken, reviewController.likeReview);
router.delete('/:id/like', verifyToken, reviewController.unlikeReview);

export default router;


