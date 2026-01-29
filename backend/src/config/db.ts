import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reading-club';

/**
 * Connect to MongoDB with retry logic
 */
export const connectDB = async (): Promise<void> => {
    try {
        const options = {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(MONGODB_URI, options);

        console.log('✅ MongoDB connected successfully');
        console.log(`📡 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.log('🔄 Retrying connection in 5 seconds...');

        // Retry after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

/**
 * Handle MongoDB disconnection
 */
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

/**
 * Handle process termination
 */
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});
