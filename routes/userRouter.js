// ! userRouter -- 用于来应对来自signup, login的请求
// !			-- 利用写好的authenticate来为user创立passport,token
var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();

// * -- start of token practice --
var authenticate = require('../authenticate');
// * -- end   of token practice --

var passport = require('passport');

router.use(bodyParser.json());

var cors = require('./cors');

// * 从/signup里post
// ! 用passport来写不会用到.then
router.post('/signup', cors.corsWithOptions, function(req, res, next) {
	// * 找 username = username
	// .register --用于注册新的用户
	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		(err, user) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({ err: err });
			} else {
				// * mongoose population
				if (req.body.firstname) {
					user.firstname = req.body.firstname;
				}
				if (req.body.lastname) {
					user.lastname = req.body.lastname;
				}
				user.save((err, user) => {
					if (err) {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						return;
					} else {
						// todo 不知道为什么这么写，但是先记录一下
						passport.authenticate('local')(req, res, () => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							// * 用success来判断是否成功
							res.json({ success: true, status: 'Registration Successful' });
						});
					}
				});
				// * mongoose population
			}
		}
	);
});

// ! 用passport
// * 1. 这里有3个parameter,当'/login'的请求近来的时候，先回运行passport.authenticate('local),如果报错了不会运行接下来的，并自动返回err
// * 2. passport.authenticate('local') -- 会自动的吧user加到req里 === 可以直接调用req.user(不用req.session.user)
router.post(
	'/login',
	cors.corsWithOptions,
	passport.authenticate('local'),
	function(req, res) {
		// * -- start of token practice --
		// todo : create the token
		// exports.getToken = function(user)
		// user - 一个含有passport的module
		// 		- 这里只需要一个_id用于定义这个含有passport的module
		// ! --- token ---
		var token = authenticate.getToken({ _id: req.user._id });
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		// * 用success来判断是否成功
		// todo : send back the token
		res.json({ success: true, token: token, status: 'You are logged in!' });
		// ! --- token ---
		// * -- end   of token practice --
	}
);

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
	if (req.session) {
		// * all the info,cookie is removed
		req.session.destroy();
		// * remove the cookie with name 'session-id'
		res.clearCookie('session-id');
		//  * redirect to another page
		res.redirect('/');
	} else {
		var err = new Error('You are not logged in');
		err.status = 403;
		next(err);
	}
});

router.get(
	'/',
	cors.corsWithOptions,
	authenticate.verifyUser,
	(req, res, next) => {
		authenticate.verifyAdmin(req.user.admin, next);
		User.find({})
			.then(
				(users) => {
					res.statusCode = 200;
					// return a json
					res.setHeader('Content-Type', 'application/json');
					// take json as string and send it back to client
					res.json(users);
				},
				(err) => {
					next(err);
				}
			)
			.catch(function(err) {
				next(err);
			});
	}
);

// * --- facebook oauth ---
router.get(
	'/facebook/token',
	passport.authenticate('facebook-token'),
	(req, res) => {
		if (req.user) {
			var token = authenticate.getToken({ _id: req.user._id });
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({
				success: true,
				token: token,
				status: 'You are successfully logged in!'
			});
		}
	}
);
// router.get(
// 	'/facebook/token',
// 	passport.authenticate('facebook-token'),
// 	(req, res) => {
// 		// if the passport.authenticate('facebook-token') if successful -- then the user will be loaded into the req
// 		if (req.user) {
// 			var token = authenticate.getToken({ _id: req.user._id });
// 			res.statusCode = 200;
// 			res.setHeader('Content-Type', 'application/json');
// 			res.json({ success: true, token: token, status: 'You are logged in!' });
// 		} else {
// 			res.end('something wrong');
// 		}
// 	}
// );
// // * --- facebook oauth ---
module.exports = router;
