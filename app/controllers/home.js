var express = require('express'),
  homeRouter = express.Router();

module.exports = function (app) {
  app.use('/', homeRouter);
};

homeRouter.get('/health-check', function(req, res, next){
  res.status(200).json({status: 'healthy'});
});

homeRouter.get('/', function (req, res, next) {
  res.status(200).json({hello: 'world'});
});
