import { Router } from 'express';
import { getClubs, createClub, joinClub, leaveClub } from '../controllers/club.controller';
import { verifyToken as authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes (or protected?)
// Usually viewing clubs is public, but joining needs auth
router.get('/', getClubs);

// Protected routes
router.post('/', authMiddleware, createClub);
router.post('/:id/join', authMiddleware, joinClub);
router.post('/:id/leave', authMiddleware, leaveClub);

export default router;
