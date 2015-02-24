var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'local';

var config = {
  local: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT || 5000,
    db: 'postgres://postgres:postgres@' + (process.env.DB_SERVER || 'localhost:5432') + '/' + (process.env.DB_NAME || 'rpg-server-development')
  },
  
  development: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT,
    db: 'postgres://postgres:postgres@' + (process.env.DB_SERVER) + '/' + (process.env.DB_NAME)
  },

  staging: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT,
    db: 'postgres://postgres:postgres@' + (process.env.DB_SERVER) + '/' + (process.env.DB_NAME)
  },

  production: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT,
    db: 'postgres://postgres:postgres@' + (process.env.DB_SERVER) + '/' + (process.env.DB_NAME)
  }
};
console.log(config[env]);
module.exports = config[env];
