var express = require('express'),
    router = express.Router(),
    path = require('path'),
    config = require('../config/config.js');
    app = require('../app.js');

router.post('/oauth/token', function (req, res) {

    req.body.client_id = config.clientId;
    req.body.client_secret = config.clientSecret;

    app.oauth.grant()(req, res, function(err){
        if (err && err.name && err.name === 'OAuth2Error') {
            res.statusCode = 400;
            res.send(err.message);
        }
    });
});

router.get('/success', function (req, res) {
    res.sendFile(path.resolve('view/success.html'));
});

router.get('/login', function(req, res) {
    res.sendFile(path.resolve('view/login.html'));
});

module.exports = router;