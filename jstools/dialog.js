let dialogId = 0;
function createDialog(content, buttons) {
	dialogId++;
	const dialog = document.createElement('div'), dialogMain = document.createElement('div'), closeBtn = document.createElement('i'), dialogBtns = document.createElement('div');
	let resolver;
	const ret = new Promise(resolve => resolver = resolve);
	dialogBtns.classList.add('dialog-buttons');
	buttons.forEach((info, id) => {
		if (!info.hasOwnProperty('html')) {
			info.html = '';
		}
		if (!info.hasOwnProperty('close')) {
			info.close = true;
		}
		if (!info.hasOwnProperty('callback')) {
			info.callback = () => {};
		}
		const btn = document.createElement('button');
		btn.innerHTML = info.html;
		btn.addEventListener('click', info.close ? () => {
			resolver(info.callback());
			dialog.remove();
		} : info.callback);
		dialogBtns.append(btn);
	});
	closeBtn.classList.add('dialog-close-btn', 'fa-solid', 'fa-xmark');
	dialogMain.classList.add('dialog-main');
	dialogMain.innerHTML = `<div>${content}</div>`;
	dialogMain.append(closeBtn, dialogBtns);
	dialog.id = `dialog-${dialogId}`;
	dialog.classList.add('dialog');
	dialog.innerHTML = '<div class="dialog-bg"></div>';
	closeBtn.addEventListener('click', () => {
		dialog.remove();
		resolver();
	});
	dialog.getElementsByClassName('dialog-bg')[0].addEventListener('click', () => {
		dialog.remove();
		resolver();
	});
	dialog.append(dialogMain);
	document.body.append(dialog);
	return ret;
}
document.head.insertAdjacentHTML('beforeend', `
	<style>
		.dialog {
			background-color: inherit;
		}
		.dialog-bg {
			background-color: black;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			opacity: 0.5;
		}
		.dialog-main {
			position: fixed;
			top: 50%;
			transform: translateY(-50%);
			left: 100px;
			right: 100px;
			border: solid;
			border-radius: 10px;
			background-color: inherit;
			padding: 20px;
		}
		.dialog-close-btn {
			position: absolute;
			top: 30px;
			right: 20px;
			cursor: pointer;
		}
		.dialog-buttons {
			text-align: right;
		}
	</style>
`);