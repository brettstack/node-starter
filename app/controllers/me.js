var express = require('express');
var router = express.Router();
var models = require('../models');
var debug = require('debug')('meCtrl');
var User = models.User;

module.exports = function(app) {
  app.use('/me', router);
};

router.route('/')
  .get(function(req, res, next) {
    res.status(200).json(req.user);
  });