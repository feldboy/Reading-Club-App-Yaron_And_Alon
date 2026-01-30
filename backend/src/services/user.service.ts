import User, { IUser } from '../models/User.model';

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<IUser | null> => {
    const user = await User.findById(userId).select('-password');
    return user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
    userId: string,
    updates: Partial<IUser>
): Promise<IUser | null> => {
    // Don't allow updating sensitive fields
    const allowedUpdates = ['username', 'profileImage', 'bio', 'favoriteGenres'];
    const sanitizedUpdates: any = {};

    Object.keys(updates).forEach((key) => {
        if (allowedUpdates.includes(key)) {
            sanitizedUpdates[key] = (updates as any)[key];
        }
    });

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: sanitizedUpdates },
        { new: true, runValidators: true }
    ).select('-password');

    return user;
};

/**
 * Update profile image
 */
export const updateProfileImage = async (
    userId: string,
    imagePath: string
): Promise<IUser | null> => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { profileImage: imagePath } },
        { new: true }
    ).select('-password');

    return user;
};
