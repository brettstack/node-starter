var epilogue = require('epilogue');

module.exports = function(app, models) {
  epilogue.initialize({
    app: app,
    sequelize: models.sequelize
  });

  Object.keys(models).forEach(function(modelName) {
    var model = models[modelName];

    if (model.options.hasOwnProperty('defineRoutes')) {
      model.options.defineRoutes(models, epilogue);
    }
  });

}