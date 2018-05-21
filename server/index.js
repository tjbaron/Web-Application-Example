
var http = require('http');
var express = require('express')();
var bodyParser = require('body-parser');

var auth = require('./auth');
var console = require('./console');
var database = require('./database');
var api = require('./api');

var middlewareAuth = require('./middleware/authenticate');
var middlewareSend = require('./middleware/sender');

var app = http.createServer(express);

Promise.all([
	new Promise(database.init),
]).then(() => {
	// Mount middleware
	express.use(bodyParser.json()); 
	express.use(middlewareAuth); 
	api.init(express);
	express.use(middlewareSend); 

	console.log('Listening on port `'+auth.server.port+'`.');
	app.listen(auth.server.port);
}).catch((err) => {
	console.error(err);
});
