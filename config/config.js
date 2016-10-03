module.exports = {
    nodePort: process.env.NODE_PORT || '3000',
    clientId: process.env.AUTH_CLIENT || 'local',
    clientSecret: process.env.AUTH_SECRET || 'test',
    audienceName: process.env.AUTH_AUDIENCE || 'local',
    accessTokenLifetimeSeconds: 1200,
    rabbitMq: {
        username: process.env.RABBIT_USER || 'guest',
        password: process.env.RABBIT_PASS || 'guest',
        host: process.env.RABBIT_HOST || 'rabbit',
        port: process.env.RABBIT_PORT || 5672,
        queue: process.env.RABBIT_QUEUE || 'yarnyard'
    }
};
