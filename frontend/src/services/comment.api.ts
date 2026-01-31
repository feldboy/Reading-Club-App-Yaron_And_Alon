import api from './api';

/**
 * Comment interface
 */
export interface Comment {
    id: string;
    reviewId: string;
    user: {
        id: string;
        username: string;
        profileImage: string;
    };
    text: string;
    createdAt: string;
}

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
export const addComment = async (reviewId: string, text: string): Promise<Comment> => {
    const response = await api.post<AddCommentResponse>(`/reviews/${reviewId}/comments`, {
        text,
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

