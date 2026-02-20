# 🚀 Reading Club App — Deployment Guide

## Prerequisites

On the college server (Linux):
```bash
# Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 (Process Manager)
sudo npm install -g pm2

# Nginx (Reverse Proxy)
sudo apt-get install -y nginx

# MongoDB (if not using Atlas)
# See: https://www.mongodb.com/docs/manual/installation/
```

---

## Quick Deploy

### 1. Clone & Build
```bash
git clone <your-repo-url> /var/www/reading-club
cd /var/www/reading-club
bash deploy.sh
```

### 2. Create `.env` File
```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Required environment variables:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/readingclub
JWT_ACCESS_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
FRONTEND_URL=http://your-server-ip
```

### 3. Start with PM2
```bash
cd /var/www/reading-club
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Auto-start on reboot
```

### 4. Configure Nginx
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/reading-club
sudo nano /etc/nginx/sites-available/reading-club
# → Change server_name to your IP/domain
# → Change root path if needed

sudo ln -s /etc/nginx/sites-available/reading-club /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Useful PM2 Commands

| Command | Description |
|---|---|
| `pm2 list` | Show running processes |
| `pm2 logs reading-club-api` | View logs |
| `pm2 restart reading-club-api` | Restart backend |
| `pm2 reload ecosystem.config.js` | Zero-downtime reload |
| `pm2 monit` | Live monitoring |
| `pm2 delete reading-club-api` | Stop and remove |

---

## File Structure (After Deploy)

```
/var/www/reading-club/
├── backend/
│   ├── dist/          ← Compiled JS (server runs from here)
│   ├── node_modules/
│   └── .env           ← Environment variables
├── frontend/
│   └── dist/          ← Static files (served by Nginx)
├── logs/              ← PM2 log files
├── ecosystem.config.js
└── nginx.conf.example
```

---

## Updating

```bash
cd /var/www/reading-club
git pull origin main
bash deploy.sh
# PM2 restarts automatically via deploy.sh
```

---

## Troubleshooting

**Backend not starting:**
```bash
pm2 logs reading-club-api --lines 50
# Check for missing env vars or DB connection issues
```

**Nginx 502 Bad Gateway:**
```bash
# Make sure backend is running
pm2 list
# Check if port 3000 is in use
curl http://localhost:3000/health
```

**Frontend shows blank page:**
```bash
# Verify frontend was built
ls frontend/dist/index.html
# Check Nginx config for correct root path
sudo nginx -t
```

