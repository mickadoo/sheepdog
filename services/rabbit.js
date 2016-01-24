var config = require('../config/config'),
    amqp = require('amqp');

var connectString = "amqp://{{username}}:{{password}}@{{host}}:{{port}}"
    .replace('{{username}}', config.rabbitMq.username)
    .replace('{{password}}', config.rabbitMq.password)
    .replace('{{host}}', config.rabbitMq.host)
    .replace('{{port}}', config.rabbitMq.port);

var connection = amqp.createConnection(
    {url: connectString}
);

connection.on('ready', function () {
    connection.queue('yarnyard', function (q) {
        // Catch all messages
        q.bind('#');
    });
});

module.exports = {
    getConnection: function (){
        return connection;
    }
};