var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();

// * -- start of token practice --
var authenticate = require('../authenticate');
// * -- end   of token practice --

var passport = require('passport');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
// * 从/signup里post
// ! 用passport来写不会用到.then
router.post('/signup', function(req, res, next) {
	// * 找 username = username
	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		(err, user) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({ err: err });
			} else {
				// todo 不知道为什么这么写，但是先记录一下
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					// * 用success来判断是否成功
					res.json({ success: true, status: 'Registration Successful' });
				});
			}
		}
	);
});

// ! 用passport
// * 1. 这里有3个parameter,当'/login'的请求近来的时候，先回运行passport.authenticate('local),如果报错了不会运行接下来的，并自动返回err
// * 2. passport.authenticate('local') -- 会自动的吧user加到req里 === 可以直接调用req.user(不用req.session.user)
router.post('/login', passport.authenticate('local'), function(req, res) {
	// * -- start of token practice --
	// todo : create the token
	// exports.getToken = function(user)
	// user - 一个含有passport的module
	// 		- 这里只需要一个_id用于定义这个含有passport的module
	var token = authenticate.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	// * 用success来判断是否成功
	// todo : send back the token
	res.json({ success: true, token: token, status: 'You are logged in!' });
	// * -- end   of token practice --
});

router.get('/logout', (req, res, next) => {
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

module.exports = router;
