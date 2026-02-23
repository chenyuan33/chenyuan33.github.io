let q = id => Number(document.getElementById(id).value), p = id => q('problem' + id), calc = () => {
	let goodArticles = Number(document.getElementById('good-articles').value);
	let solution = Number(document.getElementById('solution').value);
	let articles = Number(document.getElementById('articles').value);
	let ccf = Number(document.getElementById('ccf').value);
	let problemScore = (p(1) * 2 + p(2) * 3 + p(3) * 5 + p(4) * 6 + p(5) * 9 + p(6) * 10 + p(7) * 15) / 10000;
	let articleScore = ((x, y) => x ? y / x : 0)(articles, goodArticles * 0.75 + solution * 0.25);
	let ratingScore = q('rating') / 2000;
	let discussScore = q('discusses') / 50;
	let ccfScore = q('ccf') / 100;
	let totalScore = (problemScore * 0.7 + articleScore + ratingScore + discussScore * 0.3 + ccfScore * 2) / 5;
	let ratingLevel = 0;
	if (totalScore < 0.3) {
		ratingLevel = 1;
	}
	else if (totalScore < 0.5) {
		ratingLevel = 2;
	}
	else if (totalScore < 0.7) {
		ratingLevel = 3;
	}
	else if (totalScore < 0.9) {
		ratingLevel = 4;
	}
	else {
		ratingLevel = 5;
	}
	document.getElementById('problemScore').innerHTML = problemScore.toFixed(2);
	document.getElementById('articleScore').innerHTML = articleScore.toFixed(2);
	document.getElementById('ratingScore').innerHTML = ratingScore.toFixed(2);
	document.getElementById('discussScore').innerHTML = discussScore.toFixed(2);
	document.getElementById('ccfScore').innerHTML = ccfScore.toFixed(2);
	document.getElementById('totalScore').innerHTML = totalScore.toFixed(2);
	document.getElementById('ratingLevel').style.color = '#' + [, 'bfbfbf', '3498db', '52c41a', 'f39c11', 'fe4c61'][ratingLevel];
	document.getElementById('ratingLevel').innerHTML = i18n.tool.luoguUserScoreCalc.output.ratingLevels['lv' + ratingLevel];
	document.getElementById('ratingLevel').classList = 'wait-for-i18n';
	document.getElementById('ratingLevel').dataset.i18n = 'tool.luoguUserScoreCalc.output.ratingLevels.lv' + ratingLevel;
}