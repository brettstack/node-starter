var express = require('express');
var router = express.Router();
var models = require('../models');
var secrets = require('../../config/secrets');
var bcrypt = require('bcryptjs');
var debug = require('debug')('authCtrl');
var request = require('request');
var qs = require('querystring');
var createToken = require('../utils/createToken');
var jwt = require('jsonwebtoken');

var User = models.User;

module.exports = function(app) {
  app.use('/', router);
};

router.route('/auth/register')
.post(function(req, res) {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        var user = User.build({
          displayName: req.body.displayName,
          email: req.body.email,
          password: hash
        });

        user.save().then(function() {
          res.send({ token: createToken(user) });
        });
      });
    });

  }, function(err){
  });
});

router.route('/auth/local')
.post(function(req, res) {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(user) {
    if (!user) {
      return res.status(401).send({ message: 'No account with that email' });
    }

    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Password mismatch' });
      }

      res.send({ token: createToken(user) });
    });
  });
});

router.route('/auth/facebook')
  .post(function(req, res) {
    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/me';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: secrets.facebook.clientSecret,
      redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({
      url: accessTokenUrl,
      qs: params,
      json: true
    }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        return res.status(500).send({
          message: accessToken.error.message
        });
      }

      accessToken = qs.parse(accessToken);

      // Step 2. Retrieve profile information about the current user.
      request.get({
        url: graphApiUrl,
        qs: accessToken,
        json: true
      }, function(err, response, profile) {
        if (response.statusCode !== 200) {
          return res.status(500).send({
            message: profile.error.message
          });
        }

        if (req.headers.authorization) {
          User.findOne({
            where: {
              facebook: profile.id
            }
          }).then(function(existingUser) {
            if (existingUser) {
              return res.status(409).send({
                message: 'There is already a Facebook account that belongs to you'
              });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.verify(token);
            User.findById(payload.sub).then(function(user) {
              if (!user) {
                return res.status(400).send({
                  message: 'User not found'
                });
              }
              user.facebook = profile.id;
              user.displayName = user.displayName || profile.name;
              user.save().then(function() {
                var token = createToken(user, secrets.facebook.clientSecret);
                res.send({
                  token: token
                });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({
            where: {
              facebook: profile.id
            }
          }).then(function(existingUser) {
            debug(existingUser);
            if (existingUser) {
              var token = createToken(existingUser, secrets.facebook.clientSecret);
              return res.send({
                token: token
              });
            }
            var user = User.build();
            user.facebook = profile.id;
            user.displayName = profile.name;
            debug(user);
            user.save().then(function() {
              var token = createToken(user, secrets.facebook.clientSecret);
              res.send({
                token: token
              });
            });
          });
        }
      });
    });
  });


router.route('/auth/google')
  .post(function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: secrets.google.clientSecret,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({
          where: {
            google: profile.sub
          }
        }).then(function(existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token);
          User.findById(payload.sub, function(user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.displayName = user.displayName || profile.name;
            user.save().then(function() {
              var token = createToken(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({
          where: {
            google: profile.sub
          }
        }).then(function(existingUser) {
          if (existingUser) {
            return res.send({ token: createToken(existingUser) });
          }
          var user = User.build();
          user.google = profile.sub;
          user.displayName = profile.name;
          user.save().then(function(err) {
            var token = createToken(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});
