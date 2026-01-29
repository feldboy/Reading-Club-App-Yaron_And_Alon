import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { verifyRefreshToken } from '../services/token.service';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            res.status(400).json({
                status: 'error',
                message: 'Username, email, and password are required',
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                status: 'error',
                message: 'Password must be at least 6 characters',
            });
            return;
        }

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid email format',
            });
            return;
        }

        // Register user
        const result = await authService.registerUser(username, email, password);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: result.user._id,
                    username: result.user.username,
                    email: result.user.email,
                    profileImage: result.user.profileImage,
                },
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            message: error.message || 'Registration failed',
        });
    }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({
                status: 'error',
                message: 'Email and password are required',
            });
            return;
        }

        // Login user
        const result = await authService.loginUser(email, password);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: result.user._id,
                    username: result.user.username,
                    email: result.user.email,
                    profileImage: result.user.profileImage,
                },
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            },
        });
    } catch (error: any) {
        res.status(401).json({
            status: 'error',
            message: error.message || 'Login failed',
        });
    }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
            return;
        }

        await authService.logoutUser(userId);

        res.status(200).json({
            status: 'success',
            message: 'Logout successful',
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Logout failed',
        });
    }
};

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({
                status: 'error',
                message: 'Refresh token is required',
            });
            return;
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Get new access token
        const result = await authService.refreshAccessToken(
            decoded.userId,
            refreshToken
        );

        res.status(200).json({
            status: 'success',
            message: 'Token refreshed successfully',
            data: {
                accessToken: result.accessToken,
            },
        });
    } catch (error: any) {
        res.status(401).json({
            status: 'error',
            message: error.message || 'Token refresh failed',
        });
    }
};
