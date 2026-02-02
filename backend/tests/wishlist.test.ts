import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User.model';
import { generateAccessToken } from '../src/services/token.service';

let authToken: string;
let userId: string;

beforeEach(async () => {
    // Create test user
    const user = await User.create({
        username: 'wishlisttest',
        email: 'wishlist@test.com',
        password: 'password123',
        authProvider: 'local'
    });
    userId = user._id.toString();
    authToken = generateAccessToken({ userId, email: 'wishlist@test.com' });
});

describe('Wishlist API', () => {
    const bookData = {
        bookId: 'test_book_id_123',
        title: 'Test Book',
        authors: ['Test Author'],
        cover: 'http://example.com/cover.jpg'
    };

    it('should add a book to wishlist', async () => {
        const res = await request(app)
            .post('/api/users/wishlist')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookData);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.wishlist).toHaveLength(1);
        expect(res.body.data.wishlist[0].bookId).toBe(bookData.bookId);
    });

    it('should retrieve wishlist', async () => {
        // Seed data: Add book first
        await request(app)
            .post('/api/users/wishlist')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookData);

        const res = await request(app)
            .get('/api/users/wishlist')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.wishlist).toHaveLength(1);
        expect(res.body.data.wishlist[0].bookId).toBe(bookData.bookId);
    });

    it('should prevent duplicate books in wishlist', async () => {
        // Add first time
        await request(app)
            .post('/api/users/wishlist')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookData);

        // Add second time
        const res = await request(app)
            .post('/api/users/wishlist')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookData);

        expect(res.status).toBe(200);
        // Should NOT have added a second entry with same ID
        expect(res.body.data.wishlist).toHaveLength(1);
    });

    it('should remove a book from wishlist', async () => {
        // Seed data: Add book first
        await request(app)
            .post('/api/users/wishlist')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookData);

        // Verify added
        let res = await request(app)
            .get('/api/users/wishlist')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.body.data.wishlist).toHaveLength(1);

        // Remove
        res = await request(app)
            .delete(`/api/users/wishlist/${bookData.bookId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
        expect(res.body.data.wishlist).toHaveLength(0);
    });
});
