/**
 * Copyright 2013-present NightWorld.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    config = require('./config/config.js'),
    Schema = mongoose.Schema,
    model = module.exports;

// schema definitions
var OAuthAccessTokensSchema = new Schema({
  accessToken: { type: String },
  clientId: { type: String },
  userId: { type: String },
  expires: { type: Date }
});

var OAuthRefreshTokensSchema = new Schema({
  refreshToken: { type: String },
  clientId: { type: String },
  userId: { type: String },
  expires: { type: Date }
});

var OAuthClientsSchema = new Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUri: { type: String }
});

var EmailConfirmationTokenSchema = new Schema({
  email: { type: String },
  token: { type: String }
});

var OAuthUsersSchema = new Schema({
  username: { type: String },
  password: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  fb: {
    id: {type: String},
    access_token: {type: String},
    email: {type: String}
  },
  email: { type: String, default: '' }
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
mongoose.model('OAuthClients', OAuthClientsSchema);
mongoose.model('OAuthUsers', OAuthUsersSchema);
mongoose.model('EmailConfirmationTokens', EmailConfirmationTokenSchema);

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens'),
  OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens'),
  OAuthClientsModel = mongoose.model('OAuthClients'),
  OAuthUsersModel = mongoose.model('OAuthUsers');

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to resrict certain grant types
var authorizedClientIds = ['local'];

/**
 * oauth2-server callbacks
 *
 * @param bearerToken
 * @param callback
 */
model.getAccessToken = function (bearerToken, callback) {
  OAuthAccessTokensModel.findOne({ accessToken: bearerToken }, callback);
};

/**
 * @param clientId
 * @param clientSecret
 * @param callback
 * @returns {Query|*}
 */
model.getClient = function (clientId, clientSecret, callback) {
  if (clientSecret === null) {

    return OAuthClientsModel.findOne({ clientId: clientId }, callback);
  }

  return OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }, callback);
};

/**
 * @param clientId
 * @param grantType
 * @param callback
 * @returns {*}
 */
model.grantTypeAllowed = function (clientId, grantType, callback) {

  if (grantType === 'password') {
    return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
  }

  callback(false, true);
};

/**
 * @param token
 * @param clientId
 * @param expires
 * @param user
 * @param callback
 */
model.saveAccessToken = function (token, clientId, expires, user, callback) {

  var accessToken = new OAuthAccessTokensModel({
    accessToken: token,
    clientId: clientId,
    userId: user.id,
    expires: expires
  });

  accessToken.save(callback);
};

/**
 * Required to support password grant type
 *
 * @param email
 * @param password
 * @param callback
 */
model.getUser = function (email, password, callback) {

  OAuthUsersModel.findOne({ email: email, password: password }, function(err, user) {
    if(err) return callback(err);
    if(! user) return callback(new Error('bad email and password combo'));

    callback(null, user);
  });
};

/**
 * Required to support refreshToken grant type
 *
 * @param token
 * @param clientId
 * @param expires
 * @param userId
 * @param callback
 */
model.saveRefreshToken = function (token, clientId, expires, userId, callback) {

  var refreshToken = new OAuthRefreshTokensModel({
    refreshToken: token,
    clientId: clientId,
    userId: userId,
    expires: expires
  });

  refreshToken.save(callback);
};

/**
 * @param refreshToken
 * @param callback
 */
model.getRefreshToken = function (refreshToken, callback) {

  OAuthRefreshTokensModel.findOne({ refreshToken: refreshToken }, callback);
};

/**
 * @param user
 * @param callback
 */
model.createToken = function(user, callback) {
  var tokenString = getJwtToken(user);
  var expires = new Date();
  expires.setSeconds(expires.getSeconds() + config.accessTokenLifetime);

  model.saveAccessToken(tokenString, config.clientId, expires, user, callback );
};

/**
 * Override for default token generation in oauth2-server/token.js
 *
 * @param type
 * @param request
 * @param callback
 */
model.generateToken = function (type, request, callback) {
  var token = getJwtToken(request.user);

  callback(false, token);
};

/**
 * @param user
 */
function getJwtToken (user) {
  return jwt.sign({ userId: user.id , aud: config.audienceName }, config.clientSecret);
}
