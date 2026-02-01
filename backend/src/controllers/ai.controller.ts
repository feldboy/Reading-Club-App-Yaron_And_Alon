import { Request, Response } from 'express';
import * as aiService from '../services/ai.service';

/**
 * @swagger
 * /api/ai/search:
 *   post:
 *     summary: Search for books using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Search query (e.g., "sci-fi books about space")
 *                 example: "mystery novels set in victorian london"
 *     responses:
 *       200:
 *         description: AI search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     query:
 *                       type: string
 *                     books:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           author:
 *                             type: string
 *                           description:
 *                             type: string
 *                           genre:
 *                             type: string
 *                           matchReason:
 *                             type: string
 *                     timestamp:
 *                       type: string
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
export async function search(req: Request, res: Response): Promise<void> {
    try {
        const { query } = req.body;

        // Validate input
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: 'Query is required and must be a non-empty string'
            });
            return;
        }

        if (query.length > 500) {
            res.status(400).json({
                success: false,
                message: 'Query is too long (max 500 characters)'
            });
            return;
        }

        // Get userId from authenticated user
        const userId = (req as any).tokenPayload?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }

        // Call AI service
        const result = await aiService.searchBooks(query.trim(), userId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('AI search controller error:', error);

        if (error.message.includes('Rate limit exceeded')) {
            res.status(429).json({
                success: false,
                message: error.message
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'AI search failed. Please try again later.'
        });
    }
}

/**
 * @swagger
 * /api/ai/recommend:
 *   post:
 *     summary: Get personalized book recommendations
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Science Fiction", "Fantasy"]
 *               favoriteBooks:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Dune", "The Lord of the Rings"]
 *               readingGoals:
 *                 type: string
 *                 example: "I want to explore more classic literature"
 *               recentlyRead:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Project Hail Mary", "The Martian"]
 *     responses:
 *       200:
 *         description: Personalized recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     preferences:
 *                       type: object
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           author:
 *                             type: string
 *                           description:
 *                             type: string
 *                           genre:
 *                             type: string
 *                           matchReason:
 *                             type: string
 *                           similarityScore:
 *                             type: number
 *                     timestamp:
 *                       type: string
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
export async function recommend(req: Request, res: Response): Promise<void> {
    try {
        const { genres, favoriteBooks, readingGoals, recentlyRead } = req.body;

        // Validate that at least one preference is provided
        if (!genres && !favoriteBooks && !readingGoals && !recentlyRead) {
            res.status(400).json({
                success: false,
                message: 'At least one preference (genres, favoriteBooks, readingGoals, or recentlyRead) is required'
            });
            return;
        }

        // Validate array inputs
        if (genres && !Array.isArray(genres)) {
            res.status(400).json({
                success: false,
                message: 'genres must be an array'
            });
            return;
        }

        if (favoriteBooks && !Array.isArray(favoriteBooks)) {
            res.status(400).json({
                success: false,
                message: 'favoriteBooks must be an array'
            });
            return;
        }

        if (recentlyRead && !Array.isArray(recentlyRead)) {
            res.status(400).json({
                success: false,
                message: 'recentlyRead must be an array'
            });
            return;
        }

        // Get userId from authenticated user
        const userId = (req as any).tokenPayload?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }

        const preferences = {
            genres,
            favoriteBooks,
            readingGoals,
            recentlyRead
        };

        // Call AI service
        const result = await aiService.getRecommendations(preferences, userId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('AI recommend controller error:', error);

        if (error.message.includes('Rate limit exceeded')) {
            res.status(429).json({
                success: false,
                message: error.message
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'AI recommendations failed. Please try again later.'
        });
    }
}
