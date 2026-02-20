# Reading Club App - Deployment & Context State

This file serves as a context memory for AI assistants to understand the current architecture, deployment state, and recent fixes applied to the project. Give this to any future AI to get them up to speed immediately.

## 🌍 Environment Details
- **Server:** College Ubuntu Server (`node15.cs.colman.ac.il` / `10.10.246.15`). SSH user is `node15`.
- **Project Path:** `/home/node15/reading-club`
- **Frontend Stack:** React, Vite, TailwindCSS (served via Nginx).
- **Backend Stack:** Node.js, Express, MongoDB, PM2 (runs on `127.0.0.1:3000`).

## 🛠️ Architecture & Nginx Configuration
- **Nginx** handles all incoming traffic on port 80.
- **Frontend Hosting:** Nginx directly serves the built React files from `/home/node15/reading-club/frontend/dist`. It uses `try_files $uri $uri/ /index.html;` to support React Router.
- **Backend Proxying:** Nginx proxies any request starting with `/api/` or `/uploads/` to the PM2 backend running locally at `http://127.0.0.1:3000`.

## 🐛 Recent Major Fixes Applied

### 1. Removing Hardcoded `localhost` in Frontend
**The Problem:** The app was trying to fetch images and make API calls to `http://localhost:3000` when deployed, causing Cross-Origin/Connection issues on production.
**The Fix:**
- Updated **`frontend/src/services/api.ts`** to use a relative path `/api/` in production and `http://localhost:3000/api` during local development (using `import.meta.env.DEV`).
- Created **`frontend/src/utils/imageUtils.ts`** with `resolveInternalImageUrl()` to handle environment-aware book uploads and profile image paths.
- Fixed **`GoogleLoginButton.tsx`**, **`LoginPage.tsx`**, and **`RegisterPage.tsx`** to dynamically point to the correct Google OAuth endpoint based on the environment instead of hardcoding localhost.

### 2. Fixing Backend Port for Google OAuth
**The Problem:** The backend `.env` variables (`FRONTEND_URL` and `GOOGLE_CALLBACK_URL`) mistakenly had port `:4000` appended to them. But since Nginx runs on port 80, users were redirected to a dead port after logging in.
**The Fix:**
- Removed `:4000` from the `.env` on the server.
- The `GOOGLE_CALLBACK_URL` is now correctly set to `http://node15.cs.colman.ac.il/api/auth/google/callback`.
- *Note for Developer:* If a `redirect_uri_mismatch` error occurs on Google login, the exact URI above (`http://node15.cs.colman.ac.il/api/auth/google/callback`) MUST be added to the Google Cloud Console "Authorized redirect URIs" list.

### 3. Fixing Nginx 403 Forbidden Errors (Permissions)
**The Problem:** Nginx (running as user `www-data`) could not read the Vite build folder (`frontend/dist`) because it was generated under the `node15` user without group read/execute permissions.
**The Fix:**
- Ran `chmod -R o+rx /home/node15/reading-club/frontend/dist` to allow Nginx to read the bundled files and `index.html`. 
- *(Note: You may need to re-run this command after a new build if permissions reset).*

## 🚀 How to Deploy Updates in the Future
When changes are pushed to GitHub, do the following on the server:

1. **Pull Code:** `git pull origin <branch>`
2. **Build Backend:** `cd backend && npm install && npm run build`
3. **Restart Backend:** `pm2 restart reading-club-api --update-env`
4. **Build Frontend:** `cd frontend && npm install && npm run build`
5. **Fix Permissions:** `chmod -R o+rx /home/node15/reading-club/frontend/dist`

---
*Last updated: Feb 20, 2026*
