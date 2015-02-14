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
    db: (process.env.DB || 'postgres://postgres:postgres@localhost:5432/') + (process.env.DB_NAME || 'rpg-server-development')
  },
  
  development: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT || 5000,
    db: (process.env.DB || 'postgres://postgres:postgres@rpg-dev.cwkfx0asoq4h.us-west-1.rds.amazonaws.com:5432/') + (process.env.DB_NAME || 'rpg_dev')
  },

  staging: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT || 5000,
    db: (process.env.DB || 'postgres://postgres:postgres@rpg-dev.cwkfx0asoq4h.us-west-1.rds.amazonaws.com:5432/') + (process.env.DB_NAME || 'rpg_staging')
  },

  production: {
    root: rootPath,
    app: {
      name: 'rpg-server'
    },
    port: process.env.PORT || 5000,
    db: (process.env.DB || 'postgres://postgres:postgres@rpg-dev.cwkfx0asoq4h.us-west-1.rds.amazonaws.com:5432/') + (process.env.DB_NAME || 'rpg_production')
  }
};

module.exports = config[env];
