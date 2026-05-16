let contentTabsId = 0;
const contentTabs = (list, defaultId = 0) => {
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
}, contentTabDisplay = (tabsId, tabLength, tabId) => {
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