const express = require('express');
const bodyParser = require('body-parser');

// -- add mongodb part --
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
// -- end mongodb part --

// * -- start of token practice --
const authenticate = require('../authenticate');
// * -- end   of token practice --

// router code
const dishRouter = express.Router();

// * --- cors part ---
const cors = require('./cors');
// * --- cors part ---

dishRouter.use(bodyParser.json());

// mount later
dishRouter
	.route('/')
	// * --- cors part ---
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	// * --- cors part ---
	.get(cors.cors, (req, res, next) => {
		// -- add mongodb part --
		Dishes.find(req.query)
			// * --- mongoose.population
			.populate('comments.author')
			// * --- mongoose.population
			.then(
				function(dishes) {
					res.statusCode = 200;
					// return a json
					res.setHeader('Content-Type', 'application/json');
					// take json as string and send it back to client
					res.json(dishes);
				},
				function(err) {
					next(err);
				}
			)
			.catch(function(err) {
				next(err);
			});

		// -- end mongodb part --
	})

	// todo 先会运行authenticate.verifyUser,如果成功继续运行，如果失败passport.authenticator会处理
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			// -- add mongodb part --
			Dishes.create(req.body)
				.then(
					function(dish) {
						console.log('dish created');
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);
					},
					(err) => next(err)
				)
				.catch((err) => {
					next(err);
				});
			// -- end mongodb part --
		}
	)
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /dish');
	})
	// delete()
	// dangerous operation - should be only restriced to certain user
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			// * Verify Admin user
			// * Verify Admin user
			// -- add mongodb part --
			Dishes.remove({})
				// send some response
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
			// -- end mongodb part --
		}
	);

dishRouter
	.route('/:dishid')
	// * --- cors part ---
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	// * --- cors part ---
	// test for next()
	// the modified req,res will be pasted on to the app.get
	.get(cors.cors, (req, res, next) => {
		// -- add mongodb part --

		Dishes.findById(req.params.dishid)
			// * --- mongoose.population
			.populate('comments.author')
			// * --- mongoose.population
			.then(
				function(dishes) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(dishes);
				},
				function(err) {
					next(err);
				}
			)
			.catch(function(err) {
				next(err);
			});

		// -- end mongodb part --
	})
	// post()
	// the req.body will contain the parsered information
	// json parser into the req.body - it has name, description, etc
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /dish');
	})
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			// -- add mongodb part --
			Dishes.findByIdAndUpdate(
				req.params.dishid,
				{
					$set: req.body
				},
				{
					new: true
				}
			)
				.then(
					function(dishes) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dishes);
					},
					function(err) {
						next(err);
					}
				)
				.catch(function(err) {
					next(err);
				});

			// -- end mongodb part --
		}
	)
	// delete()
	// dangerous operation - should be only restriced to certain user
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			// -- add mongodb part --

			Dishes.findByIdAndRemove(req.params.dishid)
				.then(
					function(dishes) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dishes);
					},
					function(err) {
						next(err);
					}
				)
				.catch(function(err) {
					next(err);
				});

			// -- end mongodb part --
		}
	);

// mount later
dishRouter
	.route('/:dishid/comments')
	// * --- cors part ---
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	// * --- cors part ---
	.get(cors.cors, (req, res, next) => {
		// -- add mongodb part --
		Dishes.findById(req.params.dishid)
			// * --- mongoose.population
			.populate('comments.author')
			// * --- mongoose.population
			.then(
				function(dish) {
					if (dish != null) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish.comments);
					} else {
						// !! 这里return的err会在app.js里的err handler被处理
						err = new Error('Dish' + req.params.dishid + ' not exists');
						err.status = 404;
						return next(err);
					}
				},
				function(err) {
					next(err);
				}
			)
			.catch(function(err) {
				next(err);
			});
		// -- end mongodb part --
	})

	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		// -- add mongodb part --
		Dishes.findById(req.params.dishid)
			.then(
				function(dish) {
					if (dish != null) {
						// * --- mongoose.population
						// todo 把这个req的user_id放入到req.body.author
						// todo 因为在某个dish下面post comment,包含rating, comment, author
						// todo ,但是author不应该由客户写入，应该自动由server写入，根据authentication
						req.body.author = req.user._id;
						// * --- mongoose.population

						// 先把新的req的body push到comments里
						// save
						// 如果成功的话 那就return
						dish.comments.push(req.body);
						dish
							.save()
							.then(function(dish) {
								// * --- mongoose.population
								// todo 这里populate是为了res.json(dish) 展现返回的post之后的页面
								// todo	.populate('comments.author')是指comment这个schema里面的author这个schema条目
								// todo
								Dishes.findById(dish._id)
									.populate('comments.author')
									.then((dish) => {
										res.statusCode = 200;
										res.setHeader('Content-Type', 'application/json');
										res.json(dish);
									});
								// * --- mongoose.population
							})
							.catch((err) => {
								next(err);
							});
					} else {
						// !! 这里return的err会在app.js里的err handler被处理
						err = new Error('Dish' + req.params.dishid + ' not exists');
						err.status = 404;
						return next(err);
					}
				},
				(err) => next(err)
			)
			.catch((err) => {
				next(err);
			});
		// -- end mongodb part --
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /dish');
	})
	// delete()
	// dangerous operation - should be only restriced to certain user
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			// -- add mongodb part --
			Dishes.findById(req.params.dishid)
				// send some response
				.then(
					function(dish) {
						if (dish != null) {
							//    删除sub-documents 只能用一个循环 + .remove();
							for (var i = dish.comments.length - 1; i >= 0; i--) {
								// 因为i是从0到length， 但是对应的_id是自动生成的，所以需要 通过i找到id， 再利用id确定某一个特定的，最后,remove()
								dish.comments.id(dish.comments[i]._id).remove();
							}
							// ！！当完成push，或者remove之后都需要.save()
							dish.save().then(
								function(dish) {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json(dish.comments);
								},
								(err) => next(err)
							);
						} else {
						}
					},
					(err) => next(err)
				)
				.catch((err) => {
					next(err);
				});
			// -- end mongodb part --
		}
	);

dishRouter
	.route('/:dishid/comments/:commentid')
	// * --- cors part ---
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	// * --- cors part ---
	// test for next()
	// the modified req,res will be pasted on to the app.get
	.get(cors.cors, (req, res, next) => {
		// -- add mongodb part --

		Dishes.findById(req.params.dishid)
			// * --- mongoose.population
			.populate('comments.author')
			// * --- mongoose.population
			.then(
				function(dish) {
					if (dish != null && dish.comments.id(req.params.commentid) != null) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish.comments.id(req.params.commentid));
					} else if (dish == null) {
						// !! 这里return的err会在app.js里的err handler被处理
						err = new Error('Dish' + req.params.dishid + ' not exists');
						err.status = 404;
						return next(err);
					} else {
						err = new Error('Dish' + req.params.commentid + ' not exists');
						err.status = 404;
						return next(err);
					}
				},
				function(err) {
					next(err);
				}
			)
			.catch(function(err) {
				next(err);
			});

		// -- end mongodb part --
	})
	// post()
	// the req.body will contain the parsered information
	// json parser into the req.body - it has name, description, etc
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /dish');
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		// -- add mongodb part --

		Dishes.findById(req.params.dishid).then((dish) => {
			if (dish != null && dish.comments.id(req.params.commentid) != null) {
				authenticate.verifyOriginUser(
					req.user._id,
					dish.comments.id(req.params.commentid).author._id,
					next
				);

				if (req.body.rating) {
					// TODO the most simply way to update sub-document
					dish.comments.id(req.params.commentid).rating = req.body.rating;
				}
				if (req.body.comment) {
					dish.comments.id(req.params.commentid).comment = req.body.comment;
				}
				// * 在update和push之后都需要做一个.save()的操作
				dish
					.save()
					.then(function(dish) {
						// * --- mongoose.population
						Dishes.findById(dish._id)
							.populate('comments.author')
							.then((dish) => {
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								res.json(dish);
							});
						// * --- mongoose.population
					})
					.catch((err) => {
						next(err);
					});
			} else if (dish == null) {
				// * 这里return的err会在app.js里的err handler被处理
				err = new Error('Dish' + req.params.dishid + ' not exists');
				err.status = 404;
				return next(err);
			} else {
				err = new Error('Dish' + req.params.commentid + ' not exists');
				err.status = 404;
				return next(err);
			}
		});

		// -- end mongodb part --
	})
	// delete()
	// dangerous operation - should be only restricted to certain user
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		// -- add mongodb part --
		Dishes.findById(req.params.dishid)
			// send some response
			.then(
				function(dish) {
					if (dish != null && dish.comments.id(req.params.commentid) != null) {
						// console.log(dish.comments.id(req.params.commentid).author._id);
						// console.log(req.user._id);
						authenticate.verifyOriginOrAdminUser(
							req.user._id,
							dish.comments.id(req.params.commentid).author._id,
							req.user.admin,
							next
						);

						dish.comments.id(req.params.commentid).remove();
						// *当完成push，或者remove之后都需要.save()
						dish.save().then(
							function(dish) {
								// * --- mongoose.population
								Dishes.findById(dish._id)
									.populate('comments.author')
									.then((dish) => {
										res.statusCode = 200;
										res.setHeader('Content-Type', 'application/json');
										res.json(dish);
									});
								// * --- mongoose.population
							},
							(err) => next(err)
						);
					} else if (dish == null) {
						// * 这里return的err会在app.js里的err handler被处理
						err = new Error('Dish' + req.params.dishid + ' not exists');
						err.status = 404;
						return next(err);
					} else {
						err = new Error('Dish' + req.params.commentid + ' not exists');
						err.status = 404;
						return next(err);
					}
				},
				(err) => next(err)
			)
			.catch((err) => {
				next(err);
			});

		// -- end mongodb part --
	});

module.exports = dishRouter;
