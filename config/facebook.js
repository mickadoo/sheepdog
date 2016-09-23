module.exports = {
    appID : process.env.FACEBOOK_ID || 'facebook_id',
    appSecret : process.env.FACEBOOK_SECRET || 'facebook_secret',
    callbackUrl : process.env.FACEBOOK_CALLBACK || 'https://login.yarnyard.com/login/facebook/callback'
};
