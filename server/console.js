/*	Colorful logging to the command line!
	... or Papertrail.
*/

var tracer = require('tracer');
var colors = require('colors');

module.exports = tracer.console({
	level: 'log',
	format : '{{title}}: ({{file}}:{{line}}) {{message}}',
	filters : {
		log : colors.grey,
		trace : colors.magenta,
		debug : colors.blue,
		info : colors.green,
		warn : colors.yellow,
		error : colors.red
	}
});
