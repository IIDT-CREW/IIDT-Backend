let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
require('moment-timezone');
let bodyParser = require('body-parser');
let indexRouter = require('./routes/index');
let authRouter = require('./routes/api/authController');
let willRouter = require('./routes/api/willController');
// let corsOption = {
//   origin: 'http://localhost:3030',
//   credentials: true,
// };
let cors = require('cors');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));

const whitelist = [
  'http://localhost:3001',
  'https://localhost:3001',
  'https://www.if-i-die-tomorrow.com',
  'https://if-i-die-tomorrow.com',
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('not Allowed Origin!'));
      }
    },
    credentials: true,
  }),
);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/api/oauth', authRouter);
app.use('/api/will', willRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
