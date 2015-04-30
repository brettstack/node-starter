var express = require('express');
var heroRouter = express.Router();
var models = require('../models');
var _ = require('lodash');

var Hero = models.Hero;

module.exports = function(app) {
  app.use('/hero', heroRouter);
};

heroRouter.param('heroId', function(req, res, next, heroId) {
  Hero.find(heroId, {
    include: []
  }).then(function(hero) {
    if (!hero) {
      return res
        .status(404)
        .end();
    }

    req.hero = hero;
    next();
  });
});

heroRouter.route('/is-unique-name')
  .get(function(req, res, next) {
    console.log(req.query.name)
    Hero.findOne({
      where: {
        name: req.query.name
      }
    }).then(function(heroes) {
      res
        .status(200)
        .json(_.isEmpty(heroes));
    });
  });