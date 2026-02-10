# 🧪 Testing Guide - Reading Club App

This guide covers testing for the three main features that need verification:
1. **Phase 3: Google OAuth UI** - End-to-end OAuth flow
2. **Phase 6B: Comments & Likes UI** - Like/unlike, add comment, delete comment
3. **Phase 7B: Google Books API** - Backend API testing with Postman

---

## 📋 Prerequisites

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Server should run on `http://localhost:3000`

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend should run on `http://localhost:5173`

### 3. Ensure MongoDB is Running
- MongoDB should be accessible at the URI in `backend/.env`
- Default: `mongodb://localhost:27017/reading-club`

---

## ✅ Test 1: Backend API Tests (Automated)

### Run All Tests
```bash
cd backend
npm test
```

### Run Specific Test Suites
```bash
# Test comments API
npm test -- comment.test.ts

# Test reviews (likes)
npm test -- review.test.ts

# Test books API
npm test -- books.test.ts
```

### Expected Results
- ✅ All comment tests should pass (add, get, delete)
- ✅ All review like/unlike tests should pass
- ✅ All books API tests should pass

---

## ✅ Test 2: Google OAuth Flow (Manual)

### Steps to Test

1. **Open the app** in browser: `http://localhost:5173`

2. **Navigate to Login Page**
   - Click "Login" in navbar or go to `/login`

3. **Click "Sign in with Google" button**
   - Should redirect to Google OAuth consent screen

4. **Select Google Account**
   - Choose an account or enter credentials

5. **Grant Permissions**
   - Click "Allow" to grant access

6. **Verify Callback**
   - Should redirect to `/auth/callback`
   - Should show "Completing authentication..." briefly
   - Should redirect to home page (`/`)

7. **Verify Login State**
   - Navbar should show user info (username/profile image)
   - Should be able to access protected routes
   - Logout button should be visible

8. **Test Logout**
   - Click logout
   - Should clear session and redirect to login

### Expected Behavior
- ✅ Smooth redirect to Google
- ✅ Successful callback with tokens
- ✅ User logged in after OAuth
- ✅ Can access protected routes
- ✅ Logout works correctly

### Troubleshooting
- **If OAuth button doesn't work**: Check backend `.env` has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- **If callback fails**: Check backend logs for errors
- **If redirect fails**: Verify `FRONTEND_URL` in backend `.env` matches frontend URL

---

## ✅ Test 3: Comments & Likes UI (Manual)

### Prerequisites
- Must be logged in (use regular login or OAuth)
- Need at least one review in the database (create via API or UI if available)

### Test Likes

1. **Navigate to a Review**
   - Go to a review detail page (if available)
   - Or use a review card with like button

2. **Test Like Button**
   - Click the like button (heart icon)
   - **Expected**: Heart should fill (❤️), count should increment
   - Button should show loading state briefly

3. **Test Unlike**
   - Click the like button again
   - **Expected**: Heart should unfill (🤍), count should decrement

4. **Test Without Login**
   - Logout
   - Try to like a review
   - **Expected**: Should show alert "Please login to like reviews"

### Test Comments

1. **Navigate to Review Detail Page**
   - Go to `/reviews/:id` (replace `:id` with actual review ID)

2. **View Comments**
   - Comments should load automatically
   - Should display: user avatar, username, comment text, timestamp
   - Should show "No comments yet" if empty

3. **Add a Comment**
   - Type in comment textarea
   - Character counter should show (e.g., "50/1000")
   - Click "Post Comment" or press Enter
   - **Expected**: 
     - Comment appears in list immediately
     - Textarea clears
     - Comment count increments
     - Shows your username and avatar

4. **Delete Own Comment**
   - Find a comment you created
   - Click delete button (trash icon)
   - **Expected**: Comment disappears, count decrements

5. **Test Validation**
   - Try submitting empty comment
   - **Expected**: Error message "Comment cannot be empty"
   - Try submitting comment > 1000 characters
   - **Expected**: Error message "Comment cannot exceed 1000 characters"

6. **Test Without Login**
   - Logout
   - Try to add comment
   - **Expected**: Should require login (redirect or show error)

### Expected Behavior
- ✅ Like button toggles correctly
- ✅ Like count updates in real-time
- ✅ Comments load and display correctly
- ✅ Can add new comments
- ✅ Can delete own comments
- ✅ Cannot delete others' comments
- ✅ Validation works (empty, too long)
- ✅ Requires authentication

---

## ✅ Test 4: Google Books API (Postman)

### Setup Postman

1. **Create a Collection**: "Reading Club - Books API"

2. **Set Environment Variables**:
   - `base_url`: `http://localhost:3000/api`
   - `access_token`: (will be set after login)

### Test Authentication First

1. **Login to Get Token**
   ```
   POST {{base_url}}/auth/login
   Body (JSON):
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Copy `accessToken` from response
   - Set `access_token` in environment

2. **Set Authorization Header**:
   - Type: Bearer Token
   - Token: `{{access_token}}`

### Test Books API Endpoints

#### 1. Search Books
```
GET {{base_url}}/books/search?q=harry+potter
Headers:
  Authorization: Bearer {{access_token}}
```

**Expected Response**:
```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": "...",
        "title": "Harry Potter and the Philosopher's Stone",
        "authors": ["J.K. Rowling"],
        "description": "...",
        "imageLinks": {...},
        "publishedDate": "1997",
        ...
      }
    ],
    "totalItems": 1000,
    "currentPage": 1,
    "totalPages": 100
  }
}
```

**Test Cases**:
- ✅ Search with query parameter
- ✅ Returns array of books
- ✅ Includes pagination info
- ✅ Books have required fields (title, authors, etc.)

#### 2. Get Book Details
```
GET {{base_url}}/books/{{book_id}}
Headers:
  Authorization: Bearer {{access_token}}
```

**Expected Response**:
```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "...",
      "title": "...",
      "authors": [...],
      "description": "...",
      "imageLinks": {...},
      "industryIdentifiers": [...],
      ...
    }
  }
}
```

**Test Cases**:
- ✅ Returns single book details
- ✅ Includes all book information
- ✅ Returns 404 for invalid book ID

#### 3. Search by Genre (Bonus)
```
GET {{base_url}}/books/genre/science+fiction
Headers:
  Authorization: Bearer {{access_token}}
```

**Test Cases**:
- ✅ Returns books in specified genre
- ✅ Handles genre names with spaces (URL encoded)

### Test Caching

1. **First Request**: Should hit Google Books API
   - Check backend logs for API call

2. **Second Request (within 5 minutes)**: Should return cached result
   - Should be faster
   - Check backend logs - should NOT call Google Books API again

3. **After 5 minutes**: Should fetch fresh data
   - Cache should expire

### Test Rate Limiting

1. **Make 40 requests quickly** (within 1 minute)
   - First 40 should succeed

2. **41st request**:
   - **Expected**: Should return 429 (Too Many Requests) or rate limit error
   - Error message should indicate rate limit exceeded

### Test Error Handling

1. **Invalid Book ID**:
   ```
   GET {{base_url}}/books/invalid_id
   ```
   - **Expected**: 404 Not Found

2. **Missing Query Parameter**:
   ```
   GET {{base_url}}/books/search
   ```
   - **Expected**: 400 Bad Request (missing `q` parameter)

3. **Without Authentication**:
   - Remove Authorization header
   - **Expected**: 401 Unauthorized

---

## 📊 Test Results Checklist

### Phase 3: Google OAuth UI
- [ ] OAuth button redirects to Google
- [ ] Google consent screen appears
- [ ] Callback receives tokens
- [ ] User is logged in after OAuth
- [ ] Can access protected routes
- [ ] Logout works

### Phase 6B: Comments & Likes UI
- [ ] Like button toggles correctly
- [ ] Like count updates
- [ ] Comments load on review page
- [ ] Can add new comment
- [ ] Can delete own comment
- [ ] Cannot delete others' comments
- [ ] Validation works (empty, length)
- [ ] Requires authentication

### Phase 7B: Google Books API
- [ ] Search books endpoint works
- [ ] Get book details endpoint works
- [ ] Search by genre works (if implemented)
- [ ] Caching works (5 min TTL)
- [ ] Rate limiting works (40 req/min)
- [ ] Error handling works (404, 400, 401)
- [ ] All endpoints require authentication

---

## 🐛 Common Issues & Solutions

### Issue: OAuth redirect fails
**Solution**: Check `FRONTEND_URL` in backend `.env` matches frontend URL

### Issue: Comments/Likes don't update
**Solution**: Check browser console for errors, verify API endpoints are correct

### Issue: Books API returns 401
**Solution**: Ensure Authorization header is set with valid token

### Issue: Rate limit errors
**Solution**: Wait 1 minute, or check rate limit implementation

### Issue: Tests fail
**Solution**: Ensure MongoDB is running and test database is accessible

---

## 📝 Notes

- All tests should be performed in a clean environment
- Use test accounts, not production data
- Document any bugs found during testing
- Update this guide if new test cases are discovered

---

**Happy Testing! 🚀**
