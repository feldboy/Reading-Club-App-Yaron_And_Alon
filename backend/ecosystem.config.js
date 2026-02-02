module.exports = {
    apps: [{
        name: "reading-club-backend",
        script: "./dist/server.js",
        env: {
            NODE_ENV: "development",
            PORT: 3000
        },
        env_production: {
            NODE_ENV: "production",
            PORT: 443, // Changed to 443 for HTTPS as requested, though usually requires root. 
            // User might need to change this if they don't have root or use a reverse proxy. 
            // Based on instructions "update file... to listen to port 443"
        }
    }]
}
