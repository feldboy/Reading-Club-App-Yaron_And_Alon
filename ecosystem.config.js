module.exports = {
    apps: [
        {
            name: 'reading-club-api',
            script: './dist/src/server.js',
            instances: '1',
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            }
        }
    ]
};
