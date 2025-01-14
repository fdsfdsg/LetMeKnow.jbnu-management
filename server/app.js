const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

// Middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
  next();
});

// 개발용 log
if (process.env.NODE_ENV === 'development') {
  const logger = require('morgan');
  app.use(logger('dev'));
  app.use(function(req, res, next) {
    console.log(req.query);
    console.log(req.body);
    console.log(req.params);
    next();
  });
  app.use('/assets', express.static('dist'));
} else {
  app.use('/assets', express.static('build'));
}

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/view'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  let apiError = err;
  if (!err.status) {
    apiError = createError(err);
  }
  // set locals, only providing error in development
  res.locals.message = apiError.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? apiError : {};

  return res.status(apiError.status).json({ message: apiError.message });
});

module.exports = app;
