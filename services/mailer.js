var http = require('http'),
    config = require('../config/config');

exports.sendMail = function(recipient, type, data) {

    var body = JSON.stringify({
        recipient: recipient,
        type: type,
        data: data
    });

    var options = {
        host: config.mailerUrl,
        port: 80,
        path: '/mail',
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body)
        }
    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.end(body);
};