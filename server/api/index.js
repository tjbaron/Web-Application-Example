
var fs = require('fs');
var url = require('url');

var console = require('../console');

var apiRoot = '/api/v1/';
exports.commands = {};

/*	Adds our endpoints. This is done by scanning the directory
	rather than something hard-coded.
*/
exports.init = function(express) {
	var folder = fs.readdirSync(__dirname);
	for (let name of folder) {
		name = name.split('.js');
		if (name.length !== 2 || name[0] === 'index') continue;
		name = name[0];
		let cmd = require('./'+name);
		let [route, type] = name.split('.');

		exports.commands[name] = cmd;
		var path = apiRoot+route;
		console.log(`Adding ${type.toUpperCase()} Endpoint: `, path);
		if (cmd.raw) {
			express.use(path, cmd.func);
		} else {
			var prep = commandPrepare.bind(null, cmd);
			if (cmd.post) express.post(path, prep);
			else express.get(path, prep);
		}
	}
}

// Ensures the request is correctly formatted for the endpoint.
// The full version also ensures authentication, gets server cached
// data and more.
function commandPrepare(cmd, req, resp, next) {
	var query = {};
	if (cmd.get) query = url.parse(req.url, true).query;
	if (cmd.post) query = req.body;
	var sentData = {};
	if (cmd.shape) {
		// Simplified for example.
		// Full version handles Regex etc.
		for (var e in cmd.shape) {
			if (!query[e]) {
				req.jsonOut = {error: 'Missing parameter: '+e, code: 222};
				return next();
			} else {
				sentData[e] = query[e];
			}
		}
	}

	if (cmd.auth && !req.username) {
		req.jsonOut = {error: 'Login required', code: 223};
		return next();
	}

	cmd.func.call(req, sentData, (outData) => {
		req.jsonOut = outData;
		next();
	});
}
