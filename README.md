# 📚 Reading Club App

University Final Project - Full-stack Reading Club Application

## 👥 Team
- **Yaron** - Backend Lead + AI Integration
- **Alon** - Frontend Lead + Backend Support

## 🏗️ Project Structure

```
reading-club-app/
├── backend/          # Node.js + Express + TypeScript API
├── frontend/         # React + TypeScript SPA
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

### Frontend
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

### Current Status: Week 4 - Frontend & Integration 🚀

- ✅ **Week 1-2** - Backend Foundation (Yaron) - **COMPLETED**
  - Auth, User, Books, Reviews APIs
- ✅ **Week 3** - Frontend UI (Alon/Yaron) - **COMPLETED**
  - Design implementation (Tailwind)
  - Layouts, Components, Navigation
- ✅ **Week 4** - Integrations (Current) - **COMPLETED**
  - ✅ Connect Frontend to Google Books API (Discover/Search)
  - ✅ Connect Clubs to Backend API (Join/Leave/Create)
  - ✅ Update Review Creation with real book data
  - ✅ Wishlist Feature Implementation
- 🔄 **Next Steps**
  - ⬜ Social Interactions Polish (Comments/Likes)
  - ⬜ Advanced AI Integration (Chat/Recommendations)
  - ⬜ E2E Testing & Deployment

## 📝 License

MIT - University Project 2026
