var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();

// ! --- passport-local ---
var passport = require('passport');
// ! --- passport-local ---

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
// ! --- passport-local ---
router.post('/signup', function(req, res, next) {
	// todo User.register()
	// todo 1. 是一个passport-local-mongoose的内置函数，用于创建新的passport('local')
	User.register(
		{ username: req.body.username },
		req.body.password,
		(err, user) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({ err: err });
			} else {
				// todo 这里只是为了验证一下是否真的成功authenticate
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({ success: true, status: 'Registration successful' });
				});
			}
		}
	);
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, status: 'You are logged in' });
});
// ! --- passport-local ---

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
