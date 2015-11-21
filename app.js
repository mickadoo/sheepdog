var express = require('express');
    bodyParser = require('body-parser');
    oauthserver = require('oauth2-server');
    jwt = require('jsonwebtoken');
    mongoose = require('mongoose');
    config = require('./config/config.js');
    dbConfig = require('./config/database.js');
    passport = require('./passport.js');
    memorystore = require('./model.js');
    User = mongoose.model('OAuthUsers');
    Client = mongoose.model('OAuthClients');

var app = express();

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/script', express.static(__dirname + '/script'));
app.use(app.oauth.errorHandler());

mongoose.connect(dbConfig.url);

app.oauth = oauthserver({
    model: memorystore,
    grants: ['password'],
    debug: true
});

// route for facebook authentication and login
app.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
app.get('/login/facebook/callback', passport.authenticate('facebook'), function(req, res) {

        memorystore.generateToken('password', req, function(err, token) {
            var expires = new Date();
            expires.setSeconds(expires.getSeconds() + config.accessTokenLifetime);
            memorystore.saveAccessToken(token, config.clientId, expires, req.user );

            var loginUrl = 'http://login.yarnyard.dev'; // temporary since redirect will bring them to localhost..

            res.redirect(loginUrl + "/success?token=" + token);
        });
    }
);
app.post('/oauth/token', function (req, res) {

    req.body.client_id = config.clientId;
    req.body.client_secret = config.clientSecret;

    app.oauth.grant()(req, res, function(err){
        if (err && err.name && err.name === 'OAuth2Error') {
            res.statusCode = 400;
            res.send(err.message);
        }
    });
});

app.post('/users', function(req, res) {

    // todo remove this, it's just to set up a test user

    // Creating one user.
    var testUser = new User ({
        email: 'test',
        password: 'user'
    });

    // Saving it to the database.
    testUser.save(function (err) {if (err) console.log ('Error on save!')});
});

app.post('/clients', function(req, res) {

    // todo remove this, it's just to set up client once

    // Creating one user.
    var baseClient = new Client ({
        clientId: 'local',
        clientSecret: 'test',
        redirectUrl: ''
    });

    // Saving it to the database.
    baseClient.save(function (err) {if (err) console.log ('Error on save!')});
});

app.get('/', function(req, res) {
    res.redirect('/login');
});

app.get('/success', function (req, res) {
    res.sendFile(__dirname + '/view/success.html');
});

app.get('/secret', app.oauth.authorise(), function (req, res) {
    // this is not used, just an example of showing how to restrict access to auth server resources
    res.send('Secret area\n');
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/view/login.html');
});

app.listen('3000');