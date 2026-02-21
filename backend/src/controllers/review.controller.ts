import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.model';
import * as reviewService from '../services/review.service';

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book reviews management
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new book review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - bookTitle
 *               - bookAuthor
 *               - rating
 *               - reviewText
 *             properties:
 *               bookTitle:
 *                 type: string
 *               bookAuthor:
 *                 type: string
 *               bookImage:
 *                 type: string
 *                 format: binary
 *               bookISBN:
 *                 type: string
 *               googleBookId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               reviewText:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 */
export const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { bookTitle, bookAuthor, bookISBN, googleBookId, rating, reviewText } = req.body;
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }

        if (!bookTitle || !bookAuthor || !rating || !reviewText) {
            res.status(400).json({ success: false, status: 'error', message: 'Missing required fields' });
            return;
        }

        const numRating = parseFloat(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            res.status(400).json({ success: false, status: 'error', message: 'Rating must be between 1 and 5' });
            return;
        }

        let bookImage = req.body.bookImage || '';
        if ((req as any).file) {
            bookImage = `/uploads/reviews/${(req as any).file.filename}`;
        }
        // bookImage can be empty - not required (frontend may provide Google Books URL or none)

        const review = await reviewService.createReview(userId, {
            bookTitle,
            bookAuthor,
            bookImage,
            bookISBN,
            googleBookId,
            rating: numRating,
            reviewText,
        });

        res.status(201).json({ success: true, message: 'Review created successfully', data: review });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Failed to create review', error: error.message });
    }
};

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews with pagination
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit } = req.query;
        const result = await reviewService.getAllReviews(page as string, limit as string);
        res.status(200).json({ success: true, status: 'success', data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, status: 'error', message: 'Failed to retrieve reviews', error: error.message });
    }
};

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       404:
 *         description: Review not found
 */
export const getReviewById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const review = await reviewService.getReviewById(id);

        if (!review) {
            res.status(404).json({ success: false, status: 'error', message: 'Review not found' });
            return;
        }

        res.status(200).json({ success: true, status: 'success', data: review });
    } catch (error: any) {
        res.status(400).json({ success: false, status: 'error', message: 'Failed to retrieve review', error: error.message });
    }
};

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               bookTitle:
 *                 type: string
 *               bookAuthor:
 *                 type: string
 *               bookImage:
 *                 type: string
 *                 format: binary
 *               rating:
 *                 type: number
 *               reviewText:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
export const updateReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (req.body.rating !== undefined) {
            const numRating = Number(req.body.rating);
            if (isNaN(numRating) || numRating < 1 || numRating > 5) {
                res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
                return;
            }
        }
        // Validate review ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: 'Invalid review ID' });
            return;
        }

        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }

        const updates: any = {};
        if (req.body.bookTitle) updates.bookTitle = req.body.bookTitle;
        if (req.body.bookAuthor) updates.bookAuthor = req.body.bookAuthor;
        if (req.body.bookISBN) updates.bookISBN = req.body.bookISBN;
        if (req.body.googleBookId) updates.googleBookId = req.body.googleBookId;
        if (req.body.reviewText) updates.reviewText = req.body.reviewText;

        if (req.body.rating) {
            const numRating = parseFloat(req.body.rating);
            if (isNaN(numRating) || numRating < 1 || numRating > 5) {
                res.status(400).json({ success: false, status: 'error', message: 'Rating must be between 1 and 5' });
                return;
            }
            updates.rating = numRating;
        }

        if ((req as any).file) {
            updates.bookImage = `/uploads/reviews/${(req as any).file.filename}`;
        } else if (req.body.bookImage) {
            updates.bookImage = req.body.bookImage;
        }

        const review = await reviewService.updateReview(id, userId, updates);

        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }

        res.status(200).json({ success: true, status: 'success', message: 'Review updated successfully', data: review });
    } catch (error: any) {
        if (error.message.includes('Unauthorized')) {
            res.status(403).json({ success: false, status: 'error', message: error.message });
            return;
        }
        res.status(500).json({ success: false, status: 'error', message: 'Failed to update review', error: error.message });
    }
};

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 */
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }

        const deleted = await reviewService.deleteReview(id, userId);

        if (!deleted) {
            res.status(404).json({ success: false, status: 'error', message: 'Review not found' });
            return;
        }

        res.status(204).send();
    } catch (error: any) {
        if (error.message.includes('Unauthorized')) {
            res.status(403).json({ success: false, status: 'error', message: error.message });
            return;
        }
        res.status(500).json({ success: false, status: 'error', message: 'Failed to delete review', error: error.message });
    }
};

/**
 * @swagger
 * /api/users/{userId}/reviews:
 *   get:
 *     summary: Get all reviews by a specific user
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 */
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Validate userId first to match test expectations (returns 400 for invalid ID)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ success: false, message: 'Invalid user ID' });
            return;
        }

        const { page, limit } = req.query;
        const result = await reviewService.getUserReviews(userId, page as string, limit as string);
        res.status(200).json({ success: true, status: 'success', data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: 'Failed to retrieve user reviews', error: error.message });
    }
};

/**
 * @swagger
 * /api/users/likes:
 *   get:
 *     summary: Get all liked reviews by the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liked reviews retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export const getLikedReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }

        const { page, limit } = req.query;
        const result = await reviewService.getLikedReviews(userId, page as string, limit as string);
        res.status(200).json({ success: true, status: 'success', data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: 'Failed to retrieve liked reviews', error: error.message });
    }
};

/**
 * @swagger
 * /api/reviews/book/{googleBookId}:
 *   get:
 *     summary: Get all reviews for a specific book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: googleBookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Google Books API book ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Book reviews retrieved successfully
 */
export const getBookReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { googleBookId } = req.params;
        const { page, limit } = req.query;
        const result = await reviewService.getBookReviews(googleBookId, page as string, limit as string);
        res.status(200).json({ success: true, status: 'success', data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, status: 'error', message: 'Failed to retrieve book reviews', error: error.message });
    }
};

/**
 * @swagger
 * /api/reviews/{id}/like:
 *   post:
 *     summary: Like a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review liked successfully
 *       400:
 *         description: Already liked or validation error
 *       404:
 *         description: Review not found
 */
export const likeReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
            return;
        }

        // Find review
        const review = await Review.findById(id);
        if (!review) {
            res.status(404).json({
                status: 'error',
                message: 'Review not found',
            });
            return;
        }

        // Check if already liked
        const userIdObj = new mongoose.Types.ObjectId(userId);
        if (review.likes && review.likes.some((likeId) => likeId && likeId.toString() === userId)) {
            res.status(400).json({
                success: false,
                status: 'error',
                message: 'Review already liked',
            });
            return;
        }

        if (!review.likes) review.likes = [];

        // Add like
        review.likes.push(userIdObj);
        review.likesCount += 1;
        await review.save();

        res.status(200).json({
            success: true,
            status: 'success',
            message: 'Review liked successfully',
            data: {
                likesCount: review.likesCount,
                isLiked: true,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to like review',
        });
    }
};

/**
 * @swagger
 * /api/reviews/{id}/like:
 *   delete:
 *     summary: Unlike a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review unliked successfully
 *       400:
 *         description: Not liked or validation error
 *       404:
 *         description: Review not found
 */
export const unlikeReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
            return;
        }

        // Find review
        const review = await Review.findById(id);
        if (!review) {
            res.status(404).json({
                status: 'error',
                message: 'Review not found',
            });
            return;
        }

        // Check if liked
        const likeIndex = review.likes ? review.likes.findIndex((likeId) => likeId && likeId.toString() === userId) : -1;
        if (likeIndex === -1) {
            res.status(400).json({
                success: false,
                status: 'error',
                message: 'Review not liked',
            });
            return;
        }

        // Remove like
        review.likes.splice(likeIndex, 1);
        review.likesCount = Math.max(0, review.likesCount - 1);
        await review.save();

        res.status(200).json({
            success: true,
            status: 'success',
            message: 'Review unliked successfully',
            data: {
                likesCount: review.likesCount,
                isLiked: false,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to unlike review',
        });
    }
};

