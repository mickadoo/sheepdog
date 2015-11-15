var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'),
    memorystore = require('./model.js');
    jwt = require('jsonwebtoken');
    config = require('./config.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.oauth = oauthserver({
  model: memorystore,
  grants: ['password'],
  debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.get('/secret', app.oauth.authorise(), function (req, res) {
    res.send('Secret area\n');
});

app.use(app.oauth.errorHandler());

app.listen(3000);
