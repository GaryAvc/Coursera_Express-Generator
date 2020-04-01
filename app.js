var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
// * -- passport --
var passport = require('passport');
var authenticate = require('./authenticate');
// * -- passport --

// * -- start of token practice --
var config = require('./config');
// * -- end   of token practice --

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');

// -- adding the mongoose, mongodb function --
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

// * -- start of token practice --
const url = config.mongoUrl;
// * -- end   of token practice --

const connect = mongoose.connect(url);

connect.then(
	function(db) {
		console.log('connect to the server');
	},
	function(err) {
		console.log(err);
	}
);
// -- end of mongodb part --

var app = express();
// * --- https part ---
app.all('*', (req, res, next) => {
	if (req.secure) {
		return next();
	} else {
		res.redirect(
			307,
			'https://' + req.hostname + ':' + app.get('secPort') + req.url
		);
	}
});
// * --- https part ---

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false
	})
);

// * -- passport --

// * 1. 这里会serialize用户信息，并放在session里
// * 2. 如果有一个client的request，含有一个注册的cookie,⬇️会直接加载req.user
app.use(passport.initialize());

// * -- passport --

// * user can only access the index and user logging page without Authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/image', uploadRouter);

// *To server static data from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

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
