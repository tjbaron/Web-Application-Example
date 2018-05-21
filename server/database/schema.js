
var mongoose = require('mongoose');
var Types = mongoose.Schema.Types;

exports.Lesson = {
	name: {type: String, index: true},
	username: String,
	words: [{
		_id: false,
		word: String,
		pronunciation: String,
		translations: [{
			language: String,
			text: String
		}]
	}]
};
