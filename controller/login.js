var express = require('express'),
    router = express.Router(),
    path = require('path'),
    mongoose = require('mongoose'),
    EmailConfirmationToken = mongoose.model('EmailConfirmationTokens'),
    config = require('../config/config.js'),
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

app.get('/register', function (req, res) {
    res.sendFile(path.resolve('view/register.html'));
});

app.post('/register', function (req, res) {

    var email = req.body.email;

    var ConfirmationToken = new EmailConfirmationToken({
        email: email,
        token: 'lalalala'
    });

    ConfirmationToken.save(function() {
        // send email
        res.send('fooooo');
    });
});

app.get('/confirm-email', function(req, res) {
    EmailConfirmationToken.findOne({ email: email, token: token }, function() {
        // create user and notify yarnyard api

        // create token and redirect to success
    });
});

router.get('/success', function (req, res) {
    res.sendFile(path.resolve('view/success.html'));
});

router.get('/login', function(req, res) {
    res.sendFile(path.resolve('view/login.html'));
});

module.exports = router;