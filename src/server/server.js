
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require("method-override"); // simulate DELETE and PUT (express4)
// [SH] Require Passport
var passport = require('passport');
var agenda = require('./Controllers/AgendaController');
var agendaUI = require('agenda-ui');

// [SH] Bring in the data model
require('./Models/mongooseConnection');
// [SH] Bring in the Passport config after model is defined
require('./config/passport');


// [SH] Bring in the routes for the API (delete the default routes)
var routesApi = require('./routes');

var app = express();

// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

app.use(methodOverride("X-HTTP-Method-Override"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});

app.use('/agenda-ui', agendaUI(agenda, {poll: 1000}));
// [SH] Use the API routes when path starts with /api
app.use('/', routesApi);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(3000);

module.exports = server;
