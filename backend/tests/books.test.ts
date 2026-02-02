import request from 'supertest';
import { NextFunction, Request, Response } from 'express';
import app from '../src/app';
import * as booksService from '../src/services/books.service';

// Mock the books service
jest.mock('../src/services/books.service');

// Mock auth middleware
jest.mock('../src/middleware/auth.middleware', () => ({
    verifyToken: (req: Request, _res: Response, next: NextFunction) => {
        req.user = { id: 'test-user-id' } as any;
        next();
    }
}));

describe('Books API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/books/search', () => {
        const mockBooks = {
            items: [
                {
                    id: '1',
                    title: 'Test Book',
                    authors: ['Test Author'],
                    publisher: 'Test Publisher',
                    publishedDate: '2023',
                    description: 'Test Description',
                    pageCount: 100,
                    categories: ['Test Category'],
                    imageLinks: { thumbnail: 'http://test.com/image.jpg' }
                }
            ],
            totalItems: 1
        };

        it('should return books for a valid query', async () => {
            (booksService.searchBooks as jest.Mock).mockResolvedValue(mockBooks);

            const response = await request(app)
                .get('/api/books/search?q=test')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toEqual(mockBooks);
            expect(booksService.searchBooks).toHaveBeenCalledWith('test', {
                maxResults: 10,
                startIndex: 0,
                orderBy: 'relevance'
            });
        });

        it('should handle custom pagination parameters', async () => {
            (booksService.searchBooks as jest.Mock).mockResolvedValue(mockBooks);

            await request(app)
                .get('/api/books/search?q=test&maxResults=20&startIndex=10&orderBy=newest')
                .expect(200);

            expect(booksService.searchBooks).toHaveBeenCalledWith('test', {
                maxResults: 20,
                startIndex: 10,
                orderBy: 'newest'
            });
        });

        it('should return 400 if query parameter q is missing', async () => {
            await request(app)
                .get('/api/books/search')
                .expect(400);
        });

        it('should handle rate limit errors', async () => {
            (booksService.searchBooks as jest.Mock).mockRejectedValue(new Error('Google Books API rate limit exceeded'));

            const response = await request(app)
                .get('/api/books/search?q=test')
                .expect(429);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toContain('rate limit');
        });

        it('should handle generic service errors', async () => {
            (booksService.searchBooks as jest.Mock).mockRejectedValue(new Error('Service error'));

            const response = await request(app)
                .get('/api/books/search?q=test')
                .expect(500);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Service error');
        });
    });

    describe('GET /api/books/:id', () => {
        const mockBook = {
            id: '1',
            title: 'Test Book',
            authors: ['Test Author']
        };

        it('should return book details for a valid ID', async () => {
            (booksService.getBookDetails as jest.Mock).mockResolvedValue(mockBook);

            const response = await request(app)
                .get('/api/books/1')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.book).toEqual(mockBook);
            expect(booksService.getBookDetails).toHaveBeenCalledWith('1');
        });

        it('should return 404 if book not found', async () => {
            (booksService.getBookDetails as jest.Mock).mockRejectedValue(new Error('Book not found'));

            const response = await request(app)
                .get('/api/books/invalid-id')
                .expect(404);

            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Book not found');
        });

        it('should handle rate limit errors', async () => {
            (booksService.getBookDetails as jest.Mock).mockRejectedValue(new Error('Google Books API rate limit exceeded'));

            await request(app)
                .get('/api/books/1')
                .expect(429);
        });

        it('should handle generic service errors', async () => {
            (booksService.getBookDetails as jest.Mock).mockRejectedValue(new Error('Service error'));

            await request(app)
                .get('/api/books/1')
                .expect(500);
        });
    });

    describe('GET /api/books/genre/:genre', () => {
        const mockBooks = { items: [], totalItems: 0 };

        it('should search books by genre', async () => {
            (booksService.searchBooksByGenre as jest.Mock).mockResolvedValue(mockBooks);

            const response = await request(app)
                .get('/api/books/genre/fiction')
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toEqual(mockBooks);
            expect(booksService.searchBooksByGenre).toHaveBeenCalledWith('fiction', expect.any(Object));
        });

        it('should handle rate limit errors', async () => {
            (booksService.searchBooksByGenre as jest.Mock).mockRejectedValue(new Error('rate limit exceeded'));

            await request(app)
                .get('/api/books/genre/fiction')
                .expect(429);
        });

        it('should handle generic service errors', async () => {
            (booksService.searchBooksByGenre as jest.Mock).mockRejectedValue(new Error('Service error'));

            await request(app)
                .get('/api/books/genre/fiction')
                .expect(500);
        });
    });
});
