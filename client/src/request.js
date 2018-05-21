
var cmds = require('./commands');

var notAsync = false;
var req = module.exports = exports = function(url, data, callback) {
	if (!callback) callback = data;
	var req = new XMLHttpRequest();
	if (module.exports.type) {
		req.responseType = module.exports.type;
		module.exports.type = null;
	}
	req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
			callback(req);
		}
	};
	if (arguments.length === 2) {
		req.open('GET', url, notAsync?false:true);
		req.send();
	} else if (arguments.length === 3) {
		req.open('POST', url, notAsync?false:true);
		req.send(data);
	}
	notAsync = false;
};

function runCommand(data, callback) {
	var path = 'https://tflanguage.com/api/' + (this.heavy?'b/':'a/') + this.name + '?';

	var qp = [];
	for (var e in data) {
		if (e === 'data') continue;
		qp.push(encodeURIComponent(e)+'='+encodeURIComponent(data[e]));
	}
	qp.push('currentTime='+Date.now());

	path += qp.join('&');
	
	if (this.post) {
		var d = data.data;
		data.data = null;
		req(path, d, commandCallback.bind(null, callback));
	} else {
		req(path, commandCallback.bind(null, callback));
	}
}

function commandCallback(callback, req) {
	var resp = JSON.parse(req.responseText);
	callback(resp);
}

for (var e in cmds) {
	cmds[e].name = e;
	exports[e] = runCommand.bind(cmds[e]);
}
