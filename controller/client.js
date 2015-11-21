var express = require('express');
    router = express.Router();
    mongoose = require('mongoose');
    Client = mongoose.model('OAuthClients');

router.post('/clients', function(req, res) {

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

module.exports = router;