var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'),
    memorystore = require('./model.js');
    jwt = require('jsonwebtoken');
    config = require('./config.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/script', express.static(__dirname + '/script'));

app.oauth = oauthserver({
  model: memorystore,
  grants: ['password'],
  debug: true
});

app.post('/oauth/token', function (req, res) {

    req.body.client_id = config.client_id;
    req.body.client_secret = config.client_secret;

    return app.oauth.grant()(req, res, function(response){
        res.statusCode = response.code;
        res.send(response);
    });
});

app.get('/secret', app.oauth.authorise(), function (req, res) {
    res.send('Secret area\n');
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/view/login.html');
});

app.use(app.oauth.errorHandler());
app.listen(3000);

