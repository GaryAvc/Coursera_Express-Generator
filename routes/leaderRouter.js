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
	.post(authenticate.verifyUser, (req, res, next) => {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
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
	.delete(authenticate.verifyUser, (req, res, next) => {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
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
	});

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
	.post(authenticate.verifyUser, (req, res, next) => {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
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
	.delete(authenticate.verifyUser, (req, res, next) => {
		// * Verify Admin user
		authenticate.verifyAdmin(req.user.admin, next);
		// * Verify Admin user
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
	});

module.exports = leaderRouter;
