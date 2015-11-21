var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    uuid: String,
    email: String,
    password: String
});