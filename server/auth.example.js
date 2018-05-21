/*	Setup credentials and rename this file `auth.js`.
	`auth.js` is in `.gitignore` and should never be
	commited to source control.
*/

exports.server = {
	port: 8888
};

exports.mongodb = {
	url: 'mongodb://127.0.0.1:27017/dbname'
};
