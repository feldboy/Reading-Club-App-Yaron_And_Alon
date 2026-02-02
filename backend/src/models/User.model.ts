import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * User Interface
 */
export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    authProvider: 'local' | 'google';
    googleId?: string;
    profileImage: string;
    bio?: string;
    favoriteGenres?: string[];
    wishlist: {
        bookId: string;
        title: string;
        authors: string[];
        cover: string;
        addedAt: Date;
    }[];
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Schema
 */
const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username cannot exceed 30 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        googleId: {
            type: String,
            sparse: true,
        },
        profileImage: {
            type: String,
            default: '/uploads/profiles/default-avatar.png',
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
            default: '',
        },
        favoriteGenres: {
            type: [String],
            default: [],
        },
        wishlist: [
            {
                bookId: { type: String, required: true },
                title: String,
                authors: [String],
                cover: String,
                addedAt: { type: Date, default: Date.now },
            },
        ],
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Pre-save hook to hash password
 */
UserSchema.pre('save', async function (next) {
    // Only hash password if it's modified and exists
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

/**
 * Method to compare passwords
 */
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Indexes for performance
 */
// Indexes for performance
// email and googleId are already indexed via unique/sparse constraints in schema definition

export default mongoose.model<IUser>('User', UserSchema);
