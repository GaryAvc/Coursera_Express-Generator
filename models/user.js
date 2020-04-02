// ! 利用mongoose和passportLocalMongoose来创建一个user的schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	// * --- mongoose.population
	firstname: {
		type: String,
		default: ''
	},
	lastname: {
		type: String,
		default: ''
	},
	facebookId: String,
	// * --- mongoose.population
	admin: {
		type: Boolean,
		default: false
	}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
