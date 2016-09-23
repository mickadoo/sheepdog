module.exports = {
    nodePort: process.env.AUTH_CLIENT || '80',
    clientId: process.env.AUTH_CLIENT || 'local',
    clientSecret: process.env.AUTH_SECRET || 'test',
    audienceName: process.env.AUTH_AUDIENCE || 'local',
    accessTokenLifetimeSeconds: 1200,
    rabbitMq: {
        username: process.env.RABBIT_USER || 'username',
        password: process.env.RABBIT_PASS || 'password',
        host: process.env.RABBIT_HOST || 'localhost',
        port: process.env.RABBIT_PORT || 5672,
        queue: process.env.RABBIT_QUEUE || 'yarnyard'
    }
};
