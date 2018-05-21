// Run with: npm test

var assert = require('assert');
var http = require('http');

function get(path, callback) {
	var req = http.request({
		hostname: 'localhost',
		port: 8888,
		path: '/api/v1/'+path
	}, function(response) {
		var data = '';
		response.on('data', function(chunk) {
			data += chunk;
		});
		response.on('end', function() {
			callback(JSON.parse(data));
		});
	});
	req.end();
}

function post(path, body, callback) {
	body = JSON.stringify(body);
	var req = http.request({
		hostname: 'localhost',
		port: 8888,
		method: 'POST',
		path: '/api/v1/'+path,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(body)
		}
	}, function(response) {
		var data = '';
		response.on('data', function(chunk) {
			data += chunk;
		});
		response.on('end', function() {
			callback(JSON.parse(data));
		});
	});
	req.write(body);
	req.end();
}

describe('Create Lesson', function(callback) {
	it('Can be created', function(done) {
		post('lesson', {
			name: 'ValidName',
			words: [{word: 'word1'}, {word: 'word2'}]
		}, function(result) {
			assert.equal(result.message, 'Ok');
			done();
		});
	});
});

describe('Load Lesson', function(callback) {
	it('Can load created test', function(done) {
		get('lesson?name=ValidName', function(result) {
			assert(!result.error, 'Loaded without error');
			done();
		});
	});
	it('Can not load test that does not exist', function(done) {
		get('lesson?name=InvalidName', function(result) {
			assert(result.error, 'Received expected error');
			done();
		});
	});
});
