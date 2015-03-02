var express = require('express');
// var helmet = require('helmet');
var globby = require('globby');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var methodOverride = require('method-override');
var cors = require('cors');
var isAuthenticated = require('../app/utils/isAuthenticated');
var http = require('http');
var Primus = require('Primus');
// var passport = require('passport');
// var passportConfig = require('./passport');
// var FacebookStrategy = require('passport-facebook').Strategy;
// var GoogleStrategy = require('passport-google').Strategy;
var expressValidator = require('express-validator');

module.exports = function(app, config) {
  // app.use(helmet());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compression());
  // app.use(express.static(config.root + '/public'));
  app.use(expressValidator());
  app.use(methodOverride());
  app.use(cors({
    origin: true,
    // origin: function(origin, callback) {
    //   var whitelist = ['http://localhost:4000'];
    //   var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    //
    //   callback(null, originIsWhitelisted);
    // },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  // app.use(passport.initialize());

  app.use(isAuthenticated);
  // app.all(isAuthenticated);

  // Initialise controllers
  globby.sync([config.root + '/app/controllers/*.js', '!' + config.root + '/app/controllers/*.spec.js']).forEach(function(file) {
    require(file)(app);
  });

  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    });
  });


  // var server = http.createServer(app);
  // var primus = new Primus(server, {
  //   transformer: 'engine.io',
  //   port: 5000
  // });
  var primus = Primus.createServer(function(spark) {}, {
    transformer: 'engine.io',
    port: 5001
  });

  primus.authorize(function(req, done) {
    var auth;

    try {
      // auth = authParser(req.headers['authorization'])
    } catch (ex) {
      return done(ex)
    }

    //
    // Do some async auth check
    //
    // authCheck(auth, done);
    return done();
  });
  
  primus.on('connection', function(spark) {
    spark.write('hello connnection');
    spark.on('data', function message(data) {
      console.log(data);
    });
  });
  primus.on('disconnection', function(spark) {
    // the spark that disconnected
  });
  primus.save(__dirname + '/primus.js');
};