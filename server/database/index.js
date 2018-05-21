
var mongoose = require('mongoose');
var console = require('../console');
var auth = require('../auth').mongodb;
var formats = require('./schema');

exports.init = function(resolve, reject) {
	if (!auth || !auth.url) {
		return console.error('No MongoDB specified in `auth.js`.');
	}
	
	for (var name in formats) {
		var schema = mongoose.Schema(formats[name]);
		exports[name] = mongoose.model(name, schema);
		console.log('Database schema `'+name+'` added.');
	}
	
	mongoose.connect(auth.url, {autoReconnect: true});
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'Connection Error:'));
	db.once('open', function() {
		console.log('Connected to MongoDB.');
		resolve();
	});
}
