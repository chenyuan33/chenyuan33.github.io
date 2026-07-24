let paused = false, flushQuarkRefreshArg = false, player = {};
const flush = ['start'], achievements = {}, playerDefault = () => ({
	achievements: {
		firstQuark: false,
		quarkGetter: false,
		quarkGetter2: false,
		quarkGetter3: false,
		quarkGetter4: false,
		quark1e10: false,
		quark1e15: false,
		quark1e20: false,
		quark1e25: false,
		quarkDimension1: false,
		quarkDimension1getted2: false,
		quarkDimension1getter: false,
		quarkDimension1getter2: false,
		quarkDimension1getter3: false,
		quarkDimension1getter4: false,
		quarkDimension2: false,
		quarkDimension2getter4: false,
		quarkDimension3: false,
		quarkDimension4: false,
		theEnd: false
	},
	quark: [[new BigNumber(0)]],
	quarkPoints: [new BigNumber(0)],
	unlockDimension: false
}), updateData = (data, resolve, reject) => {
	const toBigNumberArray = data => {
		if (data instanceof Array) {
			const ret = [];
			for (const k in data) {
				ret[k] = toBigNumberArray(data[k]);
			}
			return ret;
		}
		return new BigNumber(data);
	}, merge = (data, defaultData) => {
		switch (typeof defaultData) {
			case 'boolean':
				return !!data;
			case 'object':
				if (defaultData instanceof Array) {
					return toBigNumberArray(data);
				}
				if (defaultData instanceof BigNumber) {
					return new BigNumber(data);
				}
				const ret = {};
				for (const k in defaultData) {
					ret[k] = merge(data[k], defaultData[k]);
				}
				return ret;
		}
	};
	try {
		player = merge(JSON.parse(atob(data)), playerDefault());
		flush.push('start');
		resolve();
	} catch (e) {
		reject(e);
	}
}, doCpyCurrentArchive = () => navigator.clipboard.writeText(btoa(JSON.stringify(player))), cpyCurrentArchiveThenDialog = () => doCpyCurrentArchive().then(async () => createDialog(`
	<h2>${await i18nValue('game.quarks.settings.archive.get.copied')}</h2>
	<p>${await i18nValue('game.quarks.settings.archive.cpy.message')}</p>
`, [{text: await i18nValue('ok')}])), getCurrentArchive = async () => createDialog(
	`
		<h2>${await i18nValue('game.quarks.settings.archive.get.title')}</h2>
		<pre class="archive"><code>${btoa(JSON.stringify(player))}</code></pre>
		<p><strong>${await i18nValue('game.quarks.settings.archive.get.notice')}</strong></p>
	`,
	[
		{text: await i18nValue('game.quarks.settings.archive.get.copy'), callback: cpyCurrentArchiveThenDialog, close: false},
		{text: await i18nValue('game.quarks.settings.archive.get.copyAndClose'), callback: cpyCurrentArchiveThenDialog},
		{text: await i18nValue('ok')}
	]
), cpyCurrentArchive = () => doCpyCurrentArchive().then(async () => addMessage(await i18nValue('game.quarks.settings.archive.cpy.message'), 'light-dark(lightgreen, darkgreen)')), setCurrentArchive = async () => createDialog(
	`
		<h2>${await i18nValue('game.quarks.settings.archive.set.btn')}</h2>
		<p>${await i18nValue('game.quarks.settings.archive.set.notice1')}</p>
		<p>${await i18nValue('game.quarks.settings.archive.set.notice2')}</p>
		<p>${await i18nValue('game.quarks.settings.archive.set.notice3')}</p>
		<textarea class="archive"></textarea>
	`,
	[
		{text: await i18nValue('cancel')},
		{
			text: `<span class="error">${await i18nValue('game.quarks.settings.archive.set.sure')}</span>`,
			callback: () => updateData(
				document.querySelector('textarea.archive').value,
				async () => addMessage(await i18nValue('game.quarks.settings.archive.set.success'), 'light-dark(lightgreen, darkgreen)'),
				async e => createDialog(
					`
						<h2>${await i18nValue('game.quarks.settings.archive.set.failed.header')}</h2>
						<p>${await i18nValue('game.quarks.settings.archive.set.failed.notice1')}</p>
						<p>${await i18nValue('game.quarks.settings.archive.set.failed.notice2')}</p>
						<details>
							<summary>${await i18nValue('error.error.message')}</summary>
							<pre>${(() => {
								const x = document.createElement('code');
								x.textContent = e;
								return x.outerHTML;
							})()}</pre>
						</details>
					`,
					[{text: await i18nValue('ok')}]
				)
			)
		}
	]
), formatNumber = num => {
	if (typeof num === 'number') {
		return formatNumber(new BigNumber(num));
	}
	let ret = '';
	if (num.lt(new BigNumber(0))) {
		ret += '-';
		num = num.times(new BigNumber(-1));
	}
	if (num.lt(new BigNumber(1000))) {
		ret += num.toString();
	} else {
		let p = num.div(new BigNumber(10).pow(new BigNumber(num.e))).precision(3).toString(), e;
		if (p === '10') {
			p = '1';
			e = formatNumber(num.e + 1);
		} else {
			e = formatNumber(num.e);
		}
		ret += p + 'e' + e;
	}
	return ret;
}, doHardReset = () => {
	player = playerDefault();
	flush.push('start');
}, hardReset = async () => createDialog(`
	<h2>${await i18nValue('game.quarks.settings.hardReset.title')}</h2>
	<p>${await i18nValue('game.quarks.settings.hardReset.notice1')}</p>
	<p>${await i18nValue('game.quarks.settings.hardReset.notice2')}</p>
`, [
	{text: await i18nValue('cancel')},
	{text: `<span class="error">${await i18nValue('ok')}</span>`, callback: async () => {
		doHardReset();
		addMessage(await i18nValue('game.quarks.settings.hardReset.success'), 'light-dark(lightgreen, darkgreen)');
	}}
]), getQuark = (dimension, level) => {
	let ret = false;
	if (!level) {
		if (dimension) {
			return false;
		}
		player.quark[0][0] = player.quark[0][0].plus(new BigNumber(1));
		ret = true;
	}
	if (player.quark[dimension][0].gte((new BigNumber(2)).pow(player.quark[dimension][level][1]).times((new BigNumber(10)).pow(new BigNumber(level))).times((new BigNumber(20)).pow(new BigNumber(dimension))))) {
		player.quark[dimension][0] = player.quark[dimension][0].minus((new BigNumber(2)).pow(player.quark[dimension][level][1]).times((new BigNumber(10)).pow(new BigNumber(level))).times((new BigNumber(20)).pow(new BigNumber(dimension))));
		player.quark[dimension][level][0] = player.quark[dimension][level][0].plus(1);
		player.quark[dimension][level][1] = player.quark[dimension][level][1].plus(1);
		ret = true;
	}
	if (ret) {
		if (dimension === player.quark.length - 1 && dimension < 1e5) {
			player.quark.push([new BigNumber(0)]);
			player.quarkPoints.push(new BigNumber(0));
			flushQuarkRefreshArg = true;
			flush.push('quarkRefresh');
		} else {
			flush.push('quark');
		}
		if (level === player.quark[dimension].length - 1 && level < 1e5) {
			player.quark[dimension].push([new BigNumber(0), new BigNumber(0)]);
		}
	}
	return ret;
}, getQuarkMax = (dimension, level) => {
	let ret = false;
	if (level) {
		while (getQuark(dimension, level)) {
			ret = true;
		}
	}
	return ret;
}, getQuarkMaxDimension = dimension => {
	let ret = false;
	for (let i = 1; i < player.quark[dimension].length; i++) {
		if (getQuarkMax(dimension, i)) {
			ret = true;
		}
	}
	return ret;
}, getQuarkMaxAll = () => {
	let ret = false;
	for (let i = 0; i < player.quark.length; i++) {
		if (getQuarkMaxDimension(i)) {
			ret = true;
		}
	}
	return ret;
}, convertQuark = dimension => {
	let flag = !player.unlockDimension;
	if (dimension === player.quark.length - 1 && dimension < 1e5) {
		player.quark.push([new BigNumber(0)]);
		player.quarkPoints.push(new BigNumber(0));
		flag = true;
	}
	if (player.quark[dimension + 1].length === 1) {
		player.quark[dimension + 1].push([new BigNumber(0), new BigNumber(0)]);
	}
	player.quark[dimension + 1][0] = player.quark[dimension + 1][0].plus(player.quark[dimension][0].idiv((new BigNumber(10)).pow(((new BigNumber(dimension)).plus(new BigNumber(3))).times(new BigNumber(10)))));
	player.quark[dimension] = [new BigNumber(0)];
	player.unlockDimension = true;
	if (flag) {
		flushQuarkRefreshArg = true;
		flush.push('quarkRefresh');
	} else {
		flush.push('quark');
	}
}, pause = () => {
	paused = !paused;
	flushPause();
}, flushPause = async () => {
	document.getElementById('pause').innerText = await i18nValue(`game.quarks.settings.pause.${paused ? 'continue' : 'pause'}`);
	document.getElementById('aboutPause').style.display = paused ? 'block' : 'none';
	if (player.unlockDimension) {
		document.getElementById('quarkButtonMaxAll').disabled = paused;
	}
	document.getElementById('quarkButton0-0').disabled = paused;
	for (let i = 0; i < (player.unlockDimension ? player.quark.length : 1); i++) {
		document.getElementById('quarkButtonMaxDimension' + i).disabled = paused;
		if (player.unlockDimension || player.quark[0][0].gte(new BigNumber(1e25))) {
			document.getElementById('convertQuarkButton' + i).disabled = paused || player.quark[i][0].lt((new BigNumber(10)).pow(((new BigNumber(i)).plus(3)).times(10)));
		}
	}
}, quarkRefreshHTML = async dimension => `
	<div id="quarkDimensionDiv${dimension}">
		<h2>${player.unlockDimension ? `[${await i18nValue('game.quarks.game.dimension')} ${dimension}] ` : ''}${(await i18nValue('game.quarks.game.currentQuark')).replace('@', `<span id="currentQuark${dimension}"></span>`)}</h2>
		<p>
			${dimension ? '' : `<button onclick="getQuark(0, 0)" id="quarkButton0-0">${await i18nValue('game.quarks.game.getQuark')}</button>`}
			<button onclick="getQuarkMaxDimension(${dimension})" id="quarkButtonMaxDimension${dimension}">${await i18nValue('game.quarks.game.getQuarkMax' + (player.unlockDimension ? 'Dimension' : 'All'))}</button>
			${player.unlockDimension ? `<button onclick="convertQuark(${dimension})" id="convertQuarkButton${dimension}">${(await i18nValue('game.quarks.game.convertQuark')).replace('@', formatNumber(player.quark[dimension][0].idiv((new BigNumber(10)).pow(((new BigNumber(dimension)).plus(3)).times(10)))))}</button>` : '<span id="convertQuarkDiv0"></span>'}
		</p>
		${dimension ? `<p>${(await i18nValue('game.quarks.game.quarkPointsText')).replace('@', `<span id="quarkPoints${dimension}"></span>`).replace('@', `<span id="quarkPointsFactor${dimension}"></span>`)}</p>` : ''}
		<table>
			<thead><tr>
				<th>${await i18nValue('game.quarks.game.quarkGettersTableHead.id')}</th>
				<th>${await i18nValue('game.quarks.game.quarkGettersTableHead.owned')}</th>
				<th>${await i18nValue('game.quarks.game.quarkGettersTableHead.bought')}</th>
				<th>${await i18nValue('game.quarks.game.quarkGettersTableHead.getOne')}</th>
				<th>${await i18nValue('game.quarks.game.quarkGettersTableHead.getMax')}</th>
			</tr></thead>
			<tbody id="quarkGetterTableBody${dimension}"></tbody>
		</table>
	</div>
`, flushing = async () => {
	while (flush.length > 0) {
		switch (flush[0]) {
			case 'start':
				flush.push('achievements');
				flush.push('quarkRefresh');
				break;
			case 'achievements':
				for (const key in achievements) {
					const getted = player.achievements[key];
					if (getted !== !!document.querySelectorAll(`#achievement-${key}.achievement-getted`).length) {
						document.getElementById(`achievement-${key}`).classList.remove(`achievement-${getted ? 'un' : ''}getted`);
						document.getElementById(`achievement-${key}`).classList.add(`achievement-${getted ? '' : 'un'}getted`);
						document.getElementById(`achievement-${key}`).firstElementChild.classList.remove(`fa-${getted ? 'xmark' : 'check'}`);
						document.getElementById(`achievement-${key}`).firstElementChild.classList.add(`fa-${getted ? 'check' : 'xmark'}`);
					}
				}
				break;
			case 'quarkRefresh':
				if (player.unlockDimension) {
					const i18nDimension = await i18nValue('game.quarks.game.dimension');
					document.getElementById('main').innerHTML = `
						<button onclick="getQuarkMaxAll()" id="quarkButtonMaxAll">${await i18nValue('game.quarks.game.getQuarkMaxAll')}</button>
						${
							contentTabs(
								await Promise.all(player.quark.map(async (_, i) => ({name: `${i18nDimension} ${i}`, content: await quarkRefreshHTML(i)}))),
								flushQuarkRefreshArg ? player.quark.length - 2 : 0
							)
						}
					`;
					flushQuarkRefreshArg = false;
				} else {
					document.getElementById('main').innerHTML = await quarkRefreshHTML(0);
				}
				flush.push('quark');
				break;
			case 'quark':
				if (!player.unlockDimension) {
					document.getElementById('convertQuarkDiv0').innerHTML = player.quark[0][0].gte(new BigNumber(1e25)) ? `<button onclick="convertQuark(0)" id="convertQuarkButton0">${await i18nValue('game.quarks.game.convertQuarkLock')}</button>` : '';
				}
				for (let i = 0; i < (player.unlockDimension ? player.quark.length : 1); i++) {
					document.getElementById('currentQuark' + i).innerText = formatNumber(player.quark[i][0]);
					if (i) {
						document.getElementById('quarkPoints' + i).innerText = formatNumber(player.quarkPoints[i - 1]);
						document.getElementById('quarkPointsFactor' + i).innerText = formatNumber(player.quarkPoints[i - 1].plus(new BigNumber(1)).plus(player.quark[i][0]));
					}
					let str = '';
					for (let j = 1; j < player.quark[i].length; j++) {
						if (document.getElementById('quarkGetterTableBody' + i).children.length < j) {
							document.getElementById('quarkGetterTableBody' + i).insertAdjacentHTML('beforeend', `
								<tr>
									<td>#${formatNumber(new BigNumber(j))}</td>
									<td id="ownedQuarkGetter${i}-${j}"></td>
									<td id="boughtQuarkGetter${i}-${j}"></td>
									<td id="quarkButton${i}-${j}">${(await i18nValue('game.quarks.game.getQuarkGetter')).replace('@', `<span id="quarkButtonCost${i}-${j}"></span>`)}</td>
									<td id="quarkButtonMax${i}-${j}">${await i18nValue('game.quarks.game.getQuarkMax')}</td>
								</tr>
							`);
						}
						document.getElementById(`ownedQuarkGetter${i}-${j}`).innerText = formatNumber(player.quark[i][j][0]);
						document.getElementById(`boughtQuarkGetter${i}-${j}`).innerText = formatNumber(player.quark[i][j][1]);
						document.getElementById(`quarkButtonCost${i}-${j}`).innerText = formatNumber((new BigNumber(2)).pow(player.quark[i][j][1]).times((new BigNumber(10)).pow(j)).times((new BigNumber(20)).pow(i)));
						document.getElementById(`quarkButton${i}-${j}`).classList.remove('buttonInTable', 'disabledButtonInTable');
						document.getElementById(`quarkButtonMax${i}-${j}`).classList.remove('buttonInTable', 'disabledButtonInTable');
						if (paused || (new BigNumber(2)).pow(player.quark[i][j][1]).times((new BigNumber(10)).pow(j)).times((new BigNumber(20)).pow(i)).gt(player.quark[i][0])) {
							document.getElementById(`quarkButton${i}-${j}`).classList.add('disabledButtonInTable');
							document.getElementById(`quarkButtonMax${i}-${j}`).classList.add('disabledButtonInTable');
							document.getElementById(`quarkButton${i}-${j}`).onclick = () => {};
							document.getElementById(`quarkButtonMax${i}-${j}`).onclick = () => {};
						} else {
							document.getElementById(`quarkButton${i}-${j}`).classList.add('buttonInTable');
							document.getElementById(`quarkButtonMax${i}-${j}`).classList.add('buttonInTable');
							document.getElementById(`quarkButton${i}-${j}`).add
							document.getElementById(`quarkButton${i}-${j}`).onclick = () => getQuark(i, j);
							document.getElementById(`quarkButtonMax${i}-${j}`).onclick = () => getQuarkMax(i, j);
						}
					}
				}
				flushPause();
				break;
			default:
				break;
		}
		flush.shift();
	}
	setTimeout(flushing, 50);
}, checkAchievements = async () => {
	for (const key in achievements) {
		if (!player.achievements[key] && achievements[key].check()) {
			player.achievements[key] = true;
			addMessage(`
				<h2>${await i18nValue('game.quarks.achievements.unlock')} <span class="unlockedAchievementName">${achievements[key].title}</span></h2>
				<p>${achievements[key].desc}</p>
			`, 'light-dark(lightgreen, darkgreen)');
			flush.push('achievements');
		}
	}
	setTimeout(checkAchievements, 50);
}, updateQuark = () => {
	if (!paused) {
		for (let i = 0; i < player.quark.length; i++) {
			if (player.quark[i].length > 1 && player.quark[i][1][0].gt(new BigNumber(0))) {
				while (player.quarkPoints.length < i + 2) {
					player.quarkPoints.push(new BigNumber(0));
				}
				let factor = player.quarkPoints[i].plus(new BigNumber(1));
				if (i + 1 < player.quark.length) {
					factor = factor.plus(player.quark[i + 1][0]);
				}
				if (i) {
					player.quarkPoints[i - 1] = player.quarkPoints[i - 1].plus(player.quark[i][1][0].times(factor));
				} else {
					player.quark[i][0] = player.quark[i][0].plus(player.quark[i][1][0].times(factor));
				}
				for (let j = 1; j < player.quark[i].length - 1; j++) {
					player.quark[i][j][0] = player.quark[i][j][0].plus(player.quark[i][j + 1][0].times(factor));
				}
			}
		}
		flush.push('quark');
	}
	setTimeout(updateQuark, 1000);
}, load = async () => {
	for (const [name, check] of [
		['firstQuark', () => player.quark[0][0].gt(new BigNumber(0))],
		['quarkGetter', () => player.quark[0].length > 1 && player.quark[0][1][0].gt(new BigNumber(0))],
		['quarkGetter2', () => player.quark[0].length > 2 && player.quark[0][2][0].gt(new BigNumber(0))],
		['quarkGetter3', () => player.quark[0].length > 3 && player.quark[0][3][0].gt(new BigNumber(0))],
		['quarkGetter4', () => player.quark[0].length > 4 && player.quark[0][4][0].gt(new BigNumber(0))],
		['quark1e10', () => player.quark[0][0].gt(new BigNumber(1e10))],
		['quark1e15', () => player.quark[0][0].gt(new BigNumber(1e15))],
		['quark1e20', () => player.quark[0][0].gt(new BigNumber(1e20))],
		['quark1e25', () => player.quark[0][0].gt(new BigNumber(1e25))],
		['quarkDimension1', () => player.quark.length > 1 && player.quark[1][0].gt(new BigNumber(0))],
		['quarkDimension1getted2', () => player.quark.length > 1 && player.quark[1][0].gt(new BigNumber(1))],
		['quarkDimension1getter', () => player.quark.length > 1 && player.quark[1].length > 1 && player.quark[1][1][0].gt(new BigNumber(0))],
		['quarkDimension1getter2', () => player.quark.length > 1 && player.quark[1].length > 2 && player.quark[1][2][0].gt(new BigNumber(0))],
		['quarkDimension1getter3', () => player.quark.length > 1 && player.quark[1].length > 3 && player.quark[1][3][0].gt(new BigNumber(0))],
		['quarkDimension1getter4', () => player.quark.length > 1 && player.quark[1].length > 4 && player.quark[1][4][0].gt(new BigNumber(0))],
		['quarkDimension2', () => player.quark.length > 2 && player.quark[2][0].gt(new BigNumber(0))],
		['quarkDimension2getter4', () => player.quark.length > 2 && player.quark[2].length > 4 && player.quark[2][4][0].gt(new BigNumber(0))],
		['quarkDimension3', () => player.quark.length > 3 && player.quark[3][0].gt(new BigNumber(0))],
		['quarkDimension4', () => player.quark.length > 4 && player.quark[4][0].gt(new BigNumber(0))],
		['theEnd', () => player.quark.length > 10 && player.quark[10][0].gt(new BigNumber(0))]
	]) {
		achievements[name] = {
			title: await i18nValue(`game.quarks.achievements.${name}.title`),
			desc: await i18nValue(`game.quarks.achievements.${name}.desc`),
			check: check
		}
	}
	if (localStorage.gameQuarks === undefined) {
		doHardReset();
	} else {
		updateData(localStorage.gameQuarks, () => {}, doHardReset);
	}
	const changelog = await i18nValue('game.quarks.changelog.content');
	document.getElementById('game').innerHTML = contentTabs([
		{
			name: await i18nValue('game.quarks.game.title'),
			content: `
				<p id="aboutPause">${await i18nValue('game.quarks.game.aboutPause')}</p>
				<div id="main"></div>
			`
		},
		{
			name: await i18nValue('game.quarks.achievements.title'),
			content: (() => {
				let str = '';
				for (const key in achievements) {
					str += `
						<div class="achievement-info achievement-${player.achievements[key] ? '' : 'un'}getted" id="achievement-${key}">
							<i class="fa-solid fa-${player.achievements[key] ? 'check' : 'xmark'}"></i>
							<strong>${achievements[key].title}</strong>
							<span class="achievement-desc" id="achievement-desc-${key}">${achievements[key].desc}</span>
							<style>
								#achievement-${key}:hover #achievement-desc-${key} {
									display: inline;
								}
							</style>
						</div>
					`;
				}
				return `<div id="achievements">${str}</div>`;
			})()
		},
		{
			name: await i18nValue('game.quarks.settings.title'),
			content: `
				<button onclick="hardReset()">${await i18nValue('game.quarks.settings.hardReset.btn')}</button>
				<button onclick="pause()" id="pause">${await i18nValue('game.quarks.settings.pause.pause')}</button>
				<button onclick="getCurrentArchive()">${await i18nValue('game.quarks.settings.archive.get.btn')}</button>
				<button onclick="cpyCurrentArchive()">${await i18nValue('game.quarks.settings.archive.cpy.btn')}</button>
				<button onclick="setCurrentArchive()">${await i18nValue('game.quarks.settings.archive.set.btn')}</button>
			`
		},
		{
			name: await i18nValue('game.quarks.changelog.title'),
			content: contentTabs(Object.entries(changelog).map(([majorVer, group]) => {
				return {
					name: `v${majorVer}.x.x ${group.title}`,
					content: Object.entries(group).filter(([k]) => k !== 'title').map(
						([subVer, patches]) => `${Object.entries(patches).map(
							([patchVer, items]) => `<h2>v${majorVer}.${subVer}.${patchVer}</h2><ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`
						).join('')}`
					).join('')
				};
			}), Object.keys(changelog).length - 1)
		}
	], 0);
	flushing();
	checkAchievements();
	setTimeout(updateQuark, 1000);
	setInterval(() => localStorage.gameQuarks = btoa(JSON.stringify(player)), 1000);
};
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', load);
} else {
	load();
}