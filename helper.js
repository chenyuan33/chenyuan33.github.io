document.writeln(`
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" type="text/css" href="/csses.css" />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
	<link rel="icon" type="image/png" href="/favicon.png" />
	<style id="volatileStyles"></style>
`);
if (localStorage.getItem('lang') === null) {
	localStorage.lang = 'en-us';
}
let i18n = undefined, bothBasicAndI18nAreLoaded = 0;
let loading = () => {
	if (++bothBasicAndI18nAreLoaded >= 2) {
		document.documentElement.lang = i18n.htmlLangName;
		let waitForI18nList = document.getElementsByClassName('wait-for-i18n');
		for (let i = 0; i < waitForI18nList.length; i++) {
			let node = waitForI18nList[i];
			let res = i18n;
			node.dataset.i18n.split('.').forEach(str => res = res[str]);
			node.innerHTML = res;
		}
		document.getElementsByTagName('title')[0].innerText += ' - ' + i18n.siteName;
		let sidebar = document.createElement('div');
		sidebar.id = 'sidebar';
		sidebar.innerHTML = `
			<div id="sidebarContent">
				<h3>
					<i class="fa-solid fa-location-dot"></i>
					<span class="sidebarTitle">${i18n.sidebar.navigation}</span>
				</h3>
				<p><a href="/${i18n.langName}/index.html">
					<i class="fa-solid fa-house"></i>
					<span class="sidebarTitle">${i18n.sidebar.mainPage}</span>
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
						['en-us', 'zh-cn'].forEach(totLang => ret += `
							<p ${i18n.langName === totLang ? "class='sidebarCurrentChoice'" : ''}><a href="javascript:modifyLang('${totLang}')">
								<i class="fa-solid fa-${i18n.langName == totLang ? "check-circle" : "circle"}"></i>
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
					<i class="fa-solid fa-clock"></i>
					<span class="sidebarTitle" id="currentDateTime">${i18n.sidebar.loading}...</span>
				</p>
			</div>
		`;
		document.body.firstChild.before(sidebar);
		setInterval(() => {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			document.getElementById('currentDateTime').innerHTML = `${year}/${month}/${day} <br /> ${hours}:${minutes}:${seconds}`;
		}, 50);
		switchLight();
		switchLight();
		let giscus = document.createElement("script");
		giscus.src = "https://giscus.app/client.js";
		giscus.dataset.repo = "chenyuan33/chenyuan33.github.io";
		giscus.dataset.repoId = "R_kgDOLpttzQ";
		giscus.dataset.category = "Announcements";
		giscus.dataset.categoryId = "DIC_kwDOLpttzc4CgluD";
		giscus.dataset.mapping = "pathname";
		giscus.dataset.strict = "1";
		giscus.dataset.reactionsEnabled = "1";
		giscus.dataset.emitMetadata = "0";
		giscus.dataset.inputPosition = "top";
		giscus.dataset.theme = "preferred_color_scheme";
		giscus.dataset.lang = i18n.htmlLangName;
		giscus.dataset.loading = "lazy";
		giscus.crossorigin = "anonymous";
		giscus.async = true;
		document.body.appendChild(giscus);
		Array.from(document.getElementsByClassName('supported')).forEach(x => x.innerHTML = '<i class="fa-solid fa-check"></i> ' + i18n.supporting.yes);
		Array.from(document.getElementsByClassName('unsupported')).forEach(x => x.innerHTML = '<i class="fa-solid fa-xmark"></i> ' + i18n.supporting.no);
	}
}, switchLight = () => {
	if (localStorage.getItem("lightMode") === "dark") {
		localStorage.lightMode = "light";
		document.getElementById("lightSwitchIcon").classList = "fa-solid fa-sun";
		volatileStyles.innerHTML = `
			body, textarea {
				color: black;
				background-color: white;
			}

			blockquote {
				background-color: #f9f9f9;
				border-left: 5px solid #ccc;
			}

			a, .buttonInTable {
				color: blue;
			}
		`;
	}
	else {
		localStorage.lightMode = "dark";
		document.getElementById("lightSwitchIcon").classList = "fa-solid fa-moon";
		volatileStyles.innerHTML = `
			body, textarea {
				color: white;
				background-color: black;
			}

			blockquote {
				background-color: gray;
				border-left: 5px solid #ccc;
			}

			a, .buttonInTable {
				color: cyan;
			}
		`;
	}
}, randomShuffle = arr => {
	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}, modifyLang = lang => {
	localStorage.lang = lang;
	location.reload();
};
fetch(`/i18n/${localStorage.lang}.json`)
	.then(response => response.json())
	.then(data => {
		i18n = data;
		loading();
	})
	.catch(error => alert(
		'We encountered an unexpected error: ' +
		'Unable to retrieve i18n content. ' +
		'Please contact the website owner or developer to resolve this issue. ' +
		'More information: ' + error
	));
window.addEventListener('load', loading);