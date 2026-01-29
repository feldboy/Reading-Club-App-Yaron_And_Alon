# Reading Club Backend

Backend API for Reading Club App - University Final Project

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local installation)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Update MongoDB URI, JWT secrets, etc.

# Run in development mode
npm run dev
```

### Environment Variables

See `.env.example` for all required environment variables.

**Important:** Change all secret keys in production!

### Available Scripts

- `npm run dev` - Run development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (db, passport, etc.)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── tests/               # Test files
├── uploads/             # Uploaded files
└── package.json
```

## 🔌 API Endpoints

API documentation available at `/api-docs` (Swagger UI)

### Health Check
- `GET /health` - Check if server is running

### Authentication (Coming in Phase 2)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/google` - Google OAuth

## 🧪 Testing

```bash
npm test
```

## 🔒 Security

- JWT with refresh tokens
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation

## 👥 Authors

Yaron & Alon - University Final Project 2026

## 📝 License

MIT
