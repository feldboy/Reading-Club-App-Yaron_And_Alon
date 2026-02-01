import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * AI Routes - All protected by authentication
 */

// POST /api/ai/search - AI-powered book search
router.post('/search', verifyToken, aiController.search);

// POST /api/ai/recommend - Get personalized recommendations
router.post('/recommend', verifyToken, aiController.recommend);

export default router;
