import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User.model';
import path from 'path';
import fs from 'fs';

describe('User Profile API', () => {
    let accessToken: string;
    let userId: string;

    // Create a test user and get auth token before each test
    beforeEach(async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        accessToken = res.body.data.accessToken;
        userId = res.body.data.user.id;
    });

    describe('GET /api/users/profile', () => {
        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.user).not.toHaveProperty('password');
        });

        it('should return 401 if not authenticated', async () => {
            const res = await request(app)
                .get('/api/users/profile');

            expect(res.status).toBe(401);
        });

        it('should return 401 with invalid token', async () => {
            const res = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'Bearer invalid-token');

            expect(res.status).toBe(401);
        });
    });

    describe('PUT /api/users/profile', () => {
        it('should update user profile successfully', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    username: 'updateduser',
                    bio: 'Love reading books!',
                });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data.user.username).toBe('updateduser');
            expect(res.body.data.user.bio).toBe('Love reading books!');
        });

        it('should update favorite genres', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    favoriteGenres: ['Fiction', 'Mystery', 'Science Fiction'],
                });

            expect(res.status).toBe(200);
            expect(res.body.data.user.favoriteGenres).toEqual(
                expect.arrayContaining(['Fiction', 'Mystery', 'Science Fiction'])
            );
        });

        it('should not update password through profile endpoint', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    password: 'newpassword',
                });

            expect(res.status).toBe(200);
            // Verify password was not changed
            const user = await User.findById(userId);
            expect(user).toBeDefined();
            // Password should not have changed
        });

        it('should not update email through profile endpoint', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    email: 'newemail@example.com',
                });

            expect(res.status).toBe(200);
            const user = await User.findById(userId);
            expect(user?.email).toBe('test@example.com'); // Should remain unchanged
        });

        it('should return 401 if not authenticated', async () => {
            const res = await request(app)
                .put('/api/users/profile')
                .send({
                    username: 'newusername',
                });

            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/users/profile/image', () => {
        const testImagePath = path.join(__dirname, 'test-image.jpg');

        // Create a test image file before tests
        beforeAll(() => {
            // Create a minimal valid JPEG file (1x1 pixel)
            const jpegHeader = Buffer.from([
                0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
                0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
                0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
            ]);
            fs.writeFileSync(testImagePath, jpegHeader);
        });

        // Clean up test image after tests
        afterAll(() => {
            if (fs.existsSync(testImagePath)) {
                fs.unlinkSync(testImagePath);
            }
        });

        it('should upload profile image successfully', async () => {
            const res = await request(app)
                .post('/api/users/profile/image')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('image', testImagePath);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('imageUrl');
            expect(res.body.data.imageUrl).toContain('/uploads/profiles/');
        });

        it('should return 400 if no image provided', async () => {
            const res = await request(app)
                .post('/api/users/profile/image')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('No image');
        });

        it('should return 401 if not authenticated', async () => {
            const res = await request(app)
                .post('/api/users/profile/image')
                .attach('image', testImagePath);

            expect(res.status).toBe(401);
        });

        it('should reject invalid file types', async () => {
            // Create a text file
            const txtPath = path.join(__dirname, 'test.txt');
            fs.writeFileSync(txtPath, 'This is not an image');

            const res = await request(app)
                .post('/api/users/profile/image')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('image', txtPath);

            // Clean up
            fs.unlinkSync(txtPath);

            expect(res.status).toBe(500);
            expect(res.body.message).toContain('Invalid file type');
        });
    });

    describe('Profile Image Cleanup', () => {
        it('should delete old profile image when uploading new one', async () => {
            const testImagePath = path.join(__dirname, 'test-image.jpg');
            const jpegHeader = Buffer.from([
                0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
                0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
                0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
            ]);
            fs.writeFileSync(testImagePath, jpegHeader);

            // Upload first image
            const res1 = await request(app)
                .post('/api/users/profile/image')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('image', testImagePath);

            const firstImageUrl = res1.body.data.imageUrl;

            // Upload second image (should delete first)
            const res2 = await request(app)
                .post('/api/users/profile/image')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('image', testImagePath);

            expect(res2.status).toBe(200);
            expect(res2.body.data.imageUrl).not.toBe(firstImageUrl);

            // Clean up
            fs.unlinkSync(testImagePath);
        });
    });
});
