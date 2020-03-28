const express = require('express');
const bodyparser = require('body-parser');

const promoRouter = express.Router();

const authenticate = require('../authenticate');
const promotions = require('../models/promotions');

promoRouter.use(bodyparser.json());

promoRouter
	.route('/')
	.get(function(req, res, next) {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
		promotions
			.find({})
			.then(
				(promotion) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					// * 这里因为从promotions.js里返回的是一个json文件， 所以要用res.json!
					res.json(promotion);
				},
				(err) => {
					// *利用next()把err传到app.js里 最后一期handle
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	})

	.post(authenticate.verifyUser, function(req, res, next) {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
		promotions
			.create(req.body)
			.then(
				(promotion) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(promotion);
				},
				(err) => {
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	})

	.put(authenticate.verifyUser, function(req, res, next) {
		res.statusCode = 403;
		res.end('PUT operation not supported');
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
		// * 使用了remove()以后，也会返回一个response,可以选择把这个response也返回回去
		promotions
			.remove({})
			.then(
				(resp) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(resp);
				},
				(err) => {
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	});

promoRouter
	.route('/:promotionsId')

	.get(function(req, res, next) {
		// * 需要通过req.params.xxxId 来获取网址中的id
		promotions
			.findById(req.params.promotionsId)
			.then(
				(promotion) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					// * 这里因为从promotions.js里返回的是一个json文件， 所以要用res.json!
					res.json(promotion);
				},
				(err) => {
					// *利用next()把err传到app.js里 最后一期handle
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	})

	.post(authenticate.verifyUser, function(req, res, next) {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
		promotions
			.findByIdAndUpdate(req.params.promotionsId, {
				// * 1. 这是一个json的set 所以要用{}
				// * 2. req.body里面是很多部分所以要用 $set
				$set: req.body
			})
			.then(
				(promotion) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(promotion);
				},
				(err) => {
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	})

	.put(authenticate.verifyUser, function(req, res, next) {
		res.statusCode = 403;
		res.end('PUT operation not supported');
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
		// * 使用了remove()以后，也会返回一个response,可以选择把这个response也返回回去
		promotions
			.findByIdAndRemove(req.params.promotionsId)
			.then(
				(resp) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(resp);
				},
				(err) => {
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	});

module.exports = promoRouter;
