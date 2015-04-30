var express = require('express');
var meRouter = express.Router();
var models = require('../models');
var debug = require('debug')('meCtrl');
var User = models.User;
var Hero = models.Hero;

module.exports = function(app) {
  app.use('/me', meRouter);
};

meRouter.route('/')
  .get(function(req, res, next) {
    res.status(200).json(req.me);
  });
meRouter.route('/hero')
  .get(function(req, res, next) {
    req.me.getHeroCollection().then(function(heroes) {
      if (!heroes) {
        res.status(404).end();
      } else {
        res.status(200).json(heroes);
      }
    });
  });