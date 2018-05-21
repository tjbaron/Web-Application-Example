// REMOVED FROM EXAMPLE

/*	This uses a redis cache and was therefore removed and replaced
	with a simple placeholder to simplify the overall example code.
*/

module.exports = function(req, resp, next) {
	req.username = "john";
	req.usertype = "admin";
	next();
};
