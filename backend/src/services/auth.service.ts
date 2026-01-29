import User, { IUser } from '../models/User.model';
import { generateTokenPair } from './token.service';

/**
 * Register new user
 */
export const registerUser = async (
    username: string,
    email: string,
    password: string
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        if (existingUser.email === email) {
            throw new Error('Email already registered');
        }
        if (existingUser.username === username) {
            throw new Error('Username already taken');
        }
    }

    // Create new user
    const user = new User({
        username,
        email,
        password,
        authProvider: 'local',
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
    });

    // Save refresh token to user
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
        user,
        ...tokens,
    };
};

/**
 * Login user
 */
export const loginUser = async (
    email: string,
    password: string
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
    // Find user by email (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Check if user used OAuth
    if (user.authProvider !== 'local' || !user.password) {
        throw new Error('Please login with Google');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
    });

    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
        user,
        ...tokens,
    };
};

/**
 * Logout user
 */
export const logoutUser = async (userId: string): Promise<void> => {
    await User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: 1 },
    });
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (
    userId: string,
    refreshToken: string
): Promise<{ accessToken: string }> => {
    // Find user and check if refresh token matches
    const user = await User.findById(userId).select('+refreshToken');

    if (!user) {
        throw new Error('User not found');
    }

    if (user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
    }).accessToken;

    return { accessToken };
};
