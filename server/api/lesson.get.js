var console = require('../console');
var db = require('../database');

exports.auth = true;
exports.get = true;
exports.shape = {
	name: /.{3,50}/
};

exports.func = function(data, callback) {
	db.Lesson.findOne({name: data.name, username: this.username}, 'name words', function(err, res) {
		if (res) callback(res);
		else callback({error: 'Lesson not found', code: 748});
	});
}
