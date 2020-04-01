// ! 所有关于给予用户权限/authentication的操作都在这个文件里
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var user = require('./models/user');

// * -- start of token practice --

var JwtStrategy = require('passport-jwt').Strategy;
var ExtraJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');

// * -- end   of token practice --

// ! -- part 1 --
// ! passport-localMongoose

// * local -- 是一个函数, 内容是passport.use();
// * user --  是一个module里面用了passportLocalMongoose的plugin所以会有一个authenticate函数
// * user.authenticate() -- 用于取出body重的username, password
passport.use(new localStrategy(user.authenticate()));
// * ⬇️得到所需要的session info. 里面也是passportLocalMongoose的plugin含有的函数
// ! 是一个函数！！ 要用xxx()
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// * -- start of token practice --

// ! -- part 1 --

// ! -- part 2 --
// ! passport-jwt

// create token
exports.getToken = function(user) {
	// create json web token
	// jwt.sign(1,2,3)
	// 1.1 payload -用于记录user的信息, _id等
	// 1.2 user - 一个含有passport的module
	// 2.  secret key
	// 3.  options - 一个小时内这个token会失效 - 3600s = 1h
	return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
// .jwtFromRequest - define how the token will be extract from the request
opts.jwtFromRequest = ExtraJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
	// 1. done -- callback function provided by passport。
	//         -- 当你用passport.use的时候都需要有一个done function
	//         -- 作用: passing back info to passport then for loading things on to the request message
	new JwtStrategy(opts, function(jwt_payload, done) {
		console.log('JWT payload: ', jwt_payload);
		user.findOne({ _id: jwt_payload._id }, (err, user) => {
			if (err) {
				// done(err,user?,info?) --  就是上面的callback function: done
				return done(err, false);
			} else if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

// todo verifyUser -- 用于判断这个user/request是否被authenticated,用jwt方法
exports.verifyUser = passport.authenticate('jwt', { session: false });

// * Verify Admin user
exports.verifyAdmin = (req, res, next) => {
	if (req.user.admin) {
		next();
	} else {
		var err = new Error('You are not admin user 2');
		return next(err);
	}
};
// * Verify Admin user

exports.verifyOriginUser = (commentUserId, reqId, next) => {
	if (!reqId.equals(commentUserId)) {
		var err = new Error(
			"You are not the origin user who post this comment, \
			 you don't have the authentication to modify this comment"
		);
		err.status = 403;
		return next(err);
	}
};
exports.verifyOriginOrAdminUser = (commentUserId, reqId, isAdmin, next) => {
	if (reqId.equals(commentUserId) || isAdmin) {
	} else {
		var err = new Error(
			"You are not the origin user who post this comment, \
			 you don't have the authentication to modify this comment"
		);
		err.status = 403;
		return next(err);
	}
};
// * -- end   of token practice --

// ! -- part 2 --
