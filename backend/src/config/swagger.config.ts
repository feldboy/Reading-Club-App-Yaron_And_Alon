import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Reading Club API',
            version: '1.0.0',
            description: `
API documentation for Reading Club application - University Final Project

## Features
- 🔐 JWT Authentication with refresh tokens
- 🔑 Google OAuth integration
- 👤 User profile management  
- 📚 Book reviews and ratings
- 💬 Comments and likes
- 🤖 AI-powered book search (Google Gemini)
- 📖 Google Books API integration

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_ACCESS_TOKEN
\`\`\`

Tokens expire after 15 minutes. Use the refresh token endpoint to get a new access token.
            `,
            contact: {
                name: 'Yaron & Alon',
                email: 'support@readingclub.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
            {
                url: 'https://your-domain.com',
                description: 'Production server (update with actual domain)',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT access token',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'User ID',
                        },
                        username: {
                            type: 'string',
                            description: 'Username',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email address',
                        },
                        profileImage: {
                            type: 'string',
                            description: 'Profile image URL',
                        },
                        authProvider: {
                            type: 'string',
                            enum: ['local', 'google'],
                            description: 'Authentication provider',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Account creation date',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'error',
                        },
                        message: {
                            type: 'string',
                            example: 'Error description',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints (register, login, OAuth)',
            },
            {
                name: 'Users',
                description: 'User profile management',
            },
            {
                name: 'Books',
                description: 'Google Books API integration',
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to files with Swagger annotations
};

export const swaggerSpec = swaggerJsdoc(options);

/**
 * Setup Swagger UI for Express app
 */
export const setupSwagger = (app: Application): void => {
    // Swagger UI endpoint
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'Reading Club API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            persistAuthorization: true, // Keep authorization token between page refreshes
            displayRequestDuration: true,
            filter: true, // Enable filtering
            docExpansion: 'none', // Collapse all sections by default
        },
    }));

    // Swagger JSON endpoint
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('📚 Swagger documentation available at http://localhost:3000/api-docs');
};
