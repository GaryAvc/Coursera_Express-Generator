var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

// -- adding the mongoose, mongodb function --
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';

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
// * signed-cookie : 需要添加'String'
// app.use(cookieParser('12345-67890-09876-54321'));

// * Session middleware
app.use(
	session({
		name: 'session-id',
		secret: '12345-67890-09876-54321',
		saveUninitialized: false,
		resave: false,
		store: new FileStore()
	})
);

// * user can only access the index and user logging page without Authentication
app.use('/', indexRouter);
app.use('/users', usersRouter);

// ! --- start of authentic part ---
function auth(req, res, next) {
	console.log(req.session);
	// * if the user have not been authenticated yet
	if (!req.session.user) {
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = 401;
		return next(err);
	} else {
		if (req.session.user == 'authenticated') {
			next();
		} else {
			// *一般不会有这种情况: 含有cookie但是是不合格的cookie，不让访问
			var err = new Error('You are not authenticated');
			err.status = 401;
			return next(err);
		}
	}
}

// * Authentic checking should before the middleware being accessed
// * !Authentic check!
app.use(auth);
// ! --- end of authentic part ---

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
