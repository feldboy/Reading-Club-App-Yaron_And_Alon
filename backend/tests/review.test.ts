import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User.model';
import Review from '../src/models/Review.model';
import { generateTokenPair } from '../src/services/token.service';

describe('Review Like/Unlike API', () => {
    let authToken: string;
    let userId: string;
    let reviewId: string;

    beforeAll(async () => {
        // Connect to test database
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/reading-club-test';
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        // Clean up and disconnect
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clean up collections
        await User.deleteMany({});
        await Review.deleteMany({});

        // Create a test user
        const user = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
        await user.save();
        userId = user._id.toString();

        // Generate token
        const tokens = generateTokenPair({
            userId: userId,
            email: user.email,
        });
        authToken = tokens.accessToken;

        // Create a test review
        const review = new Review({
            userId: user._id,
            bookTitle: 'Test Book',
            bookAuthor: 'Test Author',
            rating: 5,
            reviewText: 'This is a test review',
            likes: [],
            likesCount: 0,
        });
        await review.save();
        reviewId = review._id.toString();
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

            // Verify review was updated
            const review = await Review.findById(reviewId);
            expect(review?.likesCount).toBe(1);
            expect(review?.likes).toHaveLength(1);
            expect(review?.likes[0].toString()).toBe(userId);
        });

        it('should return 400 if already liked', async () => {
            // Like once
            await request(app)
                .post(`/api/reviews/${reviewId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            // Try to like again
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
            // Like the review first
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

            // Verify review was updated
            const review = await Review.findById(reviewId);
            expect(review?.likesCount).toBe(0);
            expect(review?.likes).toHaveLength(0);
        });

        it('should return 400 if not liked', async () => {
            // Unlike once
            await request(app)
                .delete(`/api/reviews/${reviewId}/like`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            // Try to unlike again
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

