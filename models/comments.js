const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true
		},
		comment: {
			type: String,
			required: true
		},
		author: {
			// * --- mongoose.population
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
			// * --- mongoose.population
		},
		dish: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Dish'
		}
	},
	{
		timestamps: true
	}
);

var Comments = mongoose.model('Comment', commentSchema);
module.exports = Comments;
