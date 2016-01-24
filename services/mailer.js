var rabbit = require('./rabbit.js');

exports.sendMail = function(recipient, type, data) {

    var body = JSON.stringify({
        recipient: recipient,
        type: type,
        data: data
    });

    rabbit.getConnection().publish('yarnyard', body);
};