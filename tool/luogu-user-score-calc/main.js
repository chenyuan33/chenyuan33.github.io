const q = id => Number(document.getElementById(id).value), p = id => q('prob' + id), calc = async () => {
	const goodArticles = Number(document.getElementById('good-articles').value);
	const solution = Number(document.getElementById('solution').value);
	const articles = Number(document.getElementById('articles').value);
	const ccf = Number(document.getElementById('ccf').value);
	const problemScore = (p(1) * 2 + p(2) * 3 + p(3) * 5 + p(4) * 6 + p(5) * 9 + p(6) * 10 + p(7) * 15) / 10000;
	const articleScore = ((x, y) => x ? y / x : 0)(articles, goodArticles * 0.75 + solution * 0.25);
	const ratingScore = q('rating') / 2000;
	const discussScore = q('discusses') / 50;
	const ccfScore = q('ccf') / 100;
	const totalScore = (problemScore * 0.7 + articleScore + ratingScore + discussScore * 0.3 + ccfScore * 2) / 5;
	let ratingLevel = 0;
	if (totalScore < 0.3) {
		ratingLevel = 1;
	} else if (totalScore < 0.5) {
		ratingLevel = 2;
	} else if (totalScore < 0.7) {
		ratingLevel = 3;
	} else if (totalScore < 0.9) {
		ratingLevel = 4;
	} else {
		ratingLevel = 5;
	}
	document.getElementById('problemScore').innerText = problemScore.toFixed(2);
	document.getElementById('articleScore').innerText = articleScore.toFixed(2);
	document.getElementById('ratingScore').innerText = ratingScore.toFixed(2);
	document.getElementById('discussScore').innerText = discussScore.toFixed(2);
	document.getElementById('ccfScore').innerText = ccfScore.toFixed(2);
	document.getElementById('totalScore').innerText = totalScore.toFixed(2);
	document.getElementById('ratingLevel').style.color = '#' + [, 'bfbfbf', '3498db', '52c41a', 'f39c11', 'fe4c61'][ratingLevel];
	document.getElementById('ratingLevel').innerText = await i18nValue('tool.luoguUserScoreCalc.output.ratingLevels.lv' + ratingLevel);
}, load = () => {
	const f = async name => {
		document.getElementById(name + 'Div').insertAdjacentHTML('beforeend', `
			<h2>${await i18nValue(`tool.luoguUserScoreCalc.input.${name}.title`)}</h2>
			<table>
				<thead>${await i18nValue('tableHeadKeyValue')}</thead>
				<tbody>
					${
						await (async () => {
							let res = '';
							for(const ele of {
								prob: Array.from({length: 7}, (_, i) => 'prob' + (i + 1)),
								article: ['good-articles', 'solution', 'articles'],
								other: ['rating', 'discusses', 'ccf']
							}[name]) {
								res += `
									<tr>
										<td><label for="${ele}">${await i18nValue(`tool.luoguUserScoreCalc.input.${name}.${ele}`)}</label></td>
										<td><input id="${ele}" type="number" value="0" oninput="calc()" /></td>
									</tr>
								`;
							}
							return res;
						})()
					}
				</tbody>
			</table>
		`);
	};
	Promise.all([f('prob'), f('article'), f('other'), (async () => {
		const tmp = document.getElementsByTagName('tbody');
		const outputTableBody = tmp[tmp.length - 1];
		for (const ele of ['problemScore', 'articleScore', 'ratingScore', 'discussScore', 'ccfScore', 'totalScore', 'ratingLevel']) {
			outputTableBody.insertAdjacentHTML('beforeend', `
				<tr>
					<td>${await i18nValue(`tool.luoguUserScoreCalc.output.${ele}`)}</td>
					<td id="${ele}"></td>
				</tr>
			`);
		}
	})()]).then(calc);
};
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', load);
} else {
	load();
}