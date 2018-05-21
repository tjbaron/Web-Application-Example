
var fade = require('../helpers/fade');
var cache = require('../cache');
var kanji = require('../kanji');


var $ = require('../helpers/tfdom');
var svgns = "http://www.w3.org/2000/svg";
var strokes = [];
var paths = [];
var averages = [];

var currentStroke = 0;
 
var lastTouch = null;
var myStroke = null;
var preview = null;

var details = null;
var holder = null;
var svg = null;

//var consistentAudio;

exports.setup = function(path, area) {
	$.create('div', {innerText: 'Click to Continue', parent: area, style: 'position: absolute; left: 50%; top: 50%; width: 200px; line-height: 50px; font-size: 24px; margin-left: -100px; margin-top: -25px;'});

	area.onclick = function() {
		area.innerHTML = '';
		area.onclick = null;

		details = $.create('div', {parent: area, class: 'fullscreen', style: 'height: 50px; bottom: unset;'});
		holder = $.create('div', {parent: area, class: 'fullscreen', style: 'top: 50px; bottom: 50px;'});
		svg = $.create('svg', {ns: svgns, viewBox: '0 0 1024 1024', parent: holder, style: 'position: relative; display: block; margin: 0px auto; height: 100%; width: 100%; background: white;'});
		addToolbar(area);

		nextKanji();

		fade(details);
		fade(holder);
	}
};

exports.destroy = function() {
	document.body.onkeydown = null;
};

function addToolbar(area) {
	var tb = $.create('div', {parent: area, class: 'toolbar'});
	tb.ontouchstart = tb.onmouseup = tb.onmousedown = tb.onclick = function(e) { e.preventDefault(); e.stopPropagation(); }

	var hintBtn = $.create('div', {parent: tb, innerText: '(H)int', class: 'toolbarButton'});
	hintBtn.onclick = previewCharacter;

	var skipBtn = $.create('div', {parent: tb, innerText: '(S)kip', class: 'toolbarButton'});
	skipBtn.onclick = skipCurrent;

	document.body.onkeydown = function(e) {
		if (e.keyCode === 72) previewCharacter();
		if (e.keyCode === 83) skipCurrent();
	}
}

function skipCurrent() {
	previewCount = 0;
	currentStroke = paths.length-1;
	strokeDone();
};

function getPos(e) {
	if (e.touches && e.touches.length > 0) {
		e = e.touches[0]
	}
	var hei = holder.offsetHeight;
	var wid = holder.offsetWidth;
	console.log(hei);
	if (wid < hei) hei = wid;
	var speed = 1024/hei;
	var extra = speed*(wid-hei)/2;
	return {
		x: Math.round((e.clientX-$.getPosition(svg)[0]) * speed)-extra,
		y: Math.round((e.clientY-$.getPosition(svg)[1]) * speed)
	}
}

function fingerDown(e) {
	e.preventDefault();
	lastTouch = getPos(e);
	myStroke = [lastTouch];
}

function fingerMove(e) {
	e.preventDefault();
	if (!myStroke) return;
	var thisTouch = getPos(e);
	//d += 'L'+thisTouch.x+','+thisTouch.y;
	if (Math.abs(thisTouch.x-lastTouch.x) > 5 || Math.abs(thisTouch.y-lastTouch.y) > 5) {
		myStroke.push(thisTouch);
		lastTouch = thisTouch;
	}
	preview.setAttribute('d', pointsToSvg(myStroke));
}

function angAbs(dif) {
	dif = Math.abs(dif);
	if (dif > 180) dif = Math.abs(dif-360);
	return dif;
}
function fingerUp(e) {
	e.preventDefault();
	if (!myStroke) return;
	if (myStroke.length === 1) {
		//previewCharacter();
	} else {
		if (!averages[currentStroke]) return; 
		var wanted = getAngles(svgToPoints(averages[currentStroke]));
		var drawn = getAngles(myStroke);
		console.log(wanted);
		console.log(drawn);
		if (wanted.length === drawn.length) {
			var good = true;
			for (var i=0; i<wanted.length; i++) {
				//console.log('Ang: ', angAbs(wanted[i]-drawn[i]));
				if (angAbs(wanted[i]-drawn[i]) > 50) {
					good = false;
					break;
				}
			}
			if (good) strokeDone();		
		} else if (wanted.length > 1 && drawn.length > 1 && drawn.length < 4) {
			var j=0;
			var matches = 0;
			for (var k=0; k<wanted.length; k++) {
				for (; j<drawn.length; j++) {
					if (angAbs(wanted[k]-drawn[j]) < 50) {
						matches++;
						break;
					}
				}
			}
			//console.log('Matches: ',matches);
			if (matches >= 2) strokeDone();
			else {
				var m=0;
				var matcheCount = 0;
				for (var p=0; p<drawn.length; p++) {
					for (; m<wanted.length; m++) {
						if (angAbs(drawn[p]-wanted[m]) < 50) {
							matcheCount++;
							break;
						}
					}
				}
				//console.log('Matches: ',matches);
				if (matcheCount >= 2) strokeDone();
			}
		} else if (drawn.length === 1 && wanted.length === 2) {
			if (angAbs(wanted[0]-wanted[1]) < 70 && angAbs(wanted[0]-drawn[0]) < 70 && angAbs(wanted[1]-drawn[0]) < 70) {
				strokeDone();
			}
		}
	}
	preview.setAttribute('d', '');
	myStroke = null;
}

function strokeDone() {
	for (var i=0; i<=currentStroke; i++) {
		if (simpleStroke) paths[i].style.stroke = 'rgba(0,0,0,1)';
		else paths[i].style.fill = 'black';
	}
	strokePreviewed = false;
	currentStroke++;
	if (currentStroke === paths.length) {
		console.log('Hint Portion: ', previewCount, ' / ', paths.length);
		currentChar++;
		previewCount = 0;
		updateHint();
		setTimeout(nextKanji, 1000);
	}
}

function svgToPoints(stroke) {
	var a = [];
	for (var p of stroke) {
		a.push({x: p[0], y: 900-p[1]});
	}
	return a;
}

function pointsToSvg(pnts) {
	var np = [];

	var rLens = [];
	for (var i=1; i<pnts.length-1; i++) {
		var x = pnts[i].x;
		var y = pnts[i].y;
		var xOff = pnts[i+1].x - pnts[i-1].x;
		var yOff = pnts[i+1].y - pnts[i-1].y;
		var len = Math.pow(Math.pow(xOff,2)+Math.pow(yOff,2), 0.5);
		rLens.push(len);
		while (rLens.length > 10) rLens.shift();
		var recent = 0;
		for (var r of rLens) recent += r;
		var pntW = pnts.length-i;
		if (i < pntW) pntW = i;
		pntW -= 1;
		if (pntW > 10) pntW = 10;
		xOff /= len; yOff /= len; // normalize
		xOff *= pntW; yOff *= pntW; // make point bigger in the middle
		xOff *= (200/recent)+1.6; yOff *= (200/recent)+1.6; // change width based on speed
		np.push({x: x-yOff, y: y+xOff});
		np.splice(0, 0, {x: x+yOff, y: y-xOff});
	}
	if (np.length === 0) return '';
	var d = 'M'+np[0].x+','+np[0].y;
	for (var s=1; s<np.length; s++) {
		d += 'L'+np[s].x+','+np[s].y;
	}
	return d;
}

function dist(p1, p2) {
	return Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2));
}

function getStrokeBounds(pnts) {
	var minX = 1024;
	var minY = 1024;
	var maxX = 0;
	var maxY = 0;
	for (var i=0; i<pnts.length; i++) {
		var p = pnts[i];
		if (p.x < minX) minX = p.x;
		if (p.x < minY) minY = p.y;
		if (p.x > maxX) maxX = p.x;
		if (p.x > maxY) maxY = p.y;
	}
	var fin = {minX:minX, minY:minY, maxX:maxX, maxY:maxY, deltaX:maxX-minX, deltaY:maxY-minY};
	fin.maxDelta = fin.deltaY<fin.deltaX?fin.deltaX:fin.deltaY;
	return fin;
}

function getAngles(pnts) {
	var bnds = getStrokeBounds(pnts);
	if (bnds.maxDelta < 480) bnds.maxDelta = 480
	var angleList = [];
	var lastAngle = null;
	var p1 = pnts[0];
	for (var i=1; i<pnts.length; i++) {
		var p2 = pnts[i];
		var distance = dist(p1, p2);
		var angle = Math.atan2(p2.y-p1.y,p2.x-p1.x) * (180/Math.PI);
		if (lastAngle !== null && Math.abs(angle-lastAngle) < 50) {
			p1 = p2;
		} else if (distance > bnds.maxDelta/8) {
			if (lastAngle === null || Math.abs(angle-lastAngle) > 50) {
				angleList.push(angle);
				lastAngle = angle;
			}
			p1 = p2;
		}
	}
	if (angleList.length === 0) angleList.push(angle);
	return angleList;
}

var currentWord = null;
var currentChar = 0;
var kanjiShown = false;

function finishWord() {
	if (currentWord && kanjiShown) {
		updateHint();
		setTimeout(startWord, 1000);
	} else startWord();
}

function startWord() {
	currentWord = {
		data: cache.lesson.words.shift()
	};
	cache.lesson.words.push(currentWord.data);
	currentChar = 0;
	kanjiShown = false;
	if (!currentWord) {
		alert('Finished!');
		return;
	} else {
		nextKanji();
	}
}

var simpleStroke = false;
function nextKanji() {
	simpleStroke = false;
	currentChar--;
	while(1) {
		currentChar++;
		if (!currentWord || currentChar > currentWord.data.word.length) {
			finishWord();
			return;
		}
		var cc = currentWord.data.word.charCodeAt(currentChar)
		if (cc >= 0x4e00 && cc <= 0x9faf) break;
	}

	// In the real code this is loaded from the API
	var kj2 = null;
	for (var k of kanji) {
		if (k.character === currentWord.data.word[currentChar]) {
			kj2 = k;
			break;
		}
	}

	// Missing Kanji data...
	if (!kj2) {
		currentChar++;
		return nextKanji();
	}
	if (kj2.simpleStroke) simpleStroke = true;

	kanjiShown = true;
	updateHint();

	strokes = kj2.strokes;
	averages = kj2.medians;
	//kj.strokes;

	svg.innerHTML = '';
	paths = [];
	currentStroke = 0;
	
	for (var s of strokes) {//averages) {
		var res = s;
		res = res.replace(/[A-Z](\s[-0-9.]+\s[-0-9.]+)+/g, function(a) {
			var pts = a.split(' ');
			for (var i=2; i<pts.length; i+=2) {
				pts[i] = 900-pts[i];
			}
			return pts.join(' ');
		});
		paths.push($.create('path', {
			ns: svgns, parent: svg, d: res,
			style: 'fill:rgba(0,0,0,0);stroke:rgba(0,0,0,0);stroke-width:48;stroke-linecap:round;stroke-linejoin:round;'
		}));
	}

	preview = $.create('path', {
		ns: svgns, parent: svg,
		style: 'fill:black;stroke-width:0;'
	});

	svg.onmousedown = fingerDown;
	svg.onmousemove = fingerMove;
	svg.onmouseup = fingerUp;

	svg.ontouchstart = fingerDown;
	svg.ontouchmove = fingerMove;
	svg.ontouchend = fingerUp;
}

function updateHint() {
	var hint = currentWord.data.translation + ' - <ruby>' + currentWord.data.word.substring(0,currentChar) + currentWord.data.word.substring(currentChar).replace(/[\u4e00-\u9faf]/g, ' _ ') + '<rt>' + (currentWord.data.pronunciation||'') + '</rt></ruby>';
	details.innerHTML = '';
	$.create('h1', {parent: details, style: 'text-align: center;', innerHTML: hint});
}

var previewCount = 0;
var strokePreviewed = false;
var isPreviewing = false;
function previewCharacter() {
	if (!strokePreviewed && previewCount < paths.length-currentStroke) previewCount++;
	if (isPreviewing && previewCount < paths.length-currentStroke) previewCount = paths.length-currentStroke;
	for (var i=currentStroke; i<paths.length; i++) {
		if (simpleStroke) paths[i].style.stroke = 'red';
		else paths[i].style.fill = 'red';
		if (!isPreviewing) break;
	}
	strokePreviewed = true;
	if (isPreviewing) clearTimeout(isPreviewing);
	isPreviewing = setTimeout(function() {
		isPreviewing = false;
		for (var i=currentStroke; i<paths.length; i++) {
			paths[i].style.stroke = 'rgba(0,0,0,0)';
			paths[i].style.fill = 'rgba(0,0,0,0)';
		}
	}, 1000);
}
