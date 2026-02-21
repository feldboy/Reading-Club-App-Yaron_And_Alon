import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User.model';
import Review from '../src/models/Review.model';
import { generateTokenPair } from '../src/services/token.service';

describe('Review API', () => {
    let authToken: string;
    let userId: string;
    let otherUserId: string;
    let otherToken: string;
    let reviewId: string;

    beforeAll(async () => {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/reading-club-test';
        // Only connect if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri);
        }
    });

    afterAll(async () => {
        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase();
        }
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Review.deleteMany({});

        // Create main test user
        const user = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
        await user.save();
        userId = user._id.toString();

        const tokens = generateTokenPair({
            userId: userId,
            email: user.email,
        });
        authToken = tokens.accessToken;

        // Create another user for authorization tests
        const otherUser = new User({
            username: 'otheruser',
            email: 'other@example.com',
            password: 'password123',
        });
        await otherUser.save();
        otherUserId = otherUser._id.toString();

        const otherTokens = generateTokenPair({
            userId: otherUser._id.toString(),
            email: otherUser.email,
        });
        otherToken = otherTokens.accessToken;

        // Create a test review
        const review = new Review({
            userId: user._id,
            bookTitle: 'Test Book',
            bookAuthor: 'Test Author',
            bookImage: 'http://example.com/book.jpg',
            rating: 5,
            reviewText: 'This is a test review',
            likes: [],
            likesCount: 0,
            commentsCount: 0,
        });
        await review.save();
        reviewId = review._id.toString();
    });

    describe('POST /api/reviews', () => {
        it('should create a new review with valid data', async () => {
            const reviewData = {
                bookTitle: 'New Book',
                bookAuthor: 'New Author',
                bookImage: 'http://example.com/newbook.jpg',
                bookISBN: '1234567890',
                googleBookId: 'abc123',
                rating: 4.5,
                reviewText: 'Great book!',
            };

            const response = await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${authToken}`)
                .send(reviewData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.bookTitle).toBe(reviewData.bookTitle);
            expect(response.body.data.rating).toBe(reviewData.rating);
            expect(response.body.data.likesCount).toBe(0);
        });

        it('should return 401 if not authenticated', async () => {
            const reviewData = {
                bookTitle: 'New Book',
                bookAuthor: 'New Author',
                bookImage: 'http://example.com/book.jpg',
                rating: 4,
                reviewText: 'Great!',
            };

            await request(app)
                .post('/api/reviews')
                .send(reviewData)
                .expect(401);
        });

        it('should return 400 if missing required fields', async () => {
            const reviewData = {
                bookTitle: 'New Book',
                // Missing bookAuthor, rating, reviewText
            };

            await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${authToken}`)
                .send(reviewData)
                .expect(400);
        });

        it('should return 400 if rating is invalid', async () => {
            const reviewData = {
                bookTitle: 'New Book',
                bookAuthor: 'New Author',
                bookImage: 'http://example.com/book.jpg',
                rating: 6, // Invalid: > 5
                reviewText: 'Great!',
            };

            await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${authToken}`)
                .send(reviewData)
                .expect(400);
        });
    });

    describe('GET /api/reviews', () => {
        beforeEach(async () => {
            // Create multiple reviews for pagination testing
            const reviews = [];
            for (let i = 1; i <= 15; i++) {
                reviews.push({
                    userId: userId,
                    bookTitle: `Book ${i}`,
                    bookAuthor: `Author ${i}`,
                    bookImage: `http://example.com/book${i}.jpg`,
                    rating: (i % 5) + 1,
                    reviewText: `Review ${i}`,
                    likes: [],
                    likesCount: 0,
                    commentsCount: 0,
                });
            }
            await Review.insertMany(reviews);
        });

        it('should get all reviews with default pagination', async () => {
            const response = await request(app)
                .get('/api/reviews')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.reviews).toBeInstanceOf(Array);
            expect(response.body.data.reviews.length).toBeLessThanOrEqual(10);
            expect(response.body.data.currentPage).toBe(1);
            expect(response.body.data.totalReviews).toBeGreaterThan(0);
        });

        it('should support pagination with custom page and limit', async () => {
            const response = await request(app)
                .get('/api/reviews?page=2&limit=5')
                .expect(200);

            expect(response.body.data.currentPage).toBe(2);
            expect(response.body.data.reviews.length).toBeLessThanOrEqual(5);
            expect(response.body.data.hasPrevPage).toBe(true);
        });

        it('should enforce max limit of 50 per page', async () => {
            const response = await request(app)
                .get('/api/reviews?limit=100')
                .expect(200);

            expect(response.body.data.reviews.length).toBeLessThanOrEqual(50);
        });
    });

    describe('GET /api/reviews/:id', () => {
        it('should get a review by ID', async () => {
            const response = await request(app)
                .get(`/api/reviews/${reviewId}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data._id).toBe(reviewId);
            expect(response.body.data.bookTitle).toBe('Test Book');
        });

        it('should return 404 if review not found', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await request(app)
                .get(`/api/reviews/${fakeId}`)
                .expect(404);
        });

        it('should return 404 if review ID is invalid', async () => {
            await request(app)
                .get('/api/reviews/invalid-id')
                .expect(404);
        });
    });

    describe('PUT /api/reviews/:id', () => {
        it('should update own review', async () => {
            const updates = {
                bookTitle: 'Updated Book',
                rating: 3,
                reviewText: 'Updated review text',
            };

            const response = await request(app)
                .put(`/api/reviews/${reviewId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updates)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.bookTitle).toBe(updates.bookTitle);
            expect(response.body.data.rating).toBe(updates.rating);
        });

        it('should return 403 when trying to update someone else\'s review', async () => {
            const updates = {
                rating: 1,
                reviewText: 'Hacked!',
            };

            await request(app)
                .put(`/api/reviews/${reviewId}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send(updates)
                .expect(403);
        });

        it('should return 401 if not authenticated', async () => {
            await request(app)
                .put(`/api/reviews/${reviewId}`)
                .send({ rating: 3 })
                .expect(401);
        });

        it('should return 404 if review not found', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await request(app)
                .put(`/api/reviews/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ rating: 3 })
                .expect(404);
        });

        it('should return 400 for invalid rating', async () => {
            await request(app)
                .put(`/api/reviews/${reviewId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ rating: 0 }) // Invalid: < 1
                .expect(400);
        });
    });

    describe('DELETE /api/reviews/:id', () => {
        it('should delete own review', async () => {
            await request(app)
                .delete(`/api/reviews/${reviewId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204);

            // Verify deletion
            const review = await Review.findById(reviewId);
            expect(review).toBeNull();
        });

        it('should return 403 when trying to delete someone else\'s review', async () => {
            await request(app)
                .delete(`/api/reviews/${reviewId}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .expect(403);

            // Verify not deleted
            const review = await Review.findById(reviewId);
            expect(review).not.toBeNull();
        });

        it('should return 401 if not authenticated', async () => {
            await request(app)
                .delete(`/api/reviews/${reviewId}`)
                .expect(401);
        });

        it('should return 404 if review not found', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await request(app)
                .delete(`/api/reviews/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('GET /api/users/:userId/reviews', () => {
        beforeEach(async () => {
            // Create multiple reviews for the user
            const reviews = [];
            for (let i = 1; i <= 12; i++) {
                reviews.push({
                    userId: userId,
                    bookTitle: `User Book ${i}`,
                    bookAuthor: `Author ${i}`,
                    bookImage: `http://example.com/book${i}.jpg`,
                    rating: (i % 5) + 1,
                    reviewText: `User review ${i}`,
                });
            }
            await Review.insertMany(reviews);

            // Create reviews for other user
            await Review.create({
                userId: otherUserId,
                bookTitle: 'Other User Book',
                bookAuthor: 'Other Author',
                bookImage: 'http://example.com/other.jpg',
                rating: 4,
                reviewText: 'Other user review',
            });
        });

        it('should get all reviews by specific user', async () => {
            const response = await request(app)
                .get(`/api/users/${userId}/reviews`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.reviews).toBeInstanceOf(Array);
            expect(response.body.data.totalReviews).toBeGreaterThan(10);

            // All reviews should belong to the user
            response.body.data.reviews.forEach((review: any) => {
                expect(review.userId._id || review.userId).toBe(userId);
            });
        });

        it('should support pagination for user reviews', async () => {
            const response = await request(app)
                .get(`/api/users/${userId}/reviews?page=2&limit=5`)
                .expect(200);

            expect(response.body.data.currentPage).toBe(2);
            expect(response.body.data.reviews.length).toBeLessThanOrEqual(5);
        });

        it('should return empty array for user with no reviews', async () => {
            const newUser = new User({
                username: 'newuser',
                email: 'new@example.com',
                password: 'password123',
            });
            await newUser.save();

            const response = await request(app)
                .get(`/api/users/${newUser._id}/reviews`)
                .expect(200);

            expect(response.body.data.reviews).toEqual([]);
            expect(response.body.data.totalReviews).toBe(0);
        });

        it('should return 400 for invalid user ID', async () => {
            await request(app)
                .get('/api/users/invalid-id/reviews')
                .expect(400);
        });
    });

    describe('POST /api/reviews/:id/like', () => {
        it('should like a review', async () => {
            const response = await request(app)
                .post(`/api/reviews/${reviewId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.likesCount).toBe(1);
            expect(response.body.data.isLiked).toBe(true);

            const review = await Review.findById(reviewId);
            expect(review?.likesCount).toBe(1);
            expect(review?.likes).toHaveLength(1);
        });

        it('should return 400 if already liked', async () => {
            await request(app)
                .post(`/api/reviews/${reviewId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            await request(app)
                .post(`/api/reviews/${reviewId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);
        });

        it('should return 401 if not authenticated', async () => {
            await request(app)
                .post(`/api/reviews/${reviewId}/like`)
                .expect(401);
        });

        it('should return 404 if review does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await request(app)
                .post(`/api/reviews/${fakeId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('DELETE /api/reviews/:id/like', () => {
        beforeEach(async () => {
            const review = await Review.findById(reviewId);
            if (review) {
                review.likes.push(new mongoose.Types.ObjectId(userId));
                review.likesCount = 1;
                await review.save();
            }
        });

        it('should unlike a review', async () => {
            const response = await request(app)
                .delete(`/api/reviews/${reviewId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.likesCount).toBe(0);
            expect(response.body.data.isLiked).toBe(false);

            const review = await Review.findById(reviewId);
            expect(review?.likesCount).toBe(0);
            expect(review?.likes).toHaveLength(0);
        });

        it('should return 400 if not liked', async () => {
            await request(app)
                .delete(`/api/reviews/${reviewId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            await request(app)
                .delete(`/api/reviews/${reviewId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);
        });

        it('should return 401 if not authenticated', async () => {
            await request(app)
                .delete(`/api/reviews/${reviewId}/like`)
                .expect(401);
        });

        it('should return 404 if review does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await request(app)
                .delete(`/api/reviews/${fakeId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});


