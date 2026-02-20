import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * AI Routes - All protected by authentication
 */

// POST /api/ai/search - AI-powered book search
router.post('/search', verifyToken, aiController.search);

// GET /api/ai/recommend - Get personalized recommendations
router.get('/recommend', verifyToken, aiController.recommend);

// POST /api/ai/chat - AI chat with conversation history
router.post('/chat', verifyToken, aiController.chat);

export default router;
