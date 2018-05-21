
exports.init = function() {
	exports.lesson = {
		name: 'Example Lesson',
		description: 'This is an example lesson that is cached locally. Changes will be persistent between sessions.',
		words: [
			{word: '食', translation: 'eat'},
			{word: '大', translation: 'big'},
			{word: '小', translation: 'small'},
			{word: '木', translation: 'tree'},
			{word: '傘', translation: 'umbrella'},
			{word: '思', translation: 'think'}
		]
	};

	var ld = localStorage.getItem('lessonData');
	if (ld) {
		try {
			exports.lesson = JSON.parse(ld);
		} catch(e) {}
	}
};

exports.updateLesson = function(d) {
	exports.lesson.name = d.name;
	exports.lesson.description = d.description;
	localStorage.setItem('lessonData', JSON.stringify(exports.lesson));
}
