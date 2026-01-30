import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './config/swagger.config';

dotenv.config();

const app: Application = express();

/**
 * Middleware
 */
// CORS - Allow frontend to access API
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

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
