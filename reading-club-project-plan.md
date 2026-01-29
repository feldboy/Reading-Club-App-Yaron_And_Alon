# 📚 Reading Club App - Git Workflow & Developer Tasks

## 🌳 Git Branch Strategy

### Branch Structure
```
main (production)
  ↓
develop (integration)
  ↓
  ├── yaron/backend-setup
  ├── yaron/auth-api
  ├── yaron/user-api
  ├── yaron/reviews-api
  ├── yaron/ai-integration
  ├── yaron/testing-docs
  ├── yaron/deployment
  ├── alon/frontend-setup  
  ├── alon/auth-pages
  ├── alon/profile-pages
  ├── alon/review-components
  ├── alon/comments-likes-api
  ├── alon/comments-likes-ui
  ├── alon/ai-ui
  ├── alon/google-books-api
  └── alon/ui-polish
```

### Workflow Rules

1. **Never commit to `main` directly**
2. **All work branches from `develop`**
3. **Branch naming:** `<name>/<feature-description>`
4. **Small commits** - one logical change per commit
5. **Pull Request required** for all merges to `develop`
6. **Code review** by the other developer before merge
7. **Merge to `main`** only after full testing on `develop`

### Git Commands Quick Reference

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b <name>/<feature>

# Work on feature - make small commits
git add <files>
git commit -m "type: description"  # types: feat, fix, docs, test, refactor

# Push and create PR
git push origin <name>/<feature>
# Go to GitHub → Create Pull Request → Request review

# Update your branch with latest develop
git checkout develop
git pull origin develop
git checkout <name>/<feature>
git merge develop
# Resolve any conflicts
git push origin <name>/<feature>

# After PR approved and merged
git checkout develop
git pull origin develop
git branch -d <name>/<feature>  # Delete local branch
```

---

## 👨‍💻 Yaron - Detailed Task List

### Phase 1: Backend Setup (Week 1)
**Branch:** `yaron/backend-setup`

- [ ] Initialize project: `npm init -y`
- [ ] Install dependencies:
  ```bash
  npm install express mongoose typescript ts-node @types/node @types/express
  npm install -D nodemon @types/mongoose
  ```
- [ ] Create `tsconfig.json`
- [ ] Setup folder structure (src/controllers, models, routes, etc.)
- [ ] Create `src/app.ts` - Express app setup
- [ ] Create `src/server.ts` - Server entry point
- [ ] Create `src/config/db.ts` - MongoDB connection
- [ ] Test: `npm run dev` - server starts
- [ ] **Commit & Push:** Create PR to `develop`
- [ ] **Review:** Wait for Alon's review → Merge

### Phase 2: Authentication API (Week 1-2)
**Branch:** `yaron/auth-api`

**Start AFTER** Phase 1 merged

- [ ] Pull latest `develop`: `git checkout develop && git pull`
- [ ] Create branch: `git checkout -b yaron/auth-api`
- [ ] Install: `bcrypt`, `jsonwebtoken`, `@types/bcrypt`, `@types/jsonwebtoken`
- [ ] Create `src/models/User.model.ts`:
  - Schema: username, email, password, authProvider, googleId, profileImage, refreshToken
  - Pre-save hook for password hashing
- [ ] Create `src/services/auth.service.ts`:
  - `register(username, email, password)`
  - `login(email, password)`
- [ ] Create `src/services/token.service.ts`:
  - `generateAccessToken(userId)`
  - `generateRefreshToken(userId)`
  - `verifyRefreshToken(token)`
- [ ] Create `src/controllers/auth.controller.ts`:
  - `register` - POST body validation, call service, return tokens
  - `login` - validate, call service, return tokens
  - `logout` - clear refresh token
  - `refresh` - verify refresh token, issue new access token
- [ ] Create `src/middleware/auth.middleware.ts`:
  - `verifyAccessToken` - check JWT, attach user to req
- [ ] Create `src/routes/auth.routes.ts`:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout
  - POST /api/auth/refresh
- [ ] Mount routes in `app.ts`
- [ ] Install Jest, Supertest: `npm install -D jest @types/jest ts-jest supertest @types/supertest`
- [ ] Create `jest.config.js`
- [ ] Create `tests/auth.test.ts`:
  - Test register (success, duplicate user)
  - Test login (success, wrong password)
  - Test refresh token flow
- [ ] Run tests: `npm test` - ensure all pass
- [ ] Install Swagger: `npm install swagger-jsdoc swagger-ui-express @types/swagger-ui-express`
- [ ] Create `src/config/swagger.ts` - basic setup
- [ ] Document auth endpoints with JSDoc comments
- [ ] Test Swagger UI: `http://localhost:3000/api-docs`
- [ ] **Commit incrementally:** `git commit -m "feat: add user model"`, etc.
- [ ] **Push:** `git push origin yaron/auth-api`
- [ ] **Create PR:** `yaron/auth-api` → `develop`
- [ ] **Request review** from Alon
- [ ] **Fix review comments** if any
- [ ] **Merge after approval**

### Phase 3: Google OAuth (Week 2)
**Branch:** `yaron/google-oauth`

- [ ] Install: `passport`, `passport-google-oauth20`, `@types/passport`
- [ ] Get Google OAuth credentials (Client ID, Secret)
- [ ] Create `src/config/passport.ts`:
  - Configure GoogleStrategy
  - Serialize/deserialize user
- [ ] Update `auth.controller.ts`:
  - Add `googleAuth` - redirect to Google
  - Add `googleCallback` - handle callback, create/login user, return tokens
- [ ] Add routes:
  - GET /api/auth/google
  - GET /api/auth/google/callback
- [ ] Test OAuth flow manually
- [ ] Update Swagger
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 4: User Profile API (Week 2)
**Branch:** `yaron/user-api`

- [ ] Install: `multer`, `@types/multer`
- [ ] Create `src/middleware/upload.middleware.ts`:
  - Configure Multer for image uploads
  - Validate file type (jpg, png) and size (<5MB)
- [ ] Create `src/controllers/user.controller.ts`:
  - `getProfile(userId)` - return user + profile image
  - `updateProfile(userId, username, profileImage)` - update user
  - `uploadImage` - handle file upload
- [ ] Create routes:
  - GET /api/users/:id
  - PUT /api/users/:id (protected)
  - POST /api/upload (protected)
- [ ] Ensure `uploads/profiles/` folder exists
- [ ] Test with Postman
- [ ] Create `tests/user.test.ts`
- [ ] Document in Swagger
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 5: Reviews API (Week 3)
**Branch:** `yaron/reviews-api`

- [ ] Create `src/models/Review.model.ts`:
  - Fields: userId, bookTitle, bookAuthor, bookImage, bookISBN, rating, reviewText, googleBookId, likes[], likesCount, commentsCount
  - Indexes on userId, createdAt
- [ ] Create `src/controllers/review.controller.ts`:
  - `createReview` - validate, upload image, save
  - `getAllReviews` - pagination (page, limit), populate user
  - `getReviewById` - single review with user details
  - `updateReview` - only if userId matches
  - `deleteReview` - only if userId matches
  - `getUserReviews` - filter by userId
- [ ] Pagination logic:
  - Accept query params: `?page=1&limit=10`
  - Return: `{ reviews, currentPage, totalPages, totalReviews }`
- [ ] Create routes:
  - POST /api/reviews (protected)
  - GET /api/reviews?page=1&limit=10
  - GET /api/reviews/:id
  - PUT /api/reviews/:id (protected)
  - DELETE /api/reviews/:id (protected)
  - GET /api/users/:userId/reviews
- [ ] Ensure `uploads/reviews/` folder exists
- [ ] Comprehensive tests in `tests/review.test.ts`:
  - Create, get, update, delete
  - Pagination
  - Authorization (can't edit others' reviews)
- [ ] Swagger documentation
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 6: AI Integration (Week 3-4)
**Branch:** `yaron/ai-integration`

- [ ] Get Gemini API key from Google AI Studio
- [ ] Install: `@google/generative-ai` (or axios for REST calls)
- [ ] Install: `express-rate-limit` for rate limiting
- [ ] Create `src/services/ai.service.ts`:
  - Initialize Gemini client
  - `searchBooks(query)` - send query to AI, parse response
  - `getRecommendations(preferences)` - send preferences, return books
  - Rate limiting wrapper (max 50 req/min)
- [ ] Create `src/controllers/ai.controller.ts`:
  - `search` - POST body: { query }
  - `recommend` - POST body: { preferences }
- [ ] Create `src/middleware/rateLimit.middleware.ts`:
  - Rate limit AI endpoints
- [ ] Create routes:
  - POST /api/ai/search (protected)
  - POST /api/ai/recommend (protected)
- [ ] Test with various queries
- [ ] Handle errors gracefully (API limits, network errors)
- [ ] Create `tests/ai.test.ts` (mock AI responses)
- [ ] Swagger docs
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 7: Testing & Documentation (Week 5)
**Branch:** `yaron/testing-docs`

- [ ] Review all tests - ensure they pass
- [ ] Improve test coverage to >80%
- [ ] Add edge case tests (invalid inputs, auth failures)
- [ ] Complete Swagger documentation:
  - All endpoints documented
  - Request/response examples
  - Error codes explained
- [ ] Create `backend/README.md`:
  - Installation instructions
  - Environment variables setup
  - How to run tests
  - API documentation link
- [ ] Code cleanup:
  - Remove console.logs
  - Consistent error handling
  - Code comments where necessary
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 8: Deployment (Week 5-6)
**Branch:** `yaron/deployment`

- [ ] Create `ecosystem.config.js` for PM2:
  ```js
  module.exports = {
    apps: [{
      name: 'reading-club-api',
      script: './dist/server.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }]
  };
  ```
- [ ] Setup MongoDB on college server:
  - Create database: `reading-club`
  - Create user with password
  - Test connection
- [ ] Create production `.env`:
  - Update MongoDB URI
  - Update JWT secrets (generate new ones)
  - Update CORS origin to frontend URL
- [ ] Build TypeScript: `npm run build`
- [ ] Upload to server (scp or git clone)
- [ ] Install dependencies on server: `npm install --production`
- [ ] Setup Nginx reverse proxy:
  - Proxy `/api` to `localhost:3000`
- [ ] Setup SSL with Let's Encrypt:
  - `sudo certbot --nginx -d yourdomain.com`
- [ ] Start with PM2: `pm2 start ecosystem.config.js`
- [ ] Test all endpoints with HTTPS
- [ ] Verify PM2 restart on reboot: `pm2 startup` and `pm2 save`
- [ ] Create deployment documentation
- [ ] **Commit & Push → PR → Review → Merge to develop**
- [ ] **Merge develop → main**

---

## 👨‍💻 Alon - Detailed Task List

### Phase 1: Frontend Setup (Week 1)
**Branch:** `alon/frontend-setup`

- [ ] Initialize React app:
  ```bash
  npm create vite@latest frontend -- --template react-ts
  cd frontend
  npm install
  ```
- [ ] Install dependencies:
  ```bash
  npm install react-router-dom axios
  npm install -D @types/react-router-dom
  ```
- [ ] Setup folder structure (src/components, pages, context, services, etc.)
- [ ] Create `src/routes.tsx` - basic route definitions
- [ ] Create `src/services/api.ts`:
  - Axios instance with `baseURL = http://localhost:3000/api`
  - Request interceptor to add JWT token
  - Response interceptor for error handling
- [ ] Create `src/context/AuthContext.tsx` (skeleton):
  - State: user, isAuthenticated, loading
  - Functions: login, logout, register (placeholders)
- [ ] Create `src/components/layout/Navbar.tsx`:
  - Logo, navigation links
  - Login/Logout button (conditional)
- [ ] Create `src/components/layout/Footer.tsx`
- [ ] Create `src/App.tsx`:
  - AuthContext provider
  - Router setup
- [ ] Test: `npm run dev` - app runs
- [ ] **Commit & Push → PR → Review by Yaron → Merge**

### Phase 2: Authentication Pages (Week 1-2)
**Branch:** `alon/auth-pages`

**Start AFTER** Yaron's `yaron/auth-api` is merged

- [ ] Pull latest `develop`
- [ ] Create branch: `git checkout -b alon/auth-pages`
- [ ] Create `src/services/auth.api.ts`:
  - `register(username, email, password)` - POST /api/auth/register
  - `login(email, password)` - POST /api/auth/login
  - `logout()` - POST /api/auth/logout
  - `refreshToken()` - POST /api/auth/refresh
- [ ] Complete `src/context/AuthContext.tsx`:
  - Implement login, register, logout
  - Store tokens in localStorage
  - Auto-refresh logic (before token expires)
  - Load user on mount (from token)
- [ ] Create `src/components/auth/LoginForm.tsx`:
  - Email and password inputs
  - Form validation
  - Submit → call authApi.login → update context
  - Error display
- [ ] Create `src/components/auth/RegisterForm.tsx`:
  - Username, email, password inputs
  - Validation (password strength, email format)
  - Submit → call authApi.register → redirect to login
- [ ] Create `src/pages/LoginPage.tsx`:
  - Use LoginForm component
  - Link to RegisterPage
- [ ] Create `src/pages/RegisterPage.tsx`:
  - Use RegisterForm component
  - Link to LoginPage
- [ ] Create protected route wrapper in `routes.tsx`:
  - Redirect to /login if not authenticated
- [ ] Update `Navbar.tsx`:
  - Show user info when logged in
  - Logout button
- [ ] Test full flow: register → login → see navbar update → logout
- [ ] **Commit incrementally → Push → PR → Review → Merge**

### Phase 3: Google OAuth UI (Week 2)
**Branch:** `alon/google-oauth-ui`

- [ ] Create `src/components/auth/GoogleLoginButton.tsx`:
  - Button with Google logo
  - onClick → redirect to `http://localhost:3000/api/auth/google`
- [ ] Handle OAuth callback:
  - Backend redirects to frontend with token in query/hash
  - Parse token, store in localStorage
  - Update AuthContext
- [ ] Add Google button to LoginPage and RegisterPage
- [ ] Test OAuth flow end-to-end
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 4: User Profile Pages (Week 2)
**Branch:** `alon/profile-pages`

**Start AFTER** Yaron's `yaron/user-api` is merged

- [ ] Create `src/services/user.api.ts`:
  - `getProfile(userId)`
  - `updateProfile(userId, data)`
  - `uploadImage(file)` - POST /api/upload
- [ ] Create `src/components/user/UserProfile.tsx`:
  - Display: profile image, username, email
  - Button to edit profile
  - List of user's reviews
- [ ] Create `src/components/user/EditProfile.tsx`:
  - Form: username input, image upload
  - Preview image before upload
  - FormData for file submission
  - Submit → call user.api.updateProfile
- [ ] Create `src/components/user/UserReviews.tsx`:
  - Fetch user's reviews
  - Display in grid/list
- [ ] Create `src/pages/ProfilePage.tsx`:
  - Use UserProfile component
- [ ] Create `src/pages/EditProfilePage.tsx`:
  - Use EditProfile component
- [ ] Update routes
- [ ] Test: edit profile, upload image, see changes persist
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 5: Review Components & Feed (Week 3)
**Branch:** `alon/review-components`

**Start AFTER** Yaron's `yaron/reviews-api` is merged

- [ ] Create `src/services/review.api.ts`:
  - `getAllReviews(page, limit)`
  - `getReviewById(id)`
  - `createReview(data)`
  - `updateReview(id, data)`
  - `deleteReview(id)`
  - `getUserReviews(userId)`
- [ ] Create `src/types/review.ts`:
  - TypeScript interfaces for Review
- [ ] Create `src/components/review/ReviewCard.tsx`:
  - Display: book image, title, author, rating, review text
  - Show: user avatar, username
  - Show: likes count, comments count
  - Buttons: like (placeholder), view comments
  - Edit/Delete buttons (if own review)
- [ ] Create `src/components/review/ReviewForm.tsx`:
  - Inputs: book title, author, rating (1-5 stars), review text
  - Image upload for book cover
  - Submit → createReview or updateReview
- [ ] Create `src/hooks/useInfiniteScroll.ts`:
  - Detect scroll to bottom
  - Trigger callback to load more
- [ ] Create `src/components/review/ReviewFeed.tsx`:
  - Fetch reviews on mount (page 1)
  - Use useInfiniteScroll hook
  - When scroll to bottom → fetch next page
  - Append to reviews list
  - Show loading spinner while fetching
- [ ] Create `src/pages/HomePage.tsx`:
  - Use ReviewFeed component
  - Clean, centered layout
- [ ] Create `src/pages/CreateReviewPage.tsx`:
  - Use ReviewForm in create mode
  - After submit → redirect to home
- [ ] Create `src/pages/ReviewDetailPage.tsx` (skeleton):
  - Show single review (detailed view)
  - Placeholder for comments section
- [ ] Update routes
- [ ] Test: create review, see in feed, scroll to load more, edit, delete
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 6A: Comments & Likes API (Week 3-4)
**Branch:** `alon/comments-likes-api`

*Backend work by Alon*

- [ ] Create `src/models/Comment.model.ts`:
  - Fields: reviewId, userId, text, createdAt
- [ ] Create `src/controllers/comment.controller.ts`:
  - `addComment(reviewId, userId, text)` - create comment, increment review.commentsCount
  - `getComments(reviewId)` - fetch all, populate user
  - `deleteComment(commentId, userId)` - only if own comment, decrement commentsCount
- [ ] Create routes in `src/routes/comment.routes.ts`:
  - POST /api/reviews/:reviewId/comments (protected)
  - GET /api/reviews/:reviewId/comments
  - DELETE /api/comments/:commentId (protected)
- [ ] Update `src/controllers/review.controller.ts`:
  - Add `likeReview(reviewId, userId)`:
    - Add userId to likes array (if not exists)
    - Increment likesCount
  - Add `unlikeReview(reviewId, userId)`:
    - Remove userId from likes array
    - Decrement likesCount
- [ ] Add routes:
  - POST /api/reviews/:id/like (protected)
  - DELETE /api/reviews/:id/like (protected)
- [ ] Create tests:
  - `tests/comment.test.ts` - add, get, delete
  - Update `tests/review.test.ts` - test like/unlike
- [ ] Update Swagger
- [ ] **Commit & Push → PR → Review by Yaron → Merge**

### Phase 6B: Comments & Likes UI (Week 4)
**Branch:** `alon/comments-likes-ui`

**Start AFTER** Phase 6A merged

- [ ] Create `src/services/comment.api.ts`:
  - `addComment(reviewId, text)`
  - `getComments(reviewId)`
  - `deleteComment(commentId)`
- [ ] Update `src/services/review.api.ts`:
  - `likeReview(reviewId)`
  - `unlikeReview(reviewId)`
- [ ] Create `src/components/comment/CommentItem.tsx`:
  - Display: user avatar, username, comment text, timestamp
  - Delete button (if own comment)
- [ ] Create `src/components/comment/CommentList.tsx`:
  - Fetch comments for a review
  - Map to CommentItem components
- [ ] Create `src/components/comment/CommentForm.tsx`:
  - Text input
  - Submit button
  - Call addComment API
- [ ] Create `src/components/review/LikeButton.tsx`:
  - Heart icon
  - Show like count
  - Toggle liked state (fill/unfill heart)
  - onClick → like or unlike API
- [ ] Update `ReviewCard.tsx`:
  - Integrate LikeButton
  - Link to ReviewDetailPage for comments
- [ ] Complete `ReviewDetailPage.tsx`:
  - Show full review
  - LikeButton
  - CommentList
  - CommentForm
- [ ] Test: like/unlike, add comment, delete comment
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 7A: AI Features UI (Week 4)
**Branch:** `alon/ai-ui`

**Can start in parallel with Phase 6 or after Yaron's `yaron/ai-integration`**

- [ ] Create `src/services/ai.api.ts`:
  - `searchBooks(query)`
  - `getRecommendations(preferences)`
- [ ] Install: `npm install lodash.debounce @types/lodash.debounce` (for debounce)
- [ ] Create `src/hooks/useDebounce.ts`:
  - Debounce hook for search input
- [ ] Create `src/components/ai/AISearchBar.tsx`:
  - Search input
  - Use useDebounce hook (500ms)
  - On input change → call ai.api.searchBooks
  - Display results in dropdown or modal
- [ ] Create `src/components/ai/BookRecommendations.tsx`:
  - Button: "Get Recommendations"
  - onClick → call ai.api.getRecommendations
  - Display results as cards
- [ ] Integrate AISearchBar into Navbar or HomePage
- [ ] Loading states, error handling (API rate limits)
- [ ] Test AI features
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 7B: Google Books API (Week 4)
**Branch:** `alon/google-books-api`

*Backend work by Alon*

- [ ] Get Google Books API key
- [ ] Create `src/services/googleBooks.service.ts`:
  - `searchBooks(title)` - call Google Books API
  - `getBookDetails(bookId)` - fetch details
- [ ] Create `src/controllers/books.controller.ts`:
  - `search` - query param: q
  - `getDetails` - param: bookId
- [ ] Create routes in `src/routes/books.routes.ts`:
  - GET /api/books/search?q=title
  - GET /api/books/:id
- [ ] Test with Postman
- [ ] Document in Swagger
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 7C: Google Books Integration UI (Week 4)
**Branch:** `alon/books-integration-ui`

- [ ] Create `src/services/books.api.ts`:
  - `searchBooks(query)`
  - `getBookDetails(id)`
- [ ] Update `ReviewForm.tsx`:
  - Add "Search Book" feature
  - User types book title → call books.api.searchBooks
  - Show results in dropdown
  - On select → auto-fill: title, author, image, ISBN
- [ ] Test: search book, select, create review with pre-filled data
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 8: UI Polish & Responsive Design (Week 5)
**Branch:** `alon/ui-polish`

- [ ] Design System:
  - Define color palette (primary, secondary, neutral)
  - Typography (fonts, sizes, weights)
  - Spacing system (margins, paddings)
- [ ] Install UI library (optional): `npm install @mui/material @emotion/react @emotion/styled`
  - OR use custom CSS/Styled-components
- [ ] Style all components:
  - Consistent button styles
  - Card components for reviews
  - Form inputs
- [ ] Responsive design:
  - Mobile: stack elements vertically
  - Tablet: adjust grid layouts
  - Desktop: full layout
- [ ] Loading states:
  - Skeleton loaders for feed
  - Spinners for buttons during async operations
- [ ] Error handling:
  - Create ErrorBoundary component
  - User-friendly error messages
  - Toast notifications (optional: `npm install react-toastify`)
- [ ] Accessibility:
  - Alt text for images
  - ARIA labels
  - Keyboard navigation
- [ ] Create `frontend/README.md`:
  - Installation instructions
  - Environment setup
  - How to run
- [ ] **Commit & Push → PR → Review → Merge**

### Phase 9: Frontend Deployment (Week 5-6)
**Branch:** `alon/frontend-deployment`

- [ ] Create production `.env`:
  - Update API URL to HTTPS backend URL
- [ ] Build for production: `npm run build`
- [ ] Test build locally: `npm install -g serve && serve -s dist`
- [ ] Upload to college server (scp or git clone)
- [ ] Setup Nginx for frontend:
  - Serve static files from `dist/`
  - Configure routing (all routes → index.html for SPA)
- [ ] Setup SSL for frontend domain
- [ ] Test: access app via domain, all features work
- [ ] Ensure domain works without VPN
- [ ] Create deployment documentation
- [ ] **Commit & Push → PR → Review → Merge to develop**
- [ ] **Merge develop → main**

---

## 🎬 Final Steps (Both Developers)

### Video Creation (Week 6)

**Script:**
1. **Intro (30 sec):** "Welcome to Reading Club App demo"
2. **Features (5 min):**
   - Register/Login (show both methods)
   - Create a review with image
   - Like a review
   - Comment on a review
   - AI search for books
   - Edit profile
3. **Technical (3 min):**
   - Show Swagger docs (all endpoints)
   - Run Jest tests (`npm test`) - show passing
   - Show PM2 status (`pm2 status`)
   - Show production mode (`echo $NODE_ENV`)
4. **Outro (30 sec):** Thank you, GitHub link, URL

**Tools:** OBS Studio, QuickTime, Loom

### Submission (Week 6)

- [ ] Create submission document:
  - Student IDs
  - GitHub repo URL (ensure public)
  - Video URL (YouTube unlisted or Google Drive)
  - App URL (domain)
- [ ] Final checklist review
- [ ] Submit to university portal
- [ ] **Celebrate! 🎉**

---

## 📞 Communication Plan

- **Daily:** Quick WhatsApp check-in (5 min)
- **Weekly:** Video call sync (30 min) to discuss progress, blockers
- **GitHub:** Use PR comments for code review feedback
- **Decisions:** Document major decisions in shared Google Doc

---

**Good luck! 💪 Let's build something amazing!**
