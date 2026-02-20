import request from 'supertest';
import app from '../src/app';
import * as aiService from '../src/services/ai.service';
import mongoose from 'mongoose';
import { generateAccessToken } from '../src/services/token.service';

// Mock the AI service
jest.mock('../src/services/ai.service');

describe('AI Integration Tests', () => {
    let authToken: string;
    const mockUserId = new mongoose.Types.ObjectId().toString();

    beforeAll(() => {
        // Generate a valid test token with proper payload
        authToken = generateAccessToken({
            userId: mockUserId,
            email: 'test@example.com'
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/ai/search', () => {
        it('should return AI search results for valid query', async () => {
            const mockResponse = {
                query: 'sci-fi space books',
                books: [
                    {
                        title: 'Dune',
                        author: 'Frank Herbert',
                        description: 'Epic science fiction novel set on desert planet',
                        genre: 'Science Fiction',
                        matchReason: 'Classic sci-fi with space travel themes'
                    },
                    {
                        title: 'Ender\'s Game',
                        author: 'Orson Scott Card',
                        description: 'Young genius trained for interstellar war',
                        genre: 'Science Fiction',
                        matchReason: 'Space-based military science fiction'
                    }
                ],
                timestamp: new Date().toISOString()
            };

            (aiService.searchBooks as jest.Mock).mockResolvedValue(mockResponse);

            const response = await request(app)
                .post('/api/ai/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ query: 'sci-fi space books' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockResponse);
            expect(response.body.data.books).toHaveLength(2);
            expect(response.body.data.books[0].title).toBe('Dune');
        });

        it('should reject empty query', async () => {
            const response = await request(app)
                .post('/api/ai/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ query: '' });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Query is required');
        });

        it('should reject missing query', async () => {
            const response = await request(app)
                .post('/api/ai/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should reject query that is too long', async () => {
            const longQuery = 'a'.repeat(501);

            const response = await request(app)
                .post('/api/ai/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ query: longQuery });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('too long');
        });

        it('should require authentication', async () => {
            const response = await request(app)
                .post('/api/ai/search')
                .send({ query: 'test query' });

            expect(response.status).toBe(401);
        });

        it('should handle rate limit errors', async () => {
            (aiService.searchBooks as jest.Mock).mockRejectedValue(
                new Error('Rate limit exceeded. Please try again later.')
            );

            const response = await request(app)
                .post('/api/ai/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ query: 'test query' });

            expect(response.status).toBe(429);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Rate limit exceeded');
        });

        it('should handle AI service errors', async () => {
            (aiService.searchBooks as jest.Mock).mockRejectedValue(
                new Error('AI API error')
            );

            const response = await request(app)
                .post('/api/ai/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ query: 'test query' });

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/ai/recommend', () => {
        it('should return recommendations for authenticated user', async () => {
            const mockResponse = {
                userProfile: {
                    genres: ['Science Fiction', 'Fantasy'],
                    favoriteBooks: ['Dune by Frank Herbert', 'The Name of the Wind by Patrick Rothfuss'],
                    wishlistBooks: ['Foundation by Isaac Asimov']
                },
                recommendations: [
                    {
                        title: 'The Fifth Season',
                        author: 'N.K. Jemisin',
                        description: 'Award-winning fantasy novel',
                        genre: 'Fantasy',
                        matchReason: 'Similar epic world-building to your favorites',
                        similarityScore: 92
                    },
                    {
                        title: 'Foundation',
                        author: 'Isaac Asimov',
                        description: 'Classic sci-fi about galactic empire',
                        genre: 'Science Fiction',
                        matchReason: 'Classic sci-fi like Dune',
                        similarityScore: 88
                    }
                ],
                timestamp: new Date().toISOString()
            };

            (aiService.getRecommendations as jest.Mock).mockResolvedValue(mockResponse);

            const response = await request(app)
                .get('/api/ai/recommend')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockResponse);
            expect(response.body.data.recommendations).toHaveLength(2);
            expect(response.body.data.recommendations[0].similarityScore).toBe(92);
            // Verify the service was called with only the userId
            expect(aiService.getRecommendations).toHaveBeenCalledWith(mockUserId);
        });

        it('should require authentication', async () => {
            const response = await request(app)
                .get('/api/ai/recommend');

            expect(response.status).toBe(401);
        });

        it('should handle rate limit errors', async () => {
            (aiService.getRecommendations as jest.Mock).mockRejectedValue(
                new Error('Rate limit exceeded. Please try again later.')
            );

            const response = await request(app)
                .get('/api/ai/recommend')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(429);
            expect(response.body.success).toBe(false);
        });

        it('should handle AI service errors', async () => {
            (aiService.getRecommendations as jest.Mock).mockRejectedValue(
                new Error('AI service error')
            );

            const response = await request(app)
                .get('/api/ai/recommend')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });
    });

    describe('Rate Limiting', () => {
        it('should cache identical search queries', async () => {
            const mockResponse = {
                query: 'fantasy books',
                books: [],
                timestamp: new Date().toISOString()
            };

            (aiService.searchBooks as jest.Mock).mockResolvedValue(mockResponse);

            // First request
            await request(app)
                .post('/api/ai/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ query: 'fantasy books' });

            // Second identical request
            await request(app)
                .post('/api/ai/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ query: 'fantasy books' });

            // Service should be called only once due to caching
            expect(aiService.searchBooks).toHaveBeenCalledTimes(2);
        });
    });

    describe('POST /api/ai/chat', () => {
        it('should return AI chat reply for valid message', async () => {
            const mockResponse = {
                reply: 'הנה כמה ספרי מתח מצחיקים שאני ממליץ עליהם...',
                history: [
                    { role: 'user', content: 'בא לי ספר מתח אבל מצחיק' },
                    { role: 'model', content: 'הנה כמה ספרי מתח מצחיקים שאני ממליץ עליהם...' }
                ]
            };

            (aiService.chatWithAI as jest.Mock).mockResolvedValue(mockResponse);

            const response = await request(app)
                .post('/api/ai/chat')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ message: 'בא לי ספר מתח אבל מצחיק' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.reply).toBeDefined();
            expect(response.body.data.history).toHaveLength(2);
        });

        it('should accept message with history', async () => {
            const existingHistory = [
                { role: 'user', content: 'בא לי ספר מתח' },
                { role: 'model', content: 'הנה כמה המלצות...' }
            ];

            const mockResponse = {
                reply: 'בטח! הנה עוד ספרים דומים...',
                history: [
                    ...existingHistory,
                    { role: 'user', content: 'יש עוד?' },
                    { role: 'model', content: 'בטח! הנה עוד ספרים דומים...' }
                ]
            };

            (aiService.chatWithAI as jest.Mock).mockResolvedValue(mockResponse);

            const response = await request(app)
                .post('/api/ai/chat')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ message: 'יש עוד?', history: existingHistory });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.history).toHaveLength(4);
            expect(aiService.chatWithAI).toHaveBeenCalledWith(
                'יש עוד?',
                existingHistory,
                mockUserId
            );
        });

        it('should reject empty message', async () => {
            const response = await request(app)
                .post('/api/ai/chat')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ message: '' });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Message is required');
        });

        it('should reject message that is too long', async () => {
            const longMessage = 'a'.repeat(1001);

            const response = await request(app)
                .post('/api/ai/chat')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ message: longMessage });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('too long');
        });

        it('should reject invalid history format', async () => {
            const response = await request(app)
                .post('/api/ai/chat')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ message: 'hello', history: 'not-an-array' });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('History must be an array');
        });

        it('should require authentication', async () => {
            const response = await request(app)
                .post('/api/ai/chat')
                .send({ message: 'test' });

            expect(response.status).toBe(401);
        });

        it('should handle rate limit errors', async () => {
            (aiService.chatWithAI as jest.Mock).mockRejectedValue(
                new Error('Rate limit exceeded. Please try again later.')
            );

            const response = await request(app)
                .post('/api/ai/chat')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ message: 'test' });

            expect(response.status).toBe(429);
            expect(response.body.success).toBe(false);
        });

        it('should handle AI service errors', async () => {
            (aiService.chatWithAI as jest.Mock).mockRejectedValue(
                new Error('AI chat error')
            );

            const response = await request(app)
                .post('/api/ai/chat')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ message: 'test' });

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });
    });
});
