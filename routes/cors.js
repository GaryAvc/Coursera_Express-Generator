const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
	'http://localhost:3000',
	'https://localhost:3443',
	'http://GARY:3001'
];

var corsOptionsDelegate = (req, callback) => {
	var corsOptions;
	// indexOf - array operation,如果没找到就-1，找到了就return index
	if (whitelist.indexOf(req.header('Origin')) !== -1) {
		corsOptions = { origin: true };
	} else {
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
