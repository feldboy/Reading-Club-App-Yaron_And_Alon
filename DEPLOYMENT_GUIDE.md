# Deployment Guide: Node.js Backend to College Server

This guide details the steps to deploy your backend application to the college's production server.

**Prerequisites:**
- You must be connected to the **Student VPN** (Check Point Endpoint Security).
- You have your server credentials (IP, username, password).

---

## 1. Connect to the Server

Open your terminal and SSH into the server:
```bash
ssh node15@10.10.246.15
# Enter password: WallaBamba@CS35
```

---

## 2. Prepare the Environment

### Clone the Repository
navigate to the home directory and clone your project:
```bash
cd ~
git clone https://github.com/YourUsername/Reading-Club-App-Yaron_And_Alon.git
# If already cloned, navigate and pull:
# cd Reading-Club-App-Yaron_And_Alon && git pull origin main
```

### Install Dependencies
Navigate to the backend folder and install packages:
```bash
cd Reading-Club-App-Yaron_And_Alon/backend
rm -rf node_modules
npm install
```

### Configure Environment Variables
Create or update the `.env` file with production settings:
```bash
nano .env
```
Ensure the following variables are set:
```env
NODE_ENV=production
PORT=443
# Update your MongoDB connection string if needed (internal IP/port)
MONGO_URI=mongodb://admin:bartar20@CS@localhost:21771/reading-club?authSource=admin
JWT_SECRET=your_jwt_secret
```
*Press `Ctrl+O`, `Enter` to save, and `Ctrl+X` to exit.*

---

## 3. Generate SSL Certificates

Run the helper script to create self-signed certificates:
```bash
chmod +x ./scripts/generate-cert.sh
./scripts/generate-cert.sh
```
*This will create `server.key` and `server.cert` in the backend directory.*

---

## 4. Build the Application

Compile the TypeScript code to JavaScript:
```bash
npm run build
```

---

## 5. Verify the Server (Manual Test)

Before running in the background, test that it starts correctly:
```bash
npm start
```
*You should see "🚀 Secure Server is running (HTTPS)". Press `Ctrl+C` to stop.*

---

## 6. Run with PM2 (Production)

Use PM2 to keep the application running in the background.

### Install PM2 (if not already installed globally)
```bash
npm install -g pm2
```

### Start the Application
```bash
pm2 start ecosystem.config.js
pm2 save
```

### Monitoring
Check the status and logs:
```bash
pm2 status
pm2 logs reading-club-backend
```

---

## 7. Troubleshooting

- **Permissions**: If you get "Permission denied" on port 443, you may need `sudo` or to use a higher port (like 4000) and update `.env` accordingly.
    - *Note: User `node15` has sudo permissions.*
- **Database**: Ensure the MongoDB connection string uses the internal port `21771` as documented.
- **Firewall**: Ensure you are testing from a browser connected to the VPN.

---

## Summary of Ports
- **SSH**: 22
- **HTTPS**: 443 (Your Backend)
- **MongoDB**: 21771
- **PostgreSQL**: 5432
