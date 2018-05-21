
var pages = {
	'': require('./pages/lesson'),
	'edit': require('./pages/editlesson'),
	'kanji': require('./pages/kanji')
}

exports.pageName = null;
exports.page = null;

exports.set = function(path) {
	if (window.location.pathname !== path && path) {
		window.history.pushState({}, '', path);
		// These are for Google Analytics
		//ga('set', 'page', window.location.pathname);
		//ga('send', 'pageview');
	}
	loadCurrentPage();
};

window.onpopstate = function(e) {
	loadCurrentPage();
};

function loadCurrentPage() {
	var p = decodeURIComponent(window.location.pathname);
	var parts = p.split('/');
	if (exports.pageName !== parts[parts.length-1]) {
		exports.pageName = parts[parts.length-1];
		var pg = pages[exports.pageName];
		if (pg) {
			if (exports.page) exports.page.destroy();
			exports.page = pg;
			var m = document.getElementsByTagName('main')[0];
			m.innerHTML = '';
			pg.setup(parts, m);
			setTimeout(function(){document.body.scrollTop = 0;},50);
		} else {
			console.log();
			//alert('Page Not Found!');
		}
	}
}
