var console = require('../console');
var db = require('../database');

exports.auth = true;
exports.post = true;
exports.shape = {
	name: /.{3,50}/,
	words: true
};

exports.func = function(data, callback) {
	// Simple, because data is validated by shape and
	// only the owner can modify the data, and they're
	// permitted to change it any way they like.
	db.Lesson.findOneAndUpdate({name: data.name, username: this.username}, data, {upsert: true, new: true}, function(err, res) {
		if (!err) callback({message: 'Ok'});
		else callback({error: 'Update failed', code: 748});
	});
}
