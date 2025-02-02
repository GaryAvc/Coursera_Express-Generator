const express = require('express');
const bodyparser = require('body-parser');

const promoRouter = express.Router();

const authenticate = require('../authenticate');
const promotions = require('../models/promotions');

const cors = require('./cors');

promoRouter.use(bodyparser.json());

promoRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, function(req, res, next) {
		promotions
			.find(req.query)
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

	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		function(req, res, next) {
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
		}
	)

	.put(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {
		res.statusCode = 403;
		res.end('PUT operation not supported');
	})
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
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
		}
	);

promoRouter
	.route('/:promotionsId')
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, function(req, res, next) {
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

	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		function(req, res, next) {
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
		}
	)

	.put(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {
		res.statusCode = 403;
		res.end('PUT operation not supported');
	})
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
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
		}
	);

module.exports = promoRouter;
