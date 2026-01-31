import { Router } from 'express';
import * as booksController from '../controllers/books.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Google Books API endpoints
 */

/**
 * All book routes require authentication
 */
router.use(verifyToken);

router.get('/search', booksController.searchBooks);
router.get('/genre/:genre', booksController.searchBooksByGenre);
router.get('/:id', booksController.getBookDetails);

export default router;
