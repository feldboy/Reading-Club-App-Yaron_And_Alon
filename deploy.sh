#!/bin/bash

# Reading Club App Deployment Script
# This script builds both the backend and frontend for production.

echo "🚀 Starting Deployment Process for Reading Club App..."

# Set script to exit immediately if any command fails
set -e

# ==========================================
# 1. Build Backend
# ==========================================
echo "📦 Building Backend..."
cd backend

echo "Installing backend dependencies..."
npm install --omit=dev  # Install production dependencies only if package has run scripts? 
# Usually we need dev dependencies to build TypeScript
npm install

echo "Compiling TypeScript..."
npm run build

echo "✅ Backend build complete."
cd ..

# ==========================================
# 2. Build Frontend
# ==========================================
echo "📦 Building Frontend..."
cd frontend

echo "Installing frontend dependencies..."
npm install

echo "Building React App via Vite..."
npm run build

echo "✅ Frontend build complete."
cd ..

# ==========================================
# 3. Post Summary
# ==========================================
echo "🎉 Build process finished successfully!"
echo ""
echo "Next Steps to deploy on the server:"
echo "1. Verify your backend .env file is set properly (DB_URI, JWT_SECRET, GEMINI_API_KEY)."
echo "2. Start the backend with PM2:"
echo "   pm2 start ecosystem.config.js --env production"
echo "3. Copy nginx.conf.example to your Nginx sites-available and reload Nginx."
echo "   sudo systemctl reload nginx"
