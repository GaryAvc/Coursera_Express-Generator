var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalStrategy = require('passport-local-mongoose');

var User = new Schema({
	admin: {
		type: Boolean,
		default: false
	}
});

User.plugin(passportLocalStrategy);

module.exports = mongoose.model('User', User);
