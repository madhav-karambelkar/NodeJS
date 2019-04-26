var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

const url = config.mongoUrl;
//const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('connected to Server');

} , (err) => { console.log(err)});
var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/users', usersRouter);


/*
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
//app.use(cookieParser('12345-67890-09876-54321'));

function auth (req, res, next) {
  console.log(req.user);

  if(!req.user) {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
  }
  else
  {
    next();
  }
}
*/
/*
function auth(req, res, next)
{
  console.log(req.session);
  if(!req.signedCookies.user)
  {

    var authHeader = req.headers.authorization;
    if(!authHeader)
    {
      var err = Error('Your are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'Base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if(user == 'admin' && pass == 'password')
    {
      res.session.user = 'admin';
      next();
    }
    else{
      var err = Error('Your are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);    
    }
  }
  else
  {
    if(res.session.user === 'admin')
    {
      console.log('Req Session: ' + req,session);
      next();
    }
    else{
      var err = Error('Your are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
    }
  }
}
*/
//app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));



app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

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
