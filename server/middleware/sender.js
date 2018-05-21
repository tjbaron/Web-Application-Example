
module.exports = function(req, resp, next) {
	if (req.jsonOut) {
		resp.setHeader('Content-Type', 'application/json; charset=utf-8');
		var data = JSON.stringify(req.jsonOut);
		resp.end(data);
	} else if (req.textOut) {
		resp.setHeader('Content-Type', 'text/html; charset=utf-8');
		resp.end(req.textOut);
	} else {
		resp.setHeader('Content-Type', 'application/json; charset=utf-8');
		resp.end(JSON.stringify({error: 'Invalid endpoint.', code: 685}));
	}
};
