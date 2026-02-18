import { Request, Response } from 'express';
import Comment from '../models/Comment.model';
import Review from '../models/Review.model';
import mongoose from 'mongoose';

/**
 * @swagger
 * /api/reviews/{reviewId}/comments:
 *   post:
 *     summary: Add a comment to a review
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Review not found
 */
export const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewId } = req.params;
        const { text } = req.body;
        // Get userId from token
        const userId = req.tokenPayload?.userId;
        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized: User not authenticated',
            });
            return;
        }

        // Validation
        if (!text || text.trim().length === 0) {
            res.status(400).json({
                status: 'error',
                message: 'Comment text is required',
            });
            return;
        }

        if (text.length > 1000) {
            res.status(400).json({
                status: 'error',
                message: 'Comment cannot exceed 1000 characters',
            });
            return;
        }

        // Check if review exists
        // Check if review exists - handle both ObjectId and GoogleBookId
        let review;
        if (mongoose.Types.ObjectId.isValid(reviewId)) {
            review = await Review.findById(reviewId);
        } else {
            review = await Review.findOne({ googleBookId: reviewId });
        }
        if (!review) {
            res.status(404).json({
                status: 'error',
                message: 'Review not found',
            });
            return;
        }

        // Create comment
        const comment = new Comment({
            reviewId: review._id, // Use the resolved MongoDB _id
            userId,
            text: text.trim(),
        });

        await comment.save();

        // Increment commentsCount on review
        review.commentsCount += 1;
        await review.save();

        // Populate user info
        await comment.populate('userId', 'username profileImage');

        res.status(201).json({
            status: 'success',
            message: 'Comment added successfully',
            data: {
                comment: {
                    id: comment._id,
                    reviewId: comment.reviewId,
                    user: {
                        id: (comment.userId as any)._id,
                        username: (comment.userId as any).username,
                        profileImage: (comment.userId as any).profileImage,
                    },
                    text: comment.text,
                    createdAt: comment.createdAt,
                },
            },
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to add comment',
        });
    }
};

/**
 * @swagger
 * /api/reviews/{reviewId}/comments:
 *   get:
 *     summary: Get all comments for a review
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Review not found
 */
export const getComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reviewId } = req.params;

        // Check if review exists
        // Check if review exists - handle both ObjectId and GoogleBookId
        let review;
        if (mongoose.Types.ObjectId.isValid(reviewId)) {
            review = await Review.findById(reviewId);
        } else {
            review = await Review.findOne({ googleBookId: reviewId });
        }
        if (!review) {
            res.status(404).json({
                status: 'error',
                message: 'Review not found',
            });
            return;
        }

        // Get all comments for this review, sorted by newest first
        // Get all comments for this review using the resolved _id
        const comments = await Comment.find({ reviewId: review._id })
            .populate('userId', 'username profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            data: {
                comments: comments.map((comment) => ({
                    id: comment._id,
                    reviewId: comment.reviewId,
                    user: {
                        id: (comment.userId as any)._id,
                        username: (comment.userId as any).username,
                        profileImage: (comment.userId as any).profileImage,
                    },
                    text: comment.text,
                    createdAt: comment.createdAt,
                })),
            },
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get comments',
        });
    }
};

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId } = req.params;
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
            return;
        }

        // Find comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({
                status: 'error',
                message: 'Comment not found',
            });
            return;
        }

        // Check if user owns the comment
        if (comment.userId.toString() !== userId) {
            res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this comment',
            });
            return;
        }

        // Find review and decrement commentsCount
        const review = await Review.findById(comment.reviewId);
        if (review) {
            review.commentsCount = Math.max(0, review.commentsCount - 1);
            await review.save();
        }

        // Delete comment
        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to delete comment',
        });
    }
};


