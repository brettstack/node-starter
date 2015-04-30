var express = require('express'),
  config = require('./config/config'),
  models = require('./app/models');
  // epilogue = require('epilogue');

var app = express();
// require('./config/epilogue')(app, models);
require('./config/express')(app, config);

models.sequelize
  .sync()
  .complete(function(err) {
    if (err) {
      throw err[0];
    } else {
      app.listen(config.port);
      console.log('Server started on port ' + config.port);
    }
  });

module.exports = app;