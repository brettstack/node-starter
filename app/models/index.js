var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var lodash = require('lodash');
var config = require('../../config/config');
var globby = require('globby');
var db = {};

var sequelize = new Sequelize(config.db, {
  logging: console.log,
  dialect: 'postgres',
  sync: {
    force: true
  },
  syncOnAssociation: true,
  pool: {
    maxConnections: 5,
    maxIdleTime: 30
  }
});

globby.sync(['*.js', '!' + 'index.js', '!' + '*.spec.js'], {
  cwd: __dirname
})
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);