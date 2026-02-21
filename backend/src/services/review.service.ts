import Review, { IReview } from '../models/Review.model';
import mongoose from 'mongoose';

/**
 * Pagination result interface
 */
export interface PaginatedReviews {
    reviews: IReview[];
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

/**
 * Create a new review
 */
export const createReview = async (
    userId: string,
    reviewData: {
        bookTitle: string;
        bookAuthor: string;
        bookImage: string;
        bookISBN?: string;
        googleBookId?: string;
        rating: number;
        reviewText: string;
    }
): Promise<IReview> => {
    const review = new Review({
        userId,
        ...reviewData,
        likes: [],
        likesCount: 0,
        commentsCount: 0,
    });

    await review.save();

    // Populate user data before returning
    await review.populate('userId', 'username email profileImage');

    return review;
};

/**
 * Get all reviews with pagination
 */
export const getAllReviews = async (
    pageStr: string = '1',
    limitStr: string = '10'
): Promise<PaginatedReviews> => {
    const page = parseInt(pageStr) || 1;
    const limit = Math.min(parseInt(limitStr) || 10, 50); // Max 50 per page
    const skip = (page - 1) * limit;

    // Get reviews with pagination
    const reviews = await Review.find()
        .populate('userId', 'username email profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    // Get total count
    const total = await Review.countDocuments();

    return {
        reviews: reviews.map((r: any) => ({ ...r, id: r._id || r.id })) as unknown as IReview[],
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    };
};

/**
 * Get a single review by ID
 */
export const getReviewById = async (reviewId: string): Promise<IReview | null> => {
    let query;

    if (mongoose.Types.ObjectId.isValid(reviewId)) {
        query = Review.findById(reviewId);
    } else {
        // Fallback: Try to find by googleBookId 
        // This handles cases where frontend might incorrectly link via Google ID
        query = Review.findOne({ googleBookId: reviewId });
    }

    const review = await query.populate('userId', 'username email profileImage');

    return review;
};

/**
 * Update a review (only by owner)
 */
export const updateReview = async (
    reviewId: string,
    userId: string,
    updates: {
        bookTitle?: string;
        bookAuthor?: string;
        bookImage?: string;
        bookISBN?: string;
        googleBookId?: string;
        rating?: number;
        reviewText?: string;
    }
): Promise<IReview | null> => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error('Invalid review ID');
    }

    // First, find the review to check ownership
    const review = await Review.findById(reviewId);

    if (!review) {
        return null;
    }

    // Check if user is the owner
    if (review.userId.toString() !== userId) {
        throw new Error('Unauthorized: You can only update your own reviews');
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate('userId', 'username email profileImage');

    return updatedReview;
};

/**
 * Delete a review (only by owner)
 */
export const deleteReview = async (
    reviewId: string,
    userId: string
): Promise<boolean> => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error('Invalid review ID');
    }

    // First, find the review to check ownership
    const review = await Review.findById(reviewId);

    if (!review) {
        return false;
    }

    // Check if user is the owner
    if (review.userId.toString() !== userId) {
        throw new Error('Unauthorized: You can only delete your own reviews');
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    return true;
};

/**
 * Get all reviews by a specific user with pagination
 */
export const getUserReviews = async (
    userId: string,
    pageStr: string = '1',
    limitStr: string = '10'
): Promise<PaginatedReviews> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }

    const page = parseInt(pageStr) || 1;
    const limit = Math.min(parseInt(limitStr) || 10, 50);
    const skip = (page - 1) * limit;

    // Get user's reviews with pagination
    const reviews = await Review.find({ userId })
        .populate('userId', 'username email profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    // Get total count for this user
    const total = await Review.countDocuments({ userId });

    return {
        reviews: reviews.map((r: any) => ({ ...r, id: r._id || r.id })) as unknown as IReview[],
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    };
};

/**
 * Get all liked reviews by a specific user with pagination
 */
export const getLikedReviews = async (
    userId: string,
    pageStr: string = '1',
    limitStr: string = '10'
): Promise<PaginatedReviews> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }

    const page = parseInt(pageStr) || 1;
    const limit = Math.min(parseInt(limitStr) || 10, 50);
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ likes: userId })
        .populate('userId', 'username email profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Review.countDocuments({ likes: userId });

    return {
        reviews: reviews.map((r: any) => ({ ...r, id: r._id || r.id })) as unknown as IReview[],
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    };
};

/**
 * Get all reviews for a specific book (by googleBookId) with pagination
 */
export const getBookReviews = async (
    googleBookId: string,
    pageStr: string = '1',
    limitStr: string = '10'
): Promise<PaginatedReviews> => {
    const page = parseInt(pageStr) || 1;
    const limit = Math.min(parseInt(limitStr) || 10, 50);
    const skip = (page - 1) * limit;

    // Get reviews for this book with pagination
    const reviews = await Review.find({ googleBookId })
        .populate('userId', 'username email profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    // Get total count for this book
    const total = await Review.countDocuments({ googleBookId });

    return {
        reviews: reviews.map((r: any) => ({ ...r, id: r._id || r.id })) as unknown as IReview[],
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
    };
};
