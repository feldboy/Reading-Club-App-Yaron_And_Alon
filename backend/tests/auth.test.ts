import request from 'supertest';
import app from '../src/app';
import User from '../src/models/User.model';

describe('Authentication API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data).toHaveProperty('refreshToken');
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.user.username).toBe('testuser');
            expect(res.body.data.user).not.toHaveProperty('password');
        });

        it('should return 400 if username is missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
            expect(res.body.message).toContain('required');
        });

        it('should return 400 if email is missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
        });

        it('should return 400 if password is missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
        });

        it('should return 400 if password is too short', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: '12345',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('6 characters');
        });

        it('should return 400 if email format is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'invalid-email',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('email');
        });

        it('should return 400 if email already exists', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                });

            // Attempt duplicate registration
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'anotheruser',
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Email already registered');
        });

        it('should return 400 if username already exists', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test1@example.com',
                    password: 'password123',
                });

            // Attempt duplicate username
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test2@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Username already taken');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user before each login test
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                });
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data).toHaveProperty('refreshToken');
        });

        it('should return 400 if email is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe('error');
        });

        it('should return 401 if email does not exist', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Invalid');
        });

        it('should return 401 if password is incorrect', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Invalid');
        });

        it('should return 401 if trying to login OAuth user with password', async () => {
            // Create OAuth user directly
            await User.create({
                username: 'googleuser',
                email: 'google@example.com',
                authProvider: 'google',
                googleId: '123456',
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'google@example.com',
                    password: 'anypassword',
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toContain('Google');
        });
    });

    describe('POST /api/auth/refresh', () => {
        let refreshToken: string;

        beforeEach(async () => {
            // Register and get tokens
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                });

            refreshToken = res.body.data.refreshToken;
        });

        it('should refresh access token successfully', async () => {
            const res = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data).toHaveProperty('accessToken');
        });

        it('should return 400 if refresh token is missing', async () => {
            const res = await request(app)
                .post('/api/auth/refresh')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('required');
        });

        it('should return 401 if refresh token is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken: 'invalid-token' });

            expect(res.status).toBe(401);
        });
    });

    describe('POST /api/auth/logout', () => {
        let accessToken: string;

        beforeEach(async () => {
            // Register and get token
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                });

            accessToken = res.body.data.accessToken;
        });

        it('should logout successfully', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
        });

        it('should return 401 if not authenticated', async () => {
            const res = await request(app)
                .post('/api/auth/logout');

            expect(res.status).toBe(401);
        });

        it('should return 401 if token is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', 'Bearer invalid-token');

            expect(res.status).toBe(401);
        });
    });
});
