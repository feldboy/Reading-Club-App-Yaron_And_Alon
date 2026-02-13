# 📚 Reading Club App - Frontend

A modern, feature-rich book review and social reading platform built with React, TypeScript, and Vite.

## 🚀 Features

### Core Features
- **User Authentication**: Register/Login with email or Google OAuth
- **Book Discovery**: Search and browse books using Google Books API
- **AI-Powered Search**: Intelligent book search using Gemini AI
- **Reviews & Ratings**: Create, read, and interact with book reviews
- **Social Features**: Like, comment, and engage with other readers
- **Reading Clubs**: Join or create book clubs with other readers
- **Wishlist**: Save books you want to read
- **User Profiles**: Customize your profile with bio and favorite genres

### Technical Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Theme**: Beautiful purple-themed dark UI
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Comprehensive error states and user feedback
- **Accessibility**: WCAG AA compliant with ARIA labels and keyboard navigation
- **Protected Routes**: Authentication-based route protection
- **Infinite Scroll**: Smooth pagination for reviews feed
- **Image Uploads**: Profile picture and review image uploads
- **Real-time Updates**: Optimistic UI updates

## 📦 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (with custom design system)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Fonts**: Space Grotesk, DM Sans, Cormorant Garamond, Libre Baskerville
- **Icons**: Material Symbols (Google Icons)
- **Testing**: Vitest + React Testing Library

## 🎨 Design System

The app features a comprehensive design system with:

- **Color Palette**: Vibrant literary purple theme
  - Primary: `#7C3AED` (Purple)
  - Secondary: `#A78BFA` (Light Purple)
  - Accent: `#22C55E` (Success Green)
  - Background Dark: `#1c1022` (Deep Purple-Black)

- **Typography**:
  - Display/Headings: Space Grotesk
  - Body/UI: DM Sans
  - Editorial: Cormorant Garamond
  - Reading Content: Libre Baskerville

- **Components**:
  - Cards (Glass morphism)
  - Buttons (Primary, Secondary, Ghost)
  - Inputs with validation
  - Skeleton loaders
  - Badges & Chips
  - Avatars & Avatar Groups
  - Empty & Error states

See [DESIGN-SYSTEM-IMPLEMENTATION.md](../DESIGN-SYSTEM-IMPLEMENTATION.md) for full documentation.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Reading Club App Yaron_And_Alon"
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

The app requires a backend API to function. Make sure the backend is running on `http://localhost:3000`.

If your backend runs on a different port, update the Vite proxy configuration in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

### 4. Font Setup

The app uses Google Fonts. Ensure you have an internet connection for fonts to load, or download and host them locally.

## 🚀 Running the App

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is occupied).

### Production Build

Build the app for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

### Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ai/            # AI search components
│   │   ├── auth/          # Authentication components
│   │   ├── cards/         # Card components (Book, Club)
│   │   ├── comment/       # Comment components
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   ├── review/        # Review components
│   │   ├── ui/            # Reusable UI components
│   │   └── user/          # User profile components
│   ├── context/           # React Context providers
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useToggle.ts
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── DiscoverPage.tsx
│   │   ├── ClubsPage.tsx
│   │   ├── WishlistPage.tsx
│   │   ├── CreateReviewPage.tsx
│   │   └── ReviewDetailPage.tsx
│   ├── services/          # API service modules
│   │   ├── api.ts         # Axios instance configuration
│   │   ├── auth.api.ts    # Authentication API
│   │   ├── user.api.ts    # User API
│   │   ├── books.api.ts   # Google Books API
│   │   ├── review.api.ts  # Reviews API
│   │   ├── clubs.api.ts   # Clubs API
│   │   ├── comment.api.ts # Comments API
│   │   └── ai.api.ts      # AI search API
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   ├── routes.tsx         # Route definitions
│   └── index.css          # Global styles & design system
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔑 Key Components

### Authentication
- **LoginPage**: Email/password and Google OAuth login
- **RegisterPage**: New user registration
- **AuthContext**: Global authentication state management

### Discovery
- **DiscoverPage**: Browse and search books by category
- **AISearchBar**: AI-powered natural language book search
- **BookRecommendations**: Personalized AI book recommendations

### Reviews
- **HomePage**: Main feed with infinite scroll
- **ReviewCard**: Individual review display
- **CreateReviewPage**: Multi-step review creation form
- **ReviewDetailPage**: Full review with comments

### Social
- **LikeButton**: Like/unlike reviews
- **CommentList**: Display comments on reviews
- **CommentForm**: Add new comments

### Clubs
- **ClubsPage**: Browse and join reading clubs
- **Create Club Modal**: Create new clubs

### UI Components
All UI components are exported from `components/ui/index.ts`:
- `Card`, `Button`, `Input`, `TextArea`
- `Badge`, `Chip`, `Avatar`, `AvatarGroup`
- `Skeleton`, `EmptyState`, `ErrorState`
- `LoadingSpinner`, `PageLoader`

## 🔒 Authentication Flow

1. **Login/Register**: User signs up or logs in (email or Google OAuth)
2. **Token Storage**: JWT tokens stored in localStorage
3. **Auto-Refresh**: Access token auto-refreshes before expiration
4. **Protected Routes**: Routes check authentication status
5. **API Requests**: Axios interceptor adds JWT to all requests

## 🎯 User Flows

### Creating a Review
1. Navigate to "Create Review" from bottom navigation
2. Search for a book (Google Books API or AI search)
3. Select book from results
4. Rate the book (1-5 stars)
5. Write review text
6. Optionally add image
7. Submit review

### Joining a Club
1. Navigate to "Clubs" page
2. Browse clubs by category
3. Click "Join Club" on desired club
4. Access club details and discussions

### Adding to Wishlist
1. Browse books on Discover page
2. Click bookmark icon on book card
3. View saved books on Wishlist page

## 🧪 Testing

The app includes comprehensive tests for key components:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files are located alongside component files with `.test.tsx` extension.

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## 🐛 Troubleshooting

### Fonts not loading
- Ensure internet connection for Google Fonts
- Check browser console for CSP (Content Security Policy) errors
- Clear browser cache

### API requests failing
- Verify backend is running on `http://localhost:3000`
- Check proxy configuration in `vite.config.ts`
- Verify CORS is enabled on backend

### Login not working
- Clear localStorage: `localStorage.clear()`
- Check backend authentication endpoints
- Verify Google OAuth credentials (if using OAuth)

### Images not displaying
- Check image URLs in network tab
- Verify backend serves static files from `uploads/` directory
- Ensure file upload middleware is configured on backend

### Build errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Update dependencies: `npm update`

## 📱 Responsive Breakpoints

The app uses mobile-first responsive design with Tailwind breakpoints:

- **xs**: 0px (default mobile)
- **sm**: 640px (small tablets)
- **md**: 768px (tablets)
- **lg**: 1024px (small laptops)
- **xl**: 1280px (desktops)
- **2xl**: 1536px (large screens)

## ♿ Accessibility Features

- **WCAG AA Compliant**: Minimum 4.5:1 contrast ratio
- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Full keyboard support
- **Focus States**: Clear focus indicators
- **Touch Targets**: Minimum 44x44px for mobile
- **Screen Reader**: Semantic HTML and ARIA attributes
- **Reduced Motion**: Respects `prefers-reduced-motion`

## 🚀 Performance Optimizations

- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: Lazy loading for images
- **Debouncing**: Search inputs debounced (300ms)
- **Infinite Scroll**: Paginated data loading
- **Optimistic UI**: Instant feedback for user actions
- **Memoization**: React.memo for expensive components

## 🤝 Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push to remote: `git push origin feature/your-feature`
4. Create Pull Request to `main`

### Commit Convention

Follow the conventional commits specification:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 📝 Environment Variables

The app uses Vite's proxy feature, so no frontend environment variables are required. All API calls go through the `/api` proxy to the backend.

If deploying to production, update the backend URL in your deployment configuration.

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Deploy to Server

1. Upload `dist/` directory to your web server
2. Configure web server to serve `index.html` for all routes (SPA)
3. Ensure backend API is accessible from the deployed frontend
4. Update CORS settings on backend to allow frontend domain

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📚 Additional Documentation

- [Design System Guide](../DESIGN-SYSTEM-IMPLEMENTATION.md)
- [Project Plan](../reading-club-project-plan.md)
- [Backend README](../backend/README.md)

## 👥 Team

- **Yaron**: Backend Development
- **Alon**: Frontend Development

## 📄 License

This project is created for educational purposes as part of a university project.

---

**Built with ❤️ using React, TypeScript, and Vite**
