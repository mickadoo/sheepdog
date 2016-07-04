var express = require('express');
    router = express.Router();
    mongoose = require('mongoose');
    User = mongoose.model('OAuthUsers');

router.post('/users', function(req, res) {

    // todo remove this, it's just to set up a test user

    // Creating one user.
    var testUser = new User ({
        email: 'test',
        password: 'user'
    });

    // Saving it to the database.
    testUser.save(function (err) {if (err) console.log ('Error on save!')});
});

module.exports = router;
