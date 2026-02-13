# Frontend Deployment Guide

This guide covers deploying the Reading Club frontend to a production server.

## Prerequisites

- Node.js (v18+) installed on your local machine
- Access to a Linux server (Ubuntu/Debian recommended)
- Domain name configured to point to your server
- SSH access to the server
- Nginx installed on the server
- SSL certificate (Let's Encrypt recommended)

## Step 1: Prepare Production Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.production.example .env.production
   ```

2. Update `.env.production` with your production API URL:
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_ENV=production
   ```

## Step 2: Build for Production

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Build the production bundle:
   ```bash
   npm run build
   ```

   This creates a `dist/` folder with optimized production files.

3. Test the build locally (optional):
   ```bash
   npm run preview
   ```
   Visit `http://localhost:4173` to verify the build works.

## Step 3: Upload to Server

### Option A: Using SCP

```bash
# From your local machine
scp -r dist/* user@your-server:/var/www/reading-club-frontend/dist/
```

### Option B: Using Git

1. On the server, clone the repository:
   ```bash
   git clone https://github.com/your-username/Reading-Club-App-Yaron_And_Alon.git
   cd Reading-Club-App-Yaron_And_Alon/frontend
   ```

2. Install dependencies and build:
   ```bash
   npm install
   cp .env.production.example .env.production
   # Edit .env.production with your production values
   npm run build
   ```

3. Copy dist folder to web root:
   ```bash
   sudo mkdir -p /var/www/reading-club-frontend
   sudo cp -r dist/* /var/www/reading-club-frontend/dist/
   sudo chown -R www-data:www-data /var/www/reading-club-frontend
   ```

## Step 4: Configure Nginx

1. Copy the example Nginx configuration:
   ```bash
   sudo cp nginx.conf.example /etc/nginx/sites-available/reading-club-frontend
   ```

2. Edit the configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/reading-club-frontend
   ```

3. Update the following:
   - `server_name`: Your domain name
   - `root`: Path to your dist folder
   - SSL certificate paths (if using Let's Encrypt)

4. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/reading-club-frontend /etc/nginx/sites-enabled/
   ```

5. Test Nginx configuration:
   ```bash
   sudo nginx -t
   ```

6. Reload Nginx:
   ```bash
   sudo systemctl reload nginx
   ```

## Step 5: Setup SSL Certificate (Let's Encrypt)

1. Install Certbot:
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d your-frontend-domain.com -d www.your-frontend-domain.com
   ```

3. Certbot will automatically update your Nginx configuration.

4. Test auto-renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## Step 6: Verify Deployment

1. Visit your domain in a browser: `https://your-frontend-domain.com`

2. Check that:
   - ✅ Site loads correctly
   - ✅ HTTPS is working (green lock icon)
   - ✅ API calls work (check browser console)
   - ✅ All routes work (try navigating to different pages)
   - ✅ Images and assets load correctly

3. Test from different devices:
   - Mobile phone
   - Tablet
   - Desktop

## Step 7: Continuous Deployment (Optional)

### Using GitHub Actions

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          source: "frontend/dist/*"
          target: "/var/www/reading-club-frontend/dist/"
```

## Troubleshooting

### Build fails
- Check Node.js version: `node --version` (should be v18+)
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run build` (shows errors)

### 404 errors on routes
- Ensure Nginx `try_files` directive includes `/index.html`
- Check that all routes are handled by React Router

### API calls fail
- Verify `VITE_API_URL` in `.env.production` is correct
- Check CORS settings on backend
- Verify backend is accessible from frontend domain

### SSL certificate issues
- Ensure domain DNS points to server IP
- Check firewall allows ports 80 and 443
- Verify Certbot logs: `sudo certbot certificates`

### Assets not loading
- Check file permissions: `sudo chown -R www-data:www-data /var/www/reading-club-frontend`
- Verify Nginx can read files: `sudo ls -la /var/www/reading-club-frontend/dist`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

## Maintenance

### Updating the Frontend

1. Pull latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. Copy new files:
   ```bash
   sudo cp -r dist/* /var/www/reading-club-frontend/dist/
   ```

### Monitoring

- Check Nginx access logs: `sudo tail -f /var/log/nginx/reading-club-frontend-access.log`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/reading-club-frontend-error.log`
- Monitor server resources: `htop` or `top`

## Security Checklist

- ✅ HTTPS enabled (SSL certificate)
- ✅ Security headers configured in Nginx
- ✅ Environment variables not exposed in client code
- ✅ API URL uses HTTPS in production
- ✅ File permissions set correctly (www-data user)
- ✅ Firewall configured (only ports 80, 443 open)
- ✅ Regular updates: `sudo apt update && sudo apt upgrade`

## Support

For issues or questions:
- Check the main README.md
- Review backend deployment documentation
- Check GitHub issues
