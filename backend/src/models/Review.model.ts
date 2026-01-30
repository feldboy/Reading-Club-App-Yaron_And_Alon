import mongoose, { Schema, Document } from 'mongoose';

/**
 * Review Interface
 */
export interface IReview extends Document {
    userId: mongoose.Types.ObjectId;
    bookTitle: string;
    bookAuthor: string;
    bookImage?: string;
    bookISBN?: string;
    rating: number;
    reviewText: string;
    googleBookId?: string;
    likes: mongoose.Types.ObjectId[];
    likesCount: number;
    commentsCount: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Review Schema
 */
const ReviewSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        bookTitle: {
            type: String,
            required: [true, 'Book title is required'],
            trim: true,
        },
        bookAuthor: {
            type: String,
            required: [true, 'Book author is required'],
            trim: true,
        },
        bookImage: {
            type: String,
        },
        bookISBN: {
            type: String,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        reviewText: {
            type: String,
            required: [true, 'Review text is required'],
            trim: true,
        },
        googleBookId: {
            type: String,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        likesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes for performance
 */
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ createdAt: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);

