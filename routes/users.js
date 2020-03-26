var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
	User.register(
		{ username: req.body.username },
		req.body.password,
		(err, user) => {
			if (err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({ err: err });
			} else {
				passport.authenticate('local')(req, res, () => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({ success: true, status: 'Successfully Register!' });
				});
			}
		}
	);
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, status: 'You are logged in!' });
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
