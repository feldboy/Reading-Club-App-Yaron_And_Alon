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

