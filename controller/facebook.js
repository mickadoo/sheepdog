var express = require('express');
    router = express.Router();
    passport = require('./../passport.js');
    memorystore = require('./../model.js');

router.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get(
    '/login/facebook/callback',
    passport.authenticate('facebook'),
    function(req, res) {
        memorystore.generateToken('password', req, function(err, token) {
            var expires = new Date();
            expires.setSeconds(expires.getSeconds() + config.accessTokenLifetime);
            memorystore.saveAccessToken(token, config.clientId, expires, req.user );
            var loginUrl = 'http://login.yarnyard.dev'; // temporary since redirect will bring them to localhost..
            res.redirect(loginUrl + "/success?token=" + token);
        });
    }
);

module.exports = router;