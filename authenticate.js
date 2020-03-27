var localStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('./models/user');

var JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('./config');
var jwt = require('jsonwebtoken');

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- token ---

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;
passport.use(
	new JwtStrategy(opts, function(jwt_payload, done) {
		User.findOne({ _id: jwt_payload._id }, function(err, user) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

exports.getToken = (user) => {
	return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

exports.verifyUser = passport.authenticate('jwt', { session: false });
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = config.secretKey;
// passport.use(
// 	new JwtStrategy(opts, (jwt_payload, done) => {
// 		user.findOne({ _id: jwt_payload._id }, (err, user) => {
// 			if (err) {
// 				return done(err, false);
// 			} else if (user) {
// 				return done(null, user);
// 			} else {
// 				return done(null, false);
// 			}
// 		});
// 	})
// );

// exports.getToken = (user) => {
// 	// !要return
// 	return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
// };

// exports.verifyUser = passport.authenticate('jwt', { session: false });
