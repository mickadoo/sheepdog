var express = require('express');
    router = express.Router();
    passport = require('./../passport.js');
    memorystore = require('./../model.js');
    config = require('./../config/config.js');

router.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get(
    '/login/facebook/callback',
    passport.authenticate('facebook'),
    function(req, res) {

        memorystore.createToken(req.user, function(error, accessToken) {
            res.redirect("/success?token=" + accessToken.accessToken);
        });
    }
);

module.exports = router;