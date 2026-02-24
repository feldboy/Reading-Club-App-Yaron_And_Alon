import api from './api';

/**
 * Review interface
 */
export interface Review {
    id: string;
    userId: string;
    user?: {
        id: string;
        username: string;
        profileImage: string;
    };
    bookTitle: string;
    bookAuthor: string;
    bookImage?: string;
    bookISBN?: string;
    rating: number;
    reviewText: string;
    reviewImage?: string;   // User's personal photo added to the post
    googleBookId?: string;
    likes: string[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Normalize a raw review from the API:
 * - Maps the `userId` populated object to `user`
 * - Ensures `id` is set from `_id` if missing
 */
const normalizeReview = (r: any): Review => {
    const normalized: Review = { ...r, id: r.id || r._id };
    // When MongoDB populates `userId`, it returns an object with _id, username, etc.
    if (r.userId && typeof r.userId === 'object') {
        normalized.user = {
            id: r.userId._id || r.userId.id,
            username: r.userId.username,
            profileImage: r.userId.profileImage || '',
        };
        normalized.userId = r.userId._id || r.userId.id;
    }
    return normalized;
};

/**
 * Like/Unlike response
 */
export interface LikeResponse {
    status: string;
    message: string;
    data: {
        likesCount: number;
        isLiked: boolean;
    };
}

/**
 * Like a review
 */
export const likeReview = async (reviewId: string): Promise<LikeResponse> => {
    const response = await api.post<LikeResponse>(`/reviews/${reviewId}/like`);
    return response.data;
};

/**
 * Unlike a review
 */
export const unlikeReview = async (reviewId: string): Promise<LikeResponse> => {
    const response = await api.delete<LikeResponse>(`/reviews/${reviewId}/like`);
    return response.data;
};



/**
 * Get All Reviews Response
 */
export interface GetAllReviewsResponse {
    status: string;
    success: boolean;
    data: {
        reviews: Review[];
        currentPage: number;
        totalPages: number;
        totalReviews: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

/**
 * Get all reviews with pagination
 */
export const getAllReviews = async (page: number = 1, limit: number = 10): Promise<GetAllReviewsResponse['data']> => {
    const response = await api.get<GetAllReviewsResponse>('/reviews', {
        params: { page, limit },
    });
    const data = response.data.data;
    data.reviews = data.reviews.map(normalizeReview);
    return data;
};

/**
 * Get Review By ID Response
 */
export interface GetReviewByIdResponse {
    status: string;
    success: boolean;
    data: Review;
}

/**
 * Get a single review by ID
 */
export const getReviewById = async (reviewId: string): Promise<Review> => {
    const response = await api.get<GetReviewByIdResponse>(`/reviews/${reviewId}`);
    return normalizeReview(response.data.data);
};

/**
 * Get all reviews by a specific user
 */
export const getUserReviews = async (userId: string, page: number = 1, limit: number = 10): Promise<Review[]> => {
    const response = await api.get<GetAllReviewsResponse>(`/users/${userId}/reviews`, {
        params: { page, limit },
    });
    return response.data.data.reviews.map(normalizeReview);
};

/**
 * Get all reviews for a specific book (by googleBookId)
 */
export const getBookReviews = async (googleBookId: string, page: number = 1, limit: number = 10): Promise<GetAllReviewsResponse['data']> => {
    const response = await api.get<GetAllReviewsResponse>(`/reviews/book/${googleBookId}`, {
        params: { page, limit },
    });
    const data = response.data.data;
    data.reviews = data.reviews.map(normalizeReview);
    return data;
};

/**
 * Create Review Request
 */
export interface CreateReviewRequest {
    bookTitle: string;
    bookAuthor: string;
    bookImage?: string;          // Book cover URL from Google Books
    bookISBN?: string;
    googleBookId?: string;
    rating: number;
    reviewText: string;
    reviewImage?: File;          // Personal photo uploaded by the user
}

/**
 * Create Review Response
 */
export interface CreateReviewResponse {
    status: string;
    success: boolean;
    message?: string;
    data: Review;
}

/**
 * Create a new review
 */
export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
    const formData = new FormData();
    formData.append('bookTitle', data.bookTitle);
    formData.append('bookAuthor', data.bookAuthor);
    formData.append('rating', data.rating.toString());
    formData.append('reviewText', data.reviewText);

    if (data.bookISBN) formData.append('bookISBN', data.bookISBN);
    if (data.googleBookId) formData.append('googleBookId', data.googleBookId);
    // Book cover URL (Google Books) - sent as text
    if (data.bookImage) formData.append('bookImage', data.bookImage);
    // Personal photo - sent as file upload
    if (data.reviewImage instanceof File) {
        formData.append('reviewImage', data.reviewImage);
    }

    const response = await api.post<CreateReviewResponse>('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
};

/**
 * Update Review Request
 */
export interface UpdateReviewRequest {
    bookTitle?: string;
    bookAuthor?: string;
    bookISBN?: string;
    googleBookId?: string;
    rating?: number;
    reviewText?: string;
    reviewImage?: File | null;   // null = remove image
}

/**
 * Update Review Response
 */
export interface UpdateReviewResponse {
    status: string;
    success: boolean;
    message: string;
    data: Review;
}

/**
 * Update a review
 */
export const updateReview = async (reviewId: string, data: UpdateReviewRequest): Promise<Review> => {
    const formData = new FormData();

    if (data.bookTitle) formData.append('bookTitle', data.bookTitle);
    if (data.bookAuthor) formData.append('bookAuthor', data.bookAuthor);
    if (data.reviewText) formData.append('reviewText', data.reviewText);
    if (data.rating !== undefined) formData.append('rating', data.rating.toString());
    if (data.bookISBN) formData.append('bookISBN', data.bookISBN);
    if (data.googleBookId) formData.append('googleBookId', data.googleBookId);
    // reviewImage: File = upload new, null = remove
    if (data.reviewImage instanceof File) {
        formData.append('reviewImage', data.reviewImage);
    } else if (data.reviewImage === null) {
        formData.append('reviewImage', ''); // signal to backend: remove image
    }

    const response = await api.put<UpdateReviewResponse>(`/reviews/${reviewId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
};

/**
 * Delete Review Response
 */
export interface DeleteReviewResponse {
    status: string;
    success: boolean;
    message: string;
}

/**
 * Delete a review
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
    await api.delete<DeleteReviewResponse>(`/reviews/${reviewId}`);
};
