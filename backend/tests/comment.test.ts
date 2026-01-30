import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import User from '../src/models/User.model';
import Review from '../src/models/Review.model';
import Comment from '../src/models/Comment.model';
import { generateTokenPair } from '../src/services/token.service';

describe('Comment API', () => {
    let authToken: string;
    let userId: string;
    let reviewId: string;
    let commentId: string;

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
        await Comment.deleteMany({});

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
        });
        await review.save();
        reviewId = review._id.toString();
    });

    describe('POST /api/reviews/:reviewId/comments', () => {
        it('should add a comment to a review', async () => {
            const response = await request(app)
                .post(`/api/reviews/${reviewId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    text: 'This is a test comment',
                })
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data.comment.text).toBe('This is a test comment');
            expect(response.body.data.comment.user.username).toBe('testuser');

            // Verify comment was saved
            const comment = await Comment.findOne({ reviewId });
            expect(comment).toBeTruthy();
            expect(comment?.text).toBe('This is a test comment');

            // Verify review commentsCount was incremented
            const review = await Review.findById(reviewId);
            expect(review?.commentsCount).toBe(1);
        });

        it('should return 401 if not authenticated', async () => {
            await request(app)
                .post(`/api/reviews/${reviewId}/comments`)
                .send({
                    text: 'This is a test comment',
                })
                .expect(401);
        });

        it('should return 400 if text is empty', async () => {
            await request(app)
                .post(`/api/reviews/${reviewId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    text: '',
                })
                .expect(400);
        });

        it('should return 404 if review does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await request(app)
                .post(`/api/reviews/${fakeId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    text: 'This is a test comment',
                })
                .expect(404);
        });
    });

    describe('GET /api/reviews/:reviewId/comments', () => {
        it('should get all comments for a review', async () => {
            // Create a comment first
            const comment = new Comment({
                reviewId,
                userId,
                text: 'Test comment',
            });
            await comment.save();

            const response = await request(app)
                .get(`/api/reviews/${reviewId}/comments`)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data.comments).toHaveLength(1);
            expect(response.body.data.comments[0].text).toBe('Test comment');
        });

        it('should return empty array if no comments', async () => {
            const response = await request(app)
                .get(`/api/reviews/${reviewId}/comments`)
                .expect(200);

            expect(response.body.data.comments).toHaveLength(0);
        });

        it('should return 404 if review does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await request(app)
                .get(`/api/reviews/${fakeId}/comments`)
                .expect(404);
        });
    });

    describe('DELETE /api/comments/:commentId', () => {
        beforeEach(async () => {
            // Create a comment
            const comment = new Comment({
                reviewId,
                userId,
                text: 'Comment to delete',
            });
            await comment.save();
            commentId = comment._id.toString();

            // Update review commentsCount
            const review = await Review.findById(reviewId);
            if (review) {
                review.commentsCount = 1;
                await review.save();
            }
        });

        it('should delete own comment', async () => {
            const response = await request(app)
                .delete(`/api/comments/${commentId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.status).toBe('success');

            // Verify comment was deleted
            const comment = await Comment.findById(commentId);
            expect(comment).toBeNull();

            // Verify review commentsCount was decremented
            const review = await Review.findById(reviewId);
            expect(review?.commentsCount).toBe(0);
        });

        it('should return 401 if not authenticated', async () => {
            await request(app)
                .delete(`/api/comments/${commentId}`)
                .expect(401);
        });

        it('should return 404 if comment does not exist', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            await request(app)
                .delete(`/api/comments/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });

        it('should return 403 if trying to delete someone else\'s comment', async () => {
            // Create another user
            const otherUser = new User({
                username: 'otheruser',
                email: 'other@example.com',
                password: 'password123',
            });
            await otherUser.save();

            // Create comment by other user
            const otherComment = new Comment({
                reviewId,
                userId: otherUser._id,
                text: 'Other user comment',
            });
            await otherComment.save();

            // Try to delete with first user's token
            await request(app)
                .delete(`/api/comments/${otherComment._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(403);
        });
    });
});

