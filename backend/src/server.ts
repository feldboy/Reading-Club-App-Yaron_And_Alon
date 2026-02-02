import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Start server
 */
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start listening
        if (process.env.NODE_ENV === 'production') {
            const fs = await import('fs');
            const https = await import('https');
            const path = await import('path');

            // Try to find certificates in standard locations or env var
            const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, '../server.key');
            const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, '../server.cert');

            if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
                const options = {
                    key: fs.readFileSync(keyPath),
                    cert: fs.readFileSync(certPath)
                };

                https.createServer(options, app).listen(PORT, () => {
                    console.log('🚀 Secure Server is running (HTTPS)');
                    console.log(`📡 Port: ${PORT}`);
                    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
                    console.log(`🔗 Health check: https://localhost:${PORT}/health`);
                });
            } else {
                console.warn('⚠️ SSL certificates not found. Falling back to HTTP.');
                app.listen(PORT, () => {
                    console.log('🚀 Server is running (HTTP fallback)');
                    console.log(`📡 Port: ${PORT}`);
                    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
                    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
                });
            }
        } else {
            app.listen(PORT, () => {
                console.log('🚀 Server is running');
                console.log(`📡 Port: ${PORT}`);
                console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
                console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            });
        }
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
