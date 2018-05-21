
var $ = require('./tfdom');
var colors = require('./colors');

module.exports = function(mainEle) {
	setTimeout(()=>{
		mainEle.style.opacity = '1';
		mainEle.style.marginTop = '0px';
	}, 200);
};

module.exports.loading = function(area) {
	var sp;
	$.create('div', {parent: area, children: [
		sp = $.create('object', {data: 'https://tflanguage.com/svg/spinner.svg'})
	], style: 'position: relative; margin: 0px auto; width: 120px; height: 120px; overflow: hidden;'});

	function updateColor() {
		sp = sp.contentDocument;
		var pths = sp.getElementsByTagName('circle');
		console.log(pths.length);
		for (var i=0; i<pths.length; i++) {
			if (pths[i].getAttribute('class') === 'color') pths[i].setAttribute('stroke', colors.highlight);
		}
	}
	sp.onload = updateColor;
};
