var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'),
    mongoose = require('mongoose'),
    dbConfig = require('./config/database.js'),
    passport = require('./passport.js'),
    memorystore = require('./model.js');

var app = module.exports = express();

app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/script', express.static(__dirname + '/script'));

mongoose.connect(dbConfig.url);

app.use(require('./controller/login.js'));
app.use(require('./controller/facebook.js'));

app.oauth = oauthserver({
    model: memorystore,
    grants: ['password'],
    debug: true
});

app.get('/', function(req, res) {
    res.redirect('/login');
});

app.listen('3000');