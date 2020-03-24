var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
// * 从/signup里post
router.post('/signup', function(req, res, next) {
	// * 找 username = username
	User.findOne({ username: req.body.username })
		.then(function(user) {
			// * 如果找到了 user != null，报错已存在
			if (user != null) {
				var err = new Error('User ' + req.body.username + ' already exists');
				err.status = 403;
				next(err);
			}
			// * 如果不存在，创建一个新的user
			else {
				// * 这里会产生一个promise⬇️
				return User.create({
					username: req.body.username,
					password: req.body.password
				});
			}
		})
		.then(
			// * 返回json: 成功注册
			function(user) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({ status: 'Registration Successful', user: user });
			},
			// * 若有问题,next(err)
			function(err) {
				next(err);
			}
		)
		.catch(function(err) {
			next(err);
		});
});

router.post('/login', function(req, res, next) {
	if (!req.session.user) {
		var authHeader = req.headers.authorization;
		if (!authHeader) {
			var err = new Error('You are not authenticated!');
			res.setHeader('WWW-Authenticate', 'Basic');
			err.status = 401;
			return next(err);
		} else {
			// * 1. Buffer - enable to split value
			// * 2. 'base64' - encoding type
			// * 3. split(' ') - 把string通过' '(空格)分成几个部分， 放入一个array重
			// *        因为这个string是用一个space隔开的，所以[0] -> basic, [1] -> username+password
			// * 4. toString().split(":") - username与password通过一个 ; 隔开， 把得到的密码再split到一个array里
			// * 5. auth - 一个array， 含有[0]-username,[1] - password
			// ! Buffer.from - 翻译二进制文字 Buffer.from(xx,'base64'); 'base64'->格式
			var auth = new Buffer.from(authHeader.split(' ')[1], 'base64')
				.toString()
				// !用的是':'而不是分号！
				.split(':');

			var username = auth[0];
			var password = auth[1];

			User.findOne({ username: username })
				.then((user) => {
					if (user === null) {
						var err = new Error('User not exist!');
						err.status = 403;
						return next(err);
					} else if (user.password != password) {
						var err = new Error('User or Password is incorrect!');
						err.status = 403;
						return next(err);
					} else {
						if (user.username === username && user.password === password) {
							// * use the res.cookie here
							// 设置一个新的cookie
							// res.cookie('user', 'admin', { signed: true });
							req.session.user = 'authenticated';
							res.statusCode = 200;
							res.setHeader('Content-Type', 'text/plain');
							res.end('You are authenticated!');
						}
					}
				})
				.catch((err) => {
					next(err);
				});
		}
	} else {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		res.end('You are already authenticated!');
	}
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
