import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { deleteProfileImage } from '../middleware/upload.middleware';

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
            });
            return;
        }

        const user = await userService.getUserProfile(userId);

        if (!user) {
            res.status(404).json({
                success: false,
                status: 'error',
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            status: 'success',
            data: { user },
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to retrieve profile',
        });
    }
};

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newusername
 *               bio:
 *                 type: string
 *                 example: Book lover and avid reader
 *               favoriteGenres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Fiction", "Mystery", "Science Fiction"]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input or username already taken
 *       401:
 *         description: Unauthorized
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
            });
            return;
        }

        const updates = req.body;

        const updatedUser = await userService.updateUserProfile(userId, updates);

        if (!updatedUser) {
            res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: { user: updatedUser },
        });
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(400).json({
                status: 'error',
                message: 'Username already taken',
            });
            return;
        }

        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to update profile',
        });
    }
};

/**
 * @swagger
 * /api/users/profile/image:
 *   post:
 *     summary: Upload profile image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (JPEG, PNG, GIF, WebP, max 5MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No image provided or invalid file type
 *       401:
 *         description: Unauthorized
 */
export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.tokenPayload?.userId;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized',
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({
                status: 'error',
                message: 'No image file provided',
            });
            return;
        }

        // Get old profile image to delete it later
        const user = await userService.getUserProfile(userId);
        const oldImage = user?.profileImage;

        // Update user with new image path
        const imagePath = `/uploads/profiles/${req.file.filename}`;
        const updatedUser = await userService.updateProfileImage(userId, imagePath);

        if (!updatedUser) {
            res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
            return;
        }

        // Delete old image if it exists and is not the default
        if (oldImage && !oldImage.includes('default-profile')) {
            deleteProfileImage(oldImage);
        }

        res.status(200).json({
            status: 'success',
            message: 'Profile image uploaded successfully',
            data: {
                user: updatedUser,
                imageUrl: imagePath,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to upload image',
        });
    }
};

/**
 * @swagger
 * /api/users/wishlist:
 *   get:
 *     summary: Get user wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export const getWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.tokenPayload?.userId;
        if (!userId) {
            res.status(401).json({ status: 'error', message: 'Unauthorized' });
            return;
        }

        const wishlist = await userService.getWishlist(userId);
        res.status(200).json({ status: 'success', data: { wishlist } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve wishlist', error: error.message });
    }
};

/**
 * @swagger
 * /api/users/wishlist:
 *   post:
 *     summary: Add book to wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - title
 *               - authors
 *             properties:
 *               bookId:
 *                 type: string
 *               title:
 *                 type: string
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *               cover:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book added to wishlist
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.tokenPayload?.userId;
        if (!userId) {
            res.status(401).json({ status: 'error', message: 'Unauthorized' });
            return;
        }

        const { bookId, title, authors, cover } = req.body;
        if (!bookId || !title) {
            res.status(400).json({ status: 'error', message: 'Missing required fields' });
            return;
        }

        const wishlist = await userService.addToWishlist(userId, { bookId, title, authors, cover });
        res.status(200).json({ status: 'success', message: 'Book added to wishlist', data: { wishlist } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to add to wishlist', error: error.message });
    }
};

/**
 * @swagger
 * /api/users/wishlist/{bookId}:
 *   delete:
 *     summary: Remove book from wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from wishlist
 *       401:
 *         description: Unauthorized
 */
export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.tokenPayload?.userId;
        if (!userId) {
            res.status(401).json({ status: 'error', message: 'Unauthorized' });
            return;
        }

        const { bookId } = req.params;
        const wishlist = await userService.removeFromWishlist(userId, bookId);
        res.status(200).json({ status: 'success', message: 'Book removed from wishlist', data: { wishlist } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to remove from wishlist', error: error.message });
    }
};
