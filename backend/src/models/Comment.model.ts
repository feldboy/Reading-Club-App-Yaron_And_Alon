import mongoose, { Schema, Document } from 'mongoose';

/**
 * Comment Interface
 */
export interface IComment extends Document {
    reviewId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Comment Schema
 */
const CommentSchema: Schema = new Schema(
    {
        reviewId: {
            type: Schema.Types.ObjectId,
            ref: 'Review',
            required: [true, 'Review ID is required'],
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        text: {
            type: String,
            required: [true, 'Comment text is required'],
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes for performance
 */
CommentSchema.index({ reviewId: 1, createdAt: -1 });

export default mongoose.model<IComment>('Comment', CommentSchema);


