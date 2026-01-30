# 📚 Reading Club App

University Final Project - Full-stack Reading Club Application

## 👥 Team
- **Yaron** - Backend Lead + AI Integration
- **Alon** - Frontend Lead + Backend Support

## 🏗️ Project Structure

```
reading-club-app/
├── backend/          # Node.js + Express + TypeScript API
├── frontend/         # React + TypeScript SPA (coming soon)
└── docs/            # Project documentation
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend (Coming Soon)
```bash
cd frontend
npm install
npm run dev
```

## 📖 Documentation

- [Implementation Plan](implementation_plan.md) - Detailed technical plan
- [Task Breakdown](reading-club-project-plan.md) - Developer-specific tasks
- [Project Summary](README-SUMMARY.md) - Quick overview

## 🌟 Features

- 🔐 JWT Authentication + Google OAuth
- 📚 Book reviews and ratings
- 💬 Comments and likes
- 🤖 AI-powered book search and recommendations (Google Gemini)
- 📖 Google Books API integration
- 📱 Responsive design
- ✅ Unit tests with Jest
- 📝 Swagger API documentation

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- JWT + bcrypt
- Google Gemini AI
- Swagger

### Frontend
- React 18
- TypeScript
- React Router v6
- Axios
- Context API

## 🌳 Git Workflow

We use a branch-based workflow:

```
main (production)
  ↓
develop (integration)
  ↓
feature branches (yaron/*, alon/*)
```

**Rules:**
- Never commit directly to `main`
- All work branches from `develop`
- Pull Requests required for all merges
- Code review by the other developer

## 📅 Progress

### Current Status: Week 2 - Advanced Backend ✅🚀

- ✅ **Week 1** - Backend Setup (Yaron) - **COMPLETED**
- ✅ **Week 1-2** - Authentication API (Yaron) - **COMPLETED**
  - JWT-based auth with register, login, logout, refresh
  - User model with OAuth support ready
  - Middleware for protected routes
  - 19 passing tests
- ✅ **Week 2** - Advanced Features (Yaron) - **COMPLETED**
  - ✅ Google OAuth integration (Passport.js)
  - ✅ User Profile API (GET, PUT, upload image)
  - ✅ Google Books API integration (search, details, genre)
  - ✅ Jest testing setup (32 tests passing)
  - ✅ Swagger documentation (all endpoints)
- 🔄 **Week 2-3** - Next Steps
  - ⬜ Frontend Setup (Alon)
  - ⬜ Reviews API (Yaron)
  - ⬜ AI Integration (Yaron)
- ⬜ **Week 3** - Reviews Feature (Both)
- ⬜ **Week 4** - Social Features (Both)
- ⬜ **Week 5** - Testing & Polish (Both)
- ⬜ **Week 6** - Deployment (Both)

## 📝 License

MIT - University Project 2026
