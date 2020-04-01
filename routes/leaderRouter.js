const express = require('express');
const leaderRouter = express.Router();

const bodyParser = require('body-parser');
const leaders = require('../models/leaders');

const authenticate = require('../authenticate');

leaderRouter.use(bodyParser.json());

leaderRouter
	.route('/')
	.get((req, res, next) => {
		leaders
			.find({})
			.then(
				(leader) => {
					res.statusCode = 200;
					res.setHeader('Content-type', 'application/json');
					res.json(leader);
				},
				(err) => {
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		res.end('PUT operation not allowed');
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		leaders
			.create(req.body)
			.then(
				(leader) => {
					res.statusCode = 200;
					res.setHeader('Content-type', 'application/json');
					res.json(leader);
				},
				(err) => {
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	})
	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			leaders
				.remove({})
				.then(
					(resp) => {
						res.statusCode = 200;
						res.setHeader('Content-type', 'application/json');
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

leaderRouter
	.route('/:leaderid')
	.get((req, res, next) => {
		leaders
			.findById(req.params.leaderid)
			.then(
				(leader) => {
					res.statusCode = 200;
					res.setHeader('Content-type', 'application/json');
					res.json(leader);
				},
				(err) => {
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	})
	.put(authenticate.verifyUser, (req, res, next) => {
		res.end('PUT operation not allowed');
	})
	.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
		leaders
			.findByIdAndUpdate(req.params.leaderid, { $set: req.body })
			.then(
				(leader) => {
					res.statusCode = 200;
					res.setHeader('Content-type', 'application/json');
					res.json(leader);
				},
				(err) => {
					next(err);
				}
			)
			.catch((err) => {
				next(err);
			});
	})
	.delete(
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			leaders
				.findByIdAndRemove(req.params.leaderid)
				.then(
					(resp) => {
						res.statusCode = 200;
						res.setHeader('Content-type', 'application/json');
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

module.exports = leaderRouter;
