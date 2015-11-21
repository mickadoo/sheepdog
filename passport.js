var passport = require('passport');
    mongoose = require('mongoose');
    memorystore = require('./model.js');
    User = mongoose.model('OAuthUsers');
    Client = mongoose.model('OAuthClients');
    Token = mongoose.model('OAuthAccessTokens');
    fbConfig = require('./config/facebook.js');
    FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(
    'facebook',
    new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl,
        profileFields   : ['id', 'email']
    },
    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
        // asynchronous
        process.nextTick(function() {
            // find the user in the database based on their facebook id
            User.findOne({ 'fb.id' : profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.fb.id    = profile.id;
                    newUser.fb.access_token = access_token;
                    newUser.fb.email = profile.emails[0].value;
                    newUser.email = newUser.fb.email;

                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });
        });
    })
);

module.exports = passport;