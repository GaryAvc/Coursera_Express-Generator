const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const authenticate = require('../authenticate');

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

var storageManager = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'public/images');
	},
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	}
});

var imagefileFilter = (req, file, cb) => {
	if (!file.originalname.match(/\.(png)$/)) {
		return cb(new Error('image only'), false);
	} else {
		cb(null, true);
	}
};

var upload = multer({ storage: storageManager, fileFilter: imagefileFilter });

uploadRouter
	.route('/')
	.get((req, res, next) => {
		res.statusCode = 403;
		res.end(' operation not supported');
	})
	.post(upload.single('imageFile'), (req, res, next) => {
		res.end('successfully upload the image');
	})
	.put((req, res, next) => {
		res.statusCode = 403;
		res.end(' operation not supported');
	})
	.delete((req, res, next) => {
		res.statusCode = 403;
		res.end(' operation not supported');
	});

module.exports = uploadRouter;
