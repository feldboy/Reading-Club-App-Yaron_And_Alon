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

/**
 * Get user wishlist
 */
export const getWishlist = async (userId: string): Promise<any[]> => {
    const user = await User.findById(userId).select('wishlist');
    return user ? user.wishlist : [];
};

/**
 * Add book to wishlist
 */
export const addToWishlist = async (
    userId: string,
    bookData: {
        bookId: string;
        title: string;
        authors: string[];
        cover: string;
    }
): Promise<any[]> => {
    const user = await User.findById(userId);
    if (!user) return [];

    // Check if book already exists in wishlist
    const exists = user.wishlist.some((item) => item.bookId === bookData.bookId);
    if (exists) return user.wishlist;

    user.wishlist.push({ ...bookData, addedAt: new Date() });
    await user.save();

    return user.wishlist;
};

/**
 * Remove book from wishlist
 */
export const removeFromWishlist = async (userId: string, bookId: string): Promise<any[]> => {
    const user = await User.findById(userId);
    if (!user) return [];

    user.wishlist = user.wishlist.filter((item) => item.bookId !== bookId);
    await user.save();

    return user.wishlist;
};
