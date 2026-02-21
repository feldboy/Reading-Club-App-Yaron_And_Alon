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
    googleBookId?: string;
    likes: string[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
}

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
    data.reviews = data.reviews.map((r: any) => ({ ...r, id: r._id || r.id }));
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
    const review = response.data.data as any;
    return { ...review, id: review.id || review._id }; // Strict override
};

/**
 * Get all reviews by a specific user
 */
export const getUserReviews = async (userId: string, page: number = 1, limit: number = 10): Promise<Review[]> => {
    const response = await api.get<GetAllReviewsResponse>(`/users/${userId}/reviews`, {
        params: { page, limit },
    });
    // Use GetAllReviewsResponse structure assuming the endpoint returns similar structure
    // Manual transform to ensure id is present
    return response.data.data.reviews.map((review: any) => ({
        ...review,
        id: review.id || review._id, // Strict override to ensure we use MongoDB ID
    }));
};

/**
 * Get all reviews for a specific book (by googleBookId)
 */
export const getBookReviews = async (googleBookId: string, page: number = 1, limit: number = 10): Promise<GetAllReviewsResponse['data']> => {
    const response = await api.get<GetAllReviewsResponse>(`/reviews/book/${googleBookId}`, {
        params: { page, limit },
    });
    const data = response.data.data;
    data.reviews = data.reviews.map((r: any) => ({ ...r, id: r._id || r.id }));
    return data;
};

/**
 * Create Review Request
 */
export interface CreateReviewRequest {
    bookTitle: string;
    bookAuthor: string;
    bookImage?: string | File;
    bookISBN?: string;
    googleBookId?: string;
    rating: number;
    reviewText: string;
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

    if (data.bookISBN) {
        formData.append('bookISBN', data.bookISBN);
    }
    if (data.googleBookId) {
        formData.append('googleBookId', data.googleBookId);
    }
    // Always send bookImage (can be URL string from Google Books or local upload path)
    if (data.bookImage !== undefined) {
        if (data.bookImage instanceof File) {
            formData.append('bookImage', data.bookImage);
        } else {
            formData.append('bookImage', data.bookImage);
        }
    }

    const response = await api.post<CreateReviewResponse>('/reviews', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};

/**
 * Update Review Request
 */
export interface UpdateReviewRequest {
    bookTitle?: string;
    bookAuthor?: string;
    bookImage?: string | File;
    bookISBN?: string;
    googleBookId?: string;
    rating?: number;
    reviewText?: string;
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
    if (data.bookImage) {
        if (data.bookImage instanceof File) {
            formData.append('bookImage', data.bookImage);
        } else {
            formData.append('bookImage', data.bookImage);
        }
    }

    const response = await api.put<UpdateReviewResponse>(`/reviews/${reviewId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
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
