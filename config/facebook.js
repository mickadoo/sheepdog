module.exports = {
    appID : process.env.SHEEPDOG__FACEBOOK_ID || 'facebook_id',
    appSecret : process.env.SHEEPDOG__FACEBOOK_SECRET || 'facebook_secret',
    callbackUrl : process.env.SHEEPDOG__FACEBOOK_CALLBACK || 'https://login.yarnyard.com/login/facebook/callback'
};
