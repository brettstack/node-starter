var express = require('express');
var userRouter = express.Router();
var models = require('../models');
var _ = require('lodash');

var User = models.User;

module.exports = function(app) {
  app.use('/user', userRouter);
};

userRouter.param('userId', function(req, res, next, userId) {
  User.find(userId, {
    include: [models.PasswordResetRequest]
  }).then(function(user) {
    if (!user) {
      return res
        .status(404)
        .end();
    }

    req.user = user;
    next();
  });
});

// userRouter.route('/')
//   .get(function(req, res, next) {
//     var users = [];
//
//     res.status(200).json(users);
//   })
//   .post(function(req, res, next) {
//     var user = User.build();
//     res.status(201).json(user);
//   });
//
// userRouter.route('/:userId([0-9]+)')
//   .get(function(req, res, next) {
//     res.status(200).json(req.user);
//   })
//   .put(function(req, res, next) {
//
//     res.status(200).json(req.user);
//   })
//   .delete(function(req, res, next) {
//
//     res.status(204).end();
//   });

userRouter.route('/:userId/hero')
  .get(function(req, res, next) {
    req.user.getHeroCollection().then(function(heroes) {
      res
      .status(200)
      .json(heroes);
    });
  });