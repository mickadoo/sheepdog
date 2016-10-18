var express = require('express'),
    router = express.Router(),
    path = require('path'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    model = require('../model'),
    EmailConfirmationToken = mongoose.model('EmailConfirmationTokens'),
    User = mongoose.model('OAuthUsers'),
    config = require('../config/config.js'),
    app = require('../app.js'),
    mailer = require('../services/mailer'),
    rabbit = require('../services/rabbit');

router.post('/oauth/token', function (req, res) {

    req.body.client_id = config.clientId;
    req.body.client_secret = config.clientSecret;

    app.oauth.grant()(req, res, function (err) {
        if (err && err.name && err.name === 'OAuth2Error') {
            res.statusCode = 400;
            res.send(err.message);
        }
    });
});

/**
 * GET register is used to display the login form
 */
app.get('/register', function (req, res) {
    res.sendFile(path.resolve('view/register.html'));
});

/**
 * POST register is used to create a confirmation token and send the email
 */
app.post('/register', function (req, res) {

    var email = req.body.email;

    var buffer = crypto.randomBytes(256);
    var randomToken = crypto.createHash('sha1').update(buffer).digest('hex');

    var ConfirmationToken = new EmailConfirmationToken({
        email: email,
        token: randomToken
    });

    ConfirmationToken.save(function () {

        var protocol = 'http://';
        var host = config.nodeHost;
        var port = config.nodePort;
        var setPasswordRoute = '/set-password';
        var setPasswordLink = protocol + host + ':' + port + setPasswordRoute;

        mailer.sendMail(
            email,
            'email_confirmation',
            {
                "token": randomToken,
                "email": email,
                "auth_host": setPasswordLink
            }
        );

        res.statusCode = 204;
        res.send()
    });
});

/**
 * GET set-password is clicked on from email. Passes on confirmation token
 */
app.get('/set-password', function (req, res) {
    res.sendFile(path.resolve('view/set-password.html'));
});

/**
 * POST set-password accepts e-mail, confirmation token and password to create
 * a user
 */
app.post('/set-password', function (req, res) {

    var email = req.body.email,
        password = req.body.password,
        confirmationTokenString = req.body.token;

    EmailConfirmationToken.findOne({
        email: email,
        token: confirmationTokenString
    }, function (error, confirmationToken) {

        if (!confirmationToken) {
            res.statusCode = 400;
            res.send('Something wrong with your token / email combo');

            return;
        }

        User.findOne({email: email}, function (error, tokenUser) {
            if (!tokenUser) {
                tokenUser = new User({
                    email: email,
                    password: password
                });
            } else {
                tokenUser.password = password;
            }

            tokenUser.save();
            confirmationToken.remove();

            // todo move to service
            var body = JSON.stringify({
                'event': 'email.changed',
                'data': {
                    'user': tokenUser
                }
            }, function (key, value) {
                if (key == "password") {
                    return undefined;
                }

                return value;
            });

            // email updated event
            rabbit.getConnection().publish('yarnyard', body);

            model.createToken(tokenUser, function (error, accessToken) {
                res.send(accessToken);
            });
        });
    });
});

router.get('/success', function (req, res) {
    res.sendFile(path.resolve('view/success.html'));
});

router.get('/login', function (req, res) {
    res.sendFile(path.resolve('view/login.html'));
});

module.exports = router;
