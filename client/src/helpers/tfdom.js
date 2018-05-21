
var dom = {
	'get': function(id) {
		if (arguments.length === 1) {
			return document.getElementById(id);
		} else {
			var eles = {};
			for (var i=0; i<arguments.length; i++) {
				eles[arguments[i]] = document.getElementById(arguments[i]);
			}
			return eles;
		}
	},
	'create': function(tag, info) {
		var tg = null;
		if (info && info.ns) {
			tg = document.createElementNS(info.ns, tag);
		} else {
			tg = document.createElement(tag);
		}
		if (info) {
			this.update(tg, info);
		}
		return tg;
	},
	'update': function(tg, info) {
		for (var e in info) {
			if (e === 'innerHTML' || e === 'innerText' || e === 'children' || e === 'parent') {
				continue;
			}
			tg.setAttribute(e, info[e]);
		}
		if (info.innerHTML) {
			tg.innerHTML = info.innerHTML;
		}
		if (info.innerText) {
			tg.appendChild(document.createTextNode(info.innerText));
		}
		if (info.children) {
			for (var i=0; i<info.children.length; i++) {
				tg.appendChild(info.children[i]);
			}
		}
		if (info.parent) {
			info.parent.appendChild(tg);
		}
		return this;
	},
	'on': function(a, b, c, d) {
		return (function(ele, event, action, downtree) {
			if (!downtree) downtree = false;
			if (event === 'click' && 'ontouchstart' in document.documentElement) {
				event = 'touchend';
			}
			ele.addEventListener(event, action, downtree);
			return {
				remove: function() {
					ele.removeEventListener(event, action, downtree);
				}
			}
		})(a, b, c, d);
	},
	'addClass': function(el, cl) {
		module.exports.removeClass(el, cl);
		el.setAttribute('class', el.getAttribute('class')+' '+cl);
	},
	'removeClass': function(el, cl) {
		el.setAttribute('class', (el.getAttribute('class')||'').replace(new RegExp('\\s*'+cl+'(\\s*)'), '$1').replace(/^\s+/, ''));
	},
	'getPosition': function(ele) {
		var last = [0,0];
		if (ele.parentNode) last = this.getPosition(ele.parentNode);
		if (ele.offsetLeft) last[0] += ele.offsetLeft;
		if (ele.offsetTop) last[1] += ele.offsetTop;
		return last;
	},
	'getScroll': function(ele) {
		var last = [0,0];
		if (ele.parentNode) last = this.getScroll(ele.parentNode);
		if (ele.scrollLeft) last[0] += ele.scrollLeft;
		if (ele.scrollTop) last[1] += ele.scrollTop;
		return last;
	}
}

if (module && module.exports) module.exports = dom;
