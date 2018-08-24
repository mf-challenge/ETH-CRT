var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger1 = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mftoken = require('./controllers/serviceofferings')
var events = require('./events/eventlistener')
var helper = require('./utils/helper.js');
var logger = helper.getLogger('app');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger1('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/signIn',usersRouter);
app.use('/mpats', mftoken);

logger.info("Registered for Events")
events.MFTokenEvtListener();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
