var _ = require('lodash');
var secrets = require('../../config/secrets');
var jwt = require('jsonwebtoken');

module.exports = function isAuthenticated(req, res, next) {
  var nonSecurePaths = ['/auth/facebook', '/auth/google', '/auth/local', '/auth/register', '/auth/forgot-password', '/auth/password-reset-request', '/auth/password-reset-request/reset-password'];

  if ( _.contains(nonSecurePaths, req.path) ) return next();

  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({ message: 'You did not provide a JSON Web Token in the Authorization header.' });
  }

  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.verify(token, secrets.TOKEN_SECRET);
  var now = moment().unix();

  if (now > payload.exp) {
    return res.status(401).json({ message: 'Token has expired.' });
  }

  User.findById(payload.sub).then(function(user) {
    if (!user) {
      return res.status(400).json({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  });
}
