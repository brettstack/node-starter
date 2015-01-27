var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT || 5000,
    db: 'postgres://postgres:postgres@localhost:5432/rpg-server-development'

  },

  test: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT || 5000,
    db: 'postgres://postgres:postgres@localhost:5432/rpg-server-test'

  },

  production: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT || 5000,
    db: 'postgres://postgres:postgres@localhost:5432/rpg-server-production'

  }
};

module.exports = config[env];
