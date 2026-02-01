/**
 * Review type definitions
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

