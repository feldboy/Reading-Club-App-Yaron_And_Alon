# Reading Club Frontend

Frontend application for Reading Club App - University Final Project

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal)

### Environment Variables

Create a `.env` file in the `frontend` directory (optional for development):

```env
VITE_API_URL=http://localhost:3000/api
```

**Note:** The default API URL is `http://localhost:3000/api` and is configured in `src/services/api.ts`.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── ai/          # AI features (search, recommendations)
│   │   ├── auth/        # Authentication components
│   │   ├── comment/     # Comment components
│   │   ├── layout/      # Layout components (Navbar, Footer, BottomNav)
│   │   ├── review/      # Review components
│   │   ├── user/        # User profile components
│   │   └── ui/          # Reusable UI components
│   ├── context/          # React Context providers
│   │   └── AuthContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useToggle.ts
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── CreateReviewPage.tsx
│   │   ├── ReviewDetailPage.tsx
│   │   └── ClubsPage.tsx
│   ├── services/         # API service functions
│   │   ├── api.ts        # Axios instance with interceptors
│   │   ├── auth.api.ts
│   │   ├── user.api.ts
│   │   ├── review.api.ts
│   │   ├── comment.api.ts
│   │   ├── books.api.ts
│   │   ├── ai.api.ts
│   │   └── clubs.api.ts
│   ├── types/            # TypeScript type definitions
│   │   └── review.ts
│   ├── routes.tsx         # React Router configuration
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── package.json
└── vite.config.ts         # Vite configuration
```

## 🔌 API Integration

The frontend communicates with the backend API at `http://localhost:3000/api` (configurable via environment variables).

### Authentication

- Tokens are stored in `localStorage`
- Access token is automatically added to requests via Axios interceptor
- Token refresh is handled automatically

### API Services

All API calls are organized in service files:
- `auth.api.ts` - Authentication (login, register, logout, OAuth)
- `user.api.ts` - User profile management
- `review.api.ts` - Review CRUD operations
- `comment.api.ts` - Comment operations
- `books.api.ts` - Google Books API integration
- `ai.api.ts` - AI-powered book search and recommendations
- `clubs.api.ts` - Reading club management

## 🎨 Features

### Implemented Features

- ✅ User authentication (email/password + Google OAuth)
- ✅ User profile management (edit profile, upload image)
- ✅ Review creation, editing, and deletion
- ✅ Review feed with infinite scroll
- ✅ Like/unlike reviews
- ✅ Comments on reviews
- ✅ AI-powered book search
- ✅ Personalized book recommendations
- ✅ Reading clubs (view, join, create)
- ✅ Responsive design

### Key Components

- **AISearchBar** - AI-powered book search with debounced input
- **BookRecommendations** - Personalized recommendations based on user preferences
- **ReviewFeed** - Infinite scroll review feed
- **ReviewCard** - Display individual reviews
- **CommentList** - Display and manage comments
- **LikeButton** - Like/unlike functionality
- **UserProfile** - User profile display
- **EditProfile** - Profile editing form

## 🛠️ Development

### Adding a New Feature

1. Create service function in appropriate `*.api.ts` file
2. Create component(s) in `src/components/`
3. Create page if needed in `src/pages/`
4. Add route in `src/routes.tsx`
5. Update types in `src/types/` if needed

### Styling

The app uses Tailwind CSS with custom classes. Key design patterns:
- Glassmorphism effects (`glass`, `glass-header`, `glass-panel`)
- Primary color: `#a413ec` (purple)
- Dark theme by default

## 📱 Responsive Design

The app is fully responsive:
- **Mobile**: Stacked layout, bottom navigation
- **Tablet**: Adjusted grid layouts
- **Desktop**: Full layout with sidebars

## 🔒 Security

- JWT tokens stored in `localStorage`
- Automatic token refresh before expiration
- Protected routes require authentication
- CORS configured on backend

## 🐛 Troubleshooting

### API Connection Issues

- Ensure backend server is running on `http://localhost:3000`
- Check CORS configuration in backend
- Verify API URL in `src/services/api.ts`

### Authentication Issues

- Clear `localStorage` and try logging in again
- Check token expiration
- Verify backend authentication endpoints

### Build Issues

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (v18+)

## 📚 Dependencies

Key dependencies:
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `vite` - Build tool

See `package.json` for complete list.

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Build output is in `dist/` directory.

## 📝 Notes

- The app uses React Router for client-side routing
- All API calls are centralized in service files
- Error handling is done via Axios interceptors
- Loading states are managed per component
- The app follows a component-based architecture

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## 📄 License

University Final Project
