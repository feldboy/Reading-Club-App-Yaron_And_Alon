import mongoose, { Schema, Document } from 'mongoose';

export interface IClub extends Document {
    name: string;
    description: string;
    cover?: string;
    category: string;
    admin: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    currentBook?: string; // Could be a Book ID or title
    nextMeeting?: string; // Using string for flexibility ("Topmosh", "2 days") or Date
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ClubSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    cover: { type: String },
    category: {
        type: String,
        required: true,
        enum: ['Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Non-Fiction', 'Fiction', 'Other'],
        default: 'Other'
    },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    currentBook: { type: String },
    nextMeeting: { type: String },
    isPrivate: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IClub>('Club', ClubSchema);
