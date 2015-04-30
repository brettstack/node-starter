var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var epilogue = require('epilogue');
var lodash = require('lodash');
var config = require('../../config/config');
var globby = require('globby');
var db = {};

var sequelize = new Sequelize(config.db, {
  logging: console.log,
  dialect: 'postgres',
  sync: {
    force: false
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
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);