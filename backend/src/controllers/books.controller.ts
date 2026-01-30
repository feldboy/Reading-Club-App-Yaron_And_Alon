import { Request, Response } from 'express';
import * as booksService from '../services/books.service';

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search for books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *         example: harry potter
 *       - in: query
 *         name: maxResults
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results
 *       - in: query
 *         name: startIndex
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Index of first result
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [relevance, newest]
 *           default: relevance
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Books found successfully
 *       400:
 *         description: Missing query parameter
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */
export const searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, maxResults, startIndex, orderBy } = req.query;

        if (!q || typeof q !== 'string') {
            res.status(400).json({
                status: 'error',
                message: 'Query parameter "q" is required',
            });
            return;
        }

        const options: booksService.BookSearchOptions = {
            maxResults: maxResults ? parseInt(maxResults as string, 10) : 10,
            startIndex: startIndex ? parseInt(startIndex as string, 10) : 0,
            orderBy: (orderBy as 'relevance' | 'newest') || 'relevance',
        };

        const result = await booksService.searchBooks(q, options);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error: any) {
        if (error.message.includes('rate limit')) {
            res.status(429).json({
                status: 'error',
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to search books',
        });
    }
};

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book details by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Google Books volume ID
 *     responses:
 *       200:
 *         description: Book details retrieved successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */
export const getBookDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const book = await booksService.getBookDetails(id);

        res.status(200).json({
            status: 'success',
            data: { book },
        });
    } catch (error: any) {
        if (error.message === 'Book not found') {
            res.status(404).json({
                status: 'error',
                message: error.message,
            });
            return;
        }

        if (error.message.includes('rate limit')) {
            res.status(429).json({
                status: 'error',
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get book details',
        });
    }
};

/**
 * @swagger
 * /api/books/genre/{genre}:
 *   get:
 *     summary: Search books by genre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre name
 *         example: fiction
 *       - in: query
 *         name: maxResults
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results
 *       - in: query
 *         name: startIndex
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Index of first result
 *     responses:
 *       200:
 *         description: Books found successfully
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */
export const searchBooksByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const { genre } = req.params;
        const { maxResults, startIndex } = req.query;

        const options: booksService.BookSearchOptions = {
            maxResults: maxResults ? parseInt(maxResults as string, 10) : 10,
            startIndex: startIndex ? parseInt(startIndex as string, 10) : 0,
        };

        const result = await booksService.searchBooksByGenre(genre, options);

        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error: any) {
        if (error.message.includes('rate limit')) {
            res.status(429).json({
                status: 'error',
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to search books',
        });
    }
};
