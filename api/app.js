var createError = require('http-errors');
var express = require('express');
var path = require('path');
var https = require('https');
var fs = require('fs');
const passport = require('passport');
const FacebookStrategy  = require('passport-facebook').Strategy;
const session  = require('express-session');
const cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');
require('dotenv').config()
var indexRouter = require('./routes/index');
var itemRouter = require("./controllers/AdminApp/ItemController");
var sdkRouter = require("./controllers/AdminApp/SDKController");
var usersRouter = require('./routes/users');

const configFB = require('./config/configFB');
const routeFB = require('./routes/routers');

var app = express();

// Passport session setup. 
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Sử dụng FacebookStrategy cùng Passport.
passport.use(new FacebookStrategy({
  clientID: configFB.facebook_key,
  clientSecret: configFB.facebook_secret ,
  callbackURL: configFB.callback_url
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    console.log(accessToken, refreshToken, profile, done);
    return done(null, profile);
  });
}
));

const bodyParser = require('body-parser');

//Connect to database
require('./models/Database/indexDB');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.use(upload.array());
app.use(express.static('public'));
app.use('/public', express.static(__dirname + "/public"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/sdk", sdkRouter);
app.use('/itemSdk', itemRouter);
app.use('/fb', routeFB);

let routes = require('./routes/api/restful/api');
routes(app);

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
