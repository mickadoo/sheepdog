var express = require('express');
    bodyParser = require('body-parser');
    oauthserver = require('oauth2-server');
    jwt = require('jsonwebtoken');
    mongoose = require('mongoose');
    passport = require('passport');
    config = require('./config/config.js');
    dbConfig = require('./config/database.js');
    fbConfig = require('./config/facebook.js');
    memorystore = require('./model.js');
    FacebookStrategy = require('passport-facebook').Strategy;
    User = mongoose.model('OAuthUsers');
    Client = mongoose.model('OAuthClients');

var app = express();

/**
 * -------------------------------------------------------
 * ---------------     PASSPORT      ---------------------
 * -------------------------------------------------------
 */

app.use(passport.initialize());
mongoose.connect(dbConfig.url);

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
        profileFields   : ['id', 'email']
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {

        // todo decide the flow here.. should probably find a user by email and grant a token for them, redirect to main
        // todo cont.. page but how can set localstorage token

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'fb.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();

                    newUser.fb.id    = profile.id;
                    newUser.fb.access_token = access_token;
                    newUser.fb.email = profile.emails[0].value;

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }
            });
        });
    })
);

// route for facebook authentication and login
// different scopes while logging in
app.get('/login/facebook',
    passport.authenticate('facebook', { scope : 'email' }
    ));

// handle the callback after facebook has authenticated the user
app.get('/login/facebook/callback', passport.authenticate('facebook'), function(req, res) {
    var token = jwt.sign({ userId: req.user._id , aud: config.audience_name }, config.client_secret);

    res.send(token);
});

/**
 * -------------------------------------------------------
 * -------------------------------------------------------
 * -------------------------------------------------------
 */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/script', express.static(__dirname + '/script'));

app.oauth = oauthserver({
  model: memorystore,
  grants: ['password'],
  debug: true
});

app.post('/oauth/token', function (req, res) {

    req.body.client_id = config.clientId;
    req.body.client_secret = config.clientSecret;

    return app.oauth.grant()(req, res, function(response){

        if (response.name === 'OAuth2Error') {
            res.statusCode = 400;
            res.send(response.message);
            return;
        }

        res.statusCode = response.code;
        res.send(response);
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

app.get('/secret', app.oauth.authorise(), function (req, res) {
    // this is not used, just an example of showing how to restrict access to auth server resources
    res.send('Secret area\n');
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/view/login.html');
});

app.use(app.oauth.errorHandler());
app.listen(3000);

