const express = require('express');
const leaderRouter = express.Router();

const bodyParser = require('body-parser');
const leaders = require('../models/leaders');

const authenticate = require('../authenticate');

const cors = require('./cors');

leaderRouter.use(bodyParser.json());

leaderRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, (req, res, next) => {
		leaders
			.find(req.query)
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
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.end('PUT operation not allowed');
	})
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
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
		}
	)
	.delete(
		cors.corsWithOptions,
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
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, (req, res, next) => {
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
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.end('PUT operation not allowed');
	})
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
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
		}
	)
	.delete(
		cors.corsWithOptions,
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
