import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import booksRoutes from './routes/books.routes';
import commentRoutes from './routes/comment.routes';
import reviewRoutes from './routes/review.routes';
import aiRoutes from './routes/ai.routes';
import { setupSwagger } from './config/swagger.config';
import { setupPassport } from './config/passport.config';

dotenv.config();

const app: Application = express();

/**
 * Middleware
 */
// CORS - Allow frontend to access API (support both common dev ports)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Security Headers & CSP
app.use((_req: Request, res: Response, next: NextFunction) => {
    // Permissive CSP for development - allows Google OAuth flow
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "connect-src 'self' http://localhost:3000 http://localhost:5173 http://localhost:5174 https://lh3.googleusercontent.com https://fonts.googleapis.com https://fonts.gstatic.com https://accounts.google.com https://www.googleapis.com https://oauth2.googleapis.com; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://accounts.google.com https://apis.google.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: blob: http://localhost:3000 http://localhost:5173 http://localhost:5174 https://lh3.googleusercontent.com https://*.googleusercontent.com https://books.google.com https://*.ggpht.com https://images.unsplash.com; " +
        "frame-src https://accounts.google.com; " +
        "form-action 'self' https://accounts.google.com;"
    );
    next();
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Initialize Passport
setupPassport();
app.use(passport.initialize());

/**
 * Swagger Documentation
 */
setupSwagger(app);

/**
 * Basic health check endpoint
 */
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Reading Club API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/api', commentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
    });
});

/**
 * Global Error Handler
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);

    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
});

export default app;
