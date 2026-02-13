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
