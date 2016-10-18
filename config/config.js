module.exports = {
    nodeHost: process.env.SHEEPDOG__NODE_HOST || 'localhost',
    nodePort: process.env.SHEEPDOG__NODE_PORT || '3000',
    clientId: process.env.SHEEPDOG__AUTH_CLIENT || 'local',
    clientSecret: process.env.SHEEPDOG__AUTH_SECRET || 'test',
    audienceName: process.env.SHEEPDOG__AUTH_AUDIENCE || 'local',
    accessTokenLifetimeSeconds: 1200,
    rabbitMq: {
        username: process.env.SHEEPDOG__RABBIT_USER || 'guest',
        password: process.env.SHEEPDOG__RABBIT_PASS || 'guest',
        host: process.env.SHEEPDOG__RABBIT_HOST || 'localhost',
        port: process.env.SHEEPDOG__RABBIT_PORT || '5672',
        queue: process.env.SHEEPDOG__RABBIT_QUEUE || 'yarnyard'
    }
};
