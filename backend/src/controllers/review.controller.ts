import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.model';

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
        const userId = req.user?.userId;

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
        if (review.likes.some((likeId) => likeId.toString() === userId)) {
            res.status(400).json({
                status: 'error',
                message: 'Review already liked',
            });
            return;
        }

        // Add like
        review.likes.push(userIdObj);
        review.likesCount += 1;
        await review.save();

        res.status(200).json({
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
        const userId = req.user?.userId;

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
        const likeIndex = review.likes.findIndex((likeId) => likeId.toString() === userId);
        if (likeIndex === -1) {
            res.status(400).json({
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

