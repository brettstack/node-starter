var moment = require('moment');
var secrets = require('../../config/secrets');
var jwt = require('jsonwebtoken');

module.exports = function createToken(user) {
  var payload = {
  };

  return jwt.sign(payload, secrets.TOKEN_SECRET, {
    expiresInMinutes: moment().add(14, 'days').unix(),
    subject: user.id
  });
}
