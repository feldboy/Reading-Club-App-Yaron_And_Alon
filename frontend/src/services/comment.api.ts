import api from './api';
import type { Comment } from '../types/review';

/**
 * Add comment request
 */
export interface AddCommentRequest {
    text: string;
}

/**
 * Add comment response
 */
export interface AddCommentResponse {
    status: string;
    message: string;
    data: {
        comment: Comment;
    };
}

/**
 * Get comments response
 */
export interface GetCommentsResponse {
    status: string;
    data: {
        comments: Comment[];
    };
}

/**
 * Add a comment to a review
 */
export const addComment = async (reviewId: string, text: string, image?: File): Promise<Comment> => {
    let payload: any;
    let headers = {};

    if (image) {
        payload = new FormData();
        payload.append('text', text);
        payload.append('image', image);
        headers = { 'Content-Type': 'multipart/form-data' };
    } else {
        payload = { text };
    }

    const response = await api.post<AddCommentResponse>(`/reviews/${reviewId}/comments`, payload, {
        headers,
    });
    return response.data.data.comment;
};

/**
 * Get all comments for a review
 */
export const getComments = async (reviewId: string): Promise<Comment[]> => {
    const response = await api.get<GetCommentsResponse>(`/reviews/${reviewId}/comments`);
    return response.data.data.comments;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
};

