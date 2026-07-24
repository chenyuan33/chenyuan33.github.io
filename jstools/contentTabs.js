let contentTabsId = 0;
/**
 * The object to be in a param in the function `contentTabs`.
 * @typedef {Object} ContentTab
 * @property {string | HTMLElement} name The name of the tab. Allowed HTML if it is a string.
 * @property {string | HTMLElement} content The content of the tab. Allowed HTML if it is a string.
 */
/**
 * Generate content tabs from params.
 * @param {ContentTab[]} list The content tabs. Each item should be `{ name: 'Tab 1', content: '<p>This is the first tab.</p>' }`.
 * @param {Number} [defaultId=0] The default showing tab id (default 0).
 * @returns {string} The full HTML.
 */
const contentTabs = (list, defaultId = 0) => {
	const DOMGener = new DOMParser(), toRawHTMLString = t => typeof t === "string" ? DOMGener.parseFromString(t, 'text/html').body.innerHTML : t.outerHTML;
	let fixedList = [];
	for (const ele of list) {
		fixedList.push({ name: toRawHTMLString(ele.name), content: toRawHTMLString(ele.content) });
	}
	list = fixedList;
	defaultId = Number(defaultId);
	contentTabsId++;
	let ret = '';
	for (let i = 0; i < list.length; i++) {
		ret += `<button onclick="contentTabDisplay(${contentTabsId}, ${list.length}, ${i})" id="contentTabButton${contentTabsId}-${i}" class="contentTabButton${defaultId === i ? ' contentTabButtonSelected' : ''}">${list[i].name}</button>`;
	}
	for (let i = 0; i < list.length; i++) {
		ret += `<div id="contentTab${contentTabsId}-${i}" class="contentTab${defaultId === i ? ' contentTabSelected' : ''}">${list[i].content}</div>`;
	}
	return `<div>${ret}</div>`;
};
const contentTabDisplay = (tabsId, tabLength, tabId) => {
	for (let i = 0; i < tabLength; i++) {
		if (document.getElementById(`contentTab${tabsId}-${i}`).classList.contains('contentTabSelected')) {
			document.getElementById(`contentTab${tabsId}-${i}`).classList.remove('contentTabSelected');
			document.getElementById(`contentTabButton${tabsId}-${i}`).classList.remove('contentTabButtonSelected');
		}
		if (i === tabId) {
			document.getElementById(`contentTab${tabsId}-${i}`).classList.add('contentTabSelected');
			document.getElementById(`contentTabButton${tabsId}-${i}`).classList.add('contentTabButtonSelected');
		}
	}
};
document.head.insertAdjacentHTML('beforeend', `
	<style>
		.contentTabButton {
			background-color: inherit;
			border: none;
			font: inherit;
			border-bottom: solid lightgray;
			color: darkgray;
		}

		.contentTabButtonSelected {
			border-bottom: solid;
			color: inherit;
		}

		.contentTab {
			border: solid;
			border-radius: 5px;
			padding: 10px;
			margin-top: 1px;
			display: none;
		}

		.contentTabSelected {
			display: block;
		}
	</style>
`);