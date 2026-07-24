let dialogId = 0;
/**
 * A button to do something, and displays in the end of a dialog.
 * @typedef {Object} DialogBtn
 * @property {String | HTMLElement} [text=''] The content of the button. Allowed HTML if it is a string.
 * @property {boolean} [close=true] Close the dialog if the value is `true`.
 * @property {Function} [callback=()=>{}] Called when the button is clicked.
 */
/**
 * Create a dialog.
 * @param {String | HTMLElement} content The content of the dialog. Allowed HTML if it is a string.
 * @param {DialogBtn[]} buttons Buttons to do something, and display in the end of the dialog.
 * @returns {Promise<*>} A Promise indicating whether the dialog has been closed.
 * The value of this Promise is equal to the return value of the callback function provided by the close button,
 * or `undefined` if the dialog was closed by clicking the close button displayed in the upper-right corner of the dialog or the shadow outside the dialog.
 */
function createDialog(content, buttons) {
	dialogId++;
	const dialog = document.createElement('div'), dialogMain = document.createElement('div'), closeBtn = document.createElement('i'), dialogBtns = document.createElement('div');
	let resolver;
	const ret = new Promise(resolve => resolver = resolve);
	dialogBtns.classList.add('dialog-buttons');
	buttons.forEach(info => {
		info.text ??= '';
		info.close ??= true;
		info.callback ??= () => {};
		const btn = document.createElement('button');
		if (typeof info.text === "string") {
			btn.innerHTML = info.text;
		} else {
			btn.append(content);
		}
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
			max-height: 80%;
			overflow: auto;
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