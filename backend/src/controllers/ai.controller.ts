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
 *   get:
 *     summary: Get personalized book recommendations based on user's reading history
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
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
 *                     userProfile:
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
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
export async function recommend(req: Request, res: Response): Promise<void> {
    try {
        // Get userId from authenticated user
        const userId = (req as any).tokenPayload?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }

        // Call AI service — it will pull user data from the DB
        const result = await aiService.getRecommendations(userId);

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

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Chat with the AI Book Assistant
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message
 *                 example: "בא לי ספר מתח אבל מצחיק"
 *               history:
 *                 type: array
 *                 description: Previous conversation messages
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, model]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: AI chat reply
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
 *                     reply:
 *                       type: string
 *                     history:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
export async function chat(req: Request, res: Response): Promise<void> {
    try {
        const { message, history } = req.body;

        // Validate message
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: 'Message is required and must be a non-empty string'
            });
            return;
        }

        if (message.length > 1000) {
            res.status(400).json({
                success: false,
                message: 'Message is too long (max 1000 characters)'
            });
            return;
        }

        // Validate history if provided
        if (history && !Array.isArray(history)) {
            res.status(400).json({
                success: false,
                message: 'History must be an array'
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
        const result = await aiService.chatWithAI(
            message.trim(),
            history || [],
            userId
        );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('AI chat controller error:', error);

        if (error.message.includes('Rate limit exceeded')) {
            res.status(429).json({
                success: false,
                message: error.message
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: 'AI chat failed. Please try again later.'
        });
    }
}
