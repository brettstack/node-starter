var _ = require('lodash');
var models = require('../app/models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var secrets = require('./secrets');

var User = models.User;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(email, password, done) {
  User.findOne({
    email: email
  }, function(err, user) {
    if (!user) return done(null, false, {
      message: 'Email ' + email + ' not found'
    });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Invalid email or password.'
        });
      }
    });
  });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({
      facebook: profile.id
    }, function(err, existingUser) {
      if (err) return done(err);

      if (existingUser) {
        req.flash('errors', {
          msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
        });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.facebook = profile.id;
          user.tokens.push({
            kind: 'facebook',
            accessToken: accessToken
          });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.save(function(err) {
            req.flash('info', {
              msg: 'Facebook account has been linked.'
            });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({
      facebook: profile.id
    }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      User.findOne({
        email: profile._json.email
      }, function(err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', {
            msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.'
          });
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({
            kind: 'facebook',
            accessToken: accessToken
          });
          user.profile.name = profile.displayName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.profile.location = (profile._json.location) ? profile._json.location.name : '';
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
}));

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy(secrets.google, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({
      google: profile.id
    }, function(err, existingUser) {
      if(err) return done(err);
      
      if (existingUser) {
        req.flash('errors', {
          msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
        });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.google = profile.id;
          user.tokens.push({
            kind: 'google',
            accessToken: accessToken
          });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || profile._json.picture;
          user.save(function(err) {
            req.flash('info', {
              msg: 'Google account has been linked.'
            });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({
      google: profile.id
    }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      User.findOne({
        email: profile._json.email
      }, function(err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', {
            msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.'
          });
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.google = profile.id;
          user.tokens.push({
            kind: 'google',
            accessToken: accessToken
          });
          user.profile.name = profile.displayName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = profile._json.picture;
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
}));

/**
 * Login Required middleware.
 */
module.exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
module.exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, {
    kind: provider
  })) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};