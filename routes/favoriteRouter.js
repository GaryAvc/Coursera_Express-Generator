var express = require('express');
var favoriteRouter = express.Router();
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var Favorite = require('../models/favorite');
var User = require('../models/user');
var Dish = require('../models/dishes');
var cors = require('./cors');

favoriteRouter
	.route('/')
	.get(authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id }, (err, favorite) => {
			if (err) {
				return next(err);
			} else if (favorite === null) {
				return next(new Error("The user don't have any favorite food yet"));
			}
		})
			.populate('user')
			.populate('dishes')
			.then(
				function(favorite) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorite);
				},
				(err) => {
					return next(err);
				}
			);
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id }, (err, favorite) => {
			if (err) {
				return next(err);
			} else if (favorite === null) {
				var favorite = new Favorite({});
			}

			favorite.user = req.user._id;
			favorite.dishes = favorite.dishes.concat(req.body);
			favorite
				.save()
				.then(function(favorite) {
					Favorite.findById(favorite._id).then((favorite) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					});
					// * --- mongoose.population
				})
				.catch((err) => {
					next(err);
				});
		});
	})
	.put(authenticate.verifyUser, (req, res) => {
		res.statusCode = 403;
		res.setHeader('Content-Type', 'application/json');
		res.end('PUT operation not supported');
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id }, (err, favorite) => {
			if (err) {
				return next(err);
			} else if (favorite === null) {
				return next(new Error("The user don't have any favorite food yet"));
			} else {
				Favorite.remove({})
					.then(
						function(resp) {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(resp);
						},
						(err) => next(err)
					)
					.catch((err) => {
						next(err);
					});
			}
		});
	});
favoriteRouter
	.route('/:dishId')
	.get(cors.cors, authenticate.verifyUser, (req, res) => {
		Favorite.findOne({ user: req.user._id })
			.then(
				(favorites) => {
					if (!favorites) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						return res.json({ exists: false, favorites: favorites });
					} else {
						if (favorites.dishes.indexOf(req.params.dishId) < 0) {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							return res.json({ exists: false, favorites: favorites });
						} else {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							return res.json({ exists: true, favorites: favorites });
						}
					}
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})
	.post(authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id }, (err, favorite) => {
			if (err) {
				return next(err);
			} else if (favorite === null) {
				var favorite = new Favorite({});
			}

			favorite.user = req.user._id;
			favorite.dishes.push(req.params.dishId);
			favorite
				.save()
				.then(function(favorite) {
					Favorite.findById(favorite._id)
						.populate('user')
						.populate('dishes')
						.then((favorites) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorite);
						});
					Favorite.findById(favorite._id).then((favorite) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					});
					// * --- mongoose.population
				})
				.catch((err) => {
					next(err);
				});
		});
	})
	.put((req, res) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end('PUT operation not supported');
	})
	.delete(authenticate.verifyUser, (req, res, next) => {
		Favorite.findOne({ user: req.user._id }, (err, favorite) => {
			if (err) {
				return next(err);
			} else if (favorite === null) {
				return next(new Error("The user don't have any favorite food yet"));
			} else if (favorite.dishes.indexOf(req.params.dishId) !== -1) {
				favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId), 1);
				favorite.save();
				Favorite.findById(favorite._id)
					.populate('user')
					.populate('dishes')
					.then((favorites) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					})
					.then(
						function(favorite) {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorite);
						},
						(err) => {
							return next(err);
						}
					);
			} else {
				return next(new Error('User do not contain this favorite food'));
			}
		});
	});

module.exports = favoriteRouter;
