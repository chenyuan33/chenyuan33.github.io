document.head.append(document.createRange().createContextualFragment(`
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" type="text/css" href="/style.css" />
	<script src="https://kit.fontawesome.com/49ad5e587e.js" crossorigin="anonymous"></script>
	<link rel="icon" type="image/png" href="/favicon.ico" />
`));
const langList = ['en-us', 'zh-cn'];
if (localStorage.getItem('lang') === null) {
	let flag = true;
	for (let i = 1; i < langList.length; i++) {
		if (navigator.language.toLowerCase() === langList[i] || navigator.language.toLowerCase() === langList[i].split('-')[0]) {
			localStorage.lang = langList[i];
			flag = false;
		}
	}
	if (flag) {
		localStorage.lang = langList[0];
	}
}
let i18n = undefined, messageCount = 0, errorMessageCount = 0;
const pageLoad = Promise.all([
	new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve)),
	new Promise(resolve => fetch(`/i18n/${localStorage.lang}.json`).then(response => response.json()).then(i18nContent => {
			i18n = i18nContent;
			resolve();
		})
	)
]), i18nValue = async str => {
	await pageLoad;
	let ret = i18n;
	str.split('.').forEach(str => ret = ret[str]);
	return ret;
}, switchLight = () => {
	if (localStorage.getItem('lightMode') === 'dark') {
		localStorage.lightMode = document.documentElement.style.colorScheme = 'light';
		document.getElementById('lightSwitchIcon').classList = 'fa-solid fa-sun';
	} else {
		localStorage.lightMode = document.documentElement.style.colorScheme = 'dark';
		document.getElementById('lightSwitchIcon').classList = 'fa-solid fa-moon';
	}
}, randomShuffle = arr => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}, modifyLang = lang => {
	localStorage.lang = lang;
	location.reload();
}, addMessage = (content, bgcolor = 'inherit') => {
	messageCount++;
	document.getElementById('messageList').insertAdjacentHTML('beforeend', `
		<div class="message" id="message${messageCount}" style="background-color: ${bgcolor};">
			<i class="fa-solid fa-xmark message-close-button" onclick="document.getElementById('message' + messageCount).remove()"></i>
			${content}
		</div>
	`);
	setTimeout((messageCount => () => {
		const message = document.getElementById('message' + messageCount);
		message.style.opacity = 0;
		setTimeout(() => message.remove(), 1000);
	})(messageCount), 2000);
}, addErrorMessage = errorMessages => {
	errorMessageCount++;
	addMessage(`
		<h2>${i18n.error.title}</h2>
		<p>${i18n.error.about}</p>
		<p><button onclick="navigator.clipboard.writeText(document.getElementById('errorMessage-${errorMessageCount}').outerHTML)">${i18n.error.copyDetails}</button></p>
		<details><summary>${i18n.error.details}</summary>
			<table id="errorMessage-${errorMessageCount}">
				<thead>${i18n.tableHeadKeyValue}</thead>
				<tbody>
					<tr><th>${i18n.error.openedURL}</th><td>${(() => {
						const a = document.createElement('a');
						a.textContent = location.href;
						a.href = location.href;
						return a.outerHTML;
					})()}</td></tr>
				</tbody>
			</table>
		</details>
	`, 'red');
	errorMessages.forEach(([key, value]) => document.getElementById('errorMessage-' + errorMessageCount).lastElementChild.insertAdjacentHTML('beforeend', `<tr><th>${key}</th><td>${value}</td></tr>`));
};
pageLoad.then(async () => {
	document.documentElement.lang = i18n.htmlLangName;
	const waitForI18nList = document.querySelectorAll('[data-i18n]');
	for (let i = 0; i < waitForI18nList.length; i++) {
		waitForI18nList[i].innerHTML = await i18nValue(waitForI18nList[i].dataset.i18n);
	}
	document.getElementsByTagName('title')[0].innerText += ' - ' + i18n.siteName;
	document.body.insertAdjacentHTML('afterbegin', `
		<div id="sidebar">
			<div id="sidebarContent">
				<h3>
					<i class="fa-solid fa-location-dot"></i>
					<span class="sidebarTitle">${i18n.sidebar.navigation}</span>
				</h3>
				<p><a href="/${i18n.langName}/index.html">
					<i class="fa-solid fa-house"></i>
					<span class="sidebarTitle">${i18n.sidebar.homePage}</span>
				</a></p>
				<p><a href="/${i18n.langName}/links.html">
					<i class="fa-solid fa-link"></i>
					<span class="sidebarTitle">${i18n.sidebar.relatedLinks}</span>
				</a></p>
				<p><a href="/${i18n.langName}/changelog.html">
					<i class="fa-solid fa-clock-rotate-left"></i>
					<span class="sidebarTitle">${i18n.sidebar.changelog}</span>
				</a></p>
				<p><a href="/${i18n.langName}/faqs.html">
					<i class="fa-solid fa-question-circle"></i>
					<span class="sidebarTitle">${i18n.sidebar.faqs}</span>
				</a></p>
				<hr>
				<h3>
					<i class="fa-solid fa-language"></i>
					<span class="sidebarTitle">${i18n.sidebar.languageChoice}</span>
				</h3>
				${
					(() => {
						let ret = '';
						langList.forEach(totLang => ret += `
							<p ${i18n.langName === totLang ? 'class="sidebarCurrentChoice"' : ''}><a href="javascript:modifyLang('${totLang}')">
								<i class="fa-solid fa-${i18n.langName === totLang ? 'check-circle' : 'circle'}"></i>
								<span class="sidebarTitle">${i18n.NameOfEachLang[totLang]}</span>
							</a></p>
						`)
						return ret;
					})()
				}
				<hr>
				<h3>
					<i class="fa-solid fa-compass"></i>
					<span class="sidebarTitle">${i18n.sidebar.features}</span>
				</h3>
				<p><a href="javascript:switchLight()">
					<i id="lightSwitchIcon" class="fa-solid fa-sun"></i>
					<span class="sidebarTitle">${i18n.sidebar.toggleTheme}</span>
				</a></p>
				<p>
					<i class="fa-solid fa-calendar"></i>
					<span class="sidebarTitle" id="currentDate">${i18n.loading}</span>
				</p>
				<p>
					<i class="fa-solid fa-clock"></i>
					<span class="sidebarTitle" id="currentTime">${i18n.loading}</span>
				</p>
			</div>
		</div>
		<div id="messageList"></div>
	`);
	let errorMessageCount = 0;
	window.addEventListener('error', event => addErrorMessage([
		[i18n.error.type, i18n.error.error.title],
		[i18n.error.error.filename, (() => {
			const a = document.createElement('a');
			a.textContent = location.href;
			a.href = location.href;
			return a.outerHTML;
		})()],
		[i18n.error.error.lineno, event.lineno],
		[i18n.error.error.colno, event.colno],
		[i18n.error.error.message, '<pre>' + (() => {
			const x = document.createElement('code');
			x.textContent = event.message;
			return x.outerHTML;
		})() + '</pre>']
	]));
	window.addEventListener('unhandledrejection', event => addErrorMessage([
		[i18n.error.type, i18n.error.unhandledrejection.title],
		[i18n.error.unhandledrejection.reason, '<pre>' + (() => {
			const x = document.createElement('code');
			x.textContent = event.reason;
			return x.outerHTML;
		})() + '</pre>']
	]));
	const dateFormatter = Intl.DateTimeFormat(i18n.htmlLangName, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}), timeFormatter = Intl.DateTimeFormat(i18n.htmlLangName, {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
	setInterval(() => {
		document.getElementById('currentDate').innerHTML = dateFormatter.format(new Date());
		document.getElementById('currentTime').innerHTML = timeFormatter.format(new Date());
	}, 50);
	switchLight();
	switchLight();
	document.body.append(document.createRange().createContextualFragment(`
		<script
			src="https://giscus.app/client.js"
			data-repo="chenyuan33/chenyuan33.github.io"
			data-repoId="R_kgDOLpttzQ"
			data-category="Announcements"
			data-categoryId="DIC_kwDOLpttzc4CgluD"
			data-mapping="pathname"
			data-strict="1"
			data-reactionsEnabled="1"
			data-emitMetadata="0"
			data-inputPosition="top"
			data-theme="preferred_color_scheme"
			data-lang="${i18n.htmlLangName}"
			data-loading="lazy"
			crossorigin="anonymous"
			async=true
		></script>
	`));
	Array.from(document.getElementsByClassName('supported')).forEach(x => x.innerHTML = '<i class="fa-solid fa-check"></i> ' + i18n.supporting.yes);
	Array.from(document.getElementsByClassName('unsupported')).forEach(x => x.innerHTML = '<i class="fa-solid fa-xmark"></i> ' + i18n.supporting.no);
});
const $buoop = {
	required: {
		e: -6,
		f: -6,
		o: -6,
		s: -6,
		c: -6
	},
	insecure: true,
	unsupported: true,
	api: 2026.02
}, $buo_f = () => {
	const e = document.createElement('script'); 
	e.src = '//browser-update.org/update.min.js'; 
	document.body.appendChild(e);
};
try {
	document.addEventListener('DOMContentLoaded', $buo_f, false);
}
catch (e) {
	window.attachEvent('onload', $buo_f);
}