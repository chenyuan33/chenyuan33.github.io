document.head.append(document.createRange().createContextualFragment(`
	<style>
		.mdeditor-table, .mdeditor-table tbody, .mdeditor-table tr, .mdeditor-table td, .mdeditor-button, .mdeditor-button-name {
			background-color: inherit;
		}

		.mdeditor-input {
			resize: none;
			height: 300px;
			width: 200px;
			overflow: auto;
			border-style: none;
			outline: none;
		}

		.mdeditor-output {
			height: 300px;
			width: 200px;
			overflow: auto;
		}

		.mdeditor-buttondiv {
			display: none;
			width: 400px;
			position: relative;
		}

		.mdeditor-button {
			position: relative;
			color: inherit;
		}

		.mdeditor-close-doc-button {
			background-color: unset;
		}

		.mdeditor-button, .mdeditor-close-doc-button {
			border: none;
			font: inherit;
		}

		.mdeditor-button:hover, .mdeditor-close-doc-button:hover {
			cursor: pointer;
		}

		.mdeditor-button-name {
			position: absolute;
			top: -40px;
			border: solid;
			border-radius: 5px;
			padding: 5px;
			left: 50%;
			transform: translateX(-50%);
			opacity: 0;
			transition: opacity 0.2s ease;
			pointer-events: none;
			white-space: nowrap;
		}

		.mdeditor-button-name::after {
			content: '';
			position: absolute;
			top: 110%;
			left: 50%;
			transform: translateX(-50%);
			border: 5px solid transparent;
			border-top-color: inherit;
		}

		.mdeditor-doc {
			display: none;
			position: fixed;
			left: 10%;
			right: 10%;
			top: 10%;
			bottom: 10%;
		}

		.mdeditor-doc-background {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: black;
			opacity: 50%;
		}

		.mdeditor-close-doc-button {
			position: absolute;
			right: 5%;
			top: 5%;
		}

		.mdeditor-doc-content {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			border: solid;
			border-radius: 10px;
			overflow: auto;
			padding: 10px;
			background-color: white;
		}
	</style>
	<script src="https://chenyuan33.github.io/jstools/dialog.js"></script>
`));
const DOMPurifyFragment = document.createRange().createContextualFragment('<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.5/purify.min.js" integrity="sha384-rneZSW/1QE+3/U5/u+/7eRNi/tRc+SzS+yXy36fltr1tDN9EHaVo1Bwz2Z8o8DA4" crossorigin="anonymous"></script>')
const DOMPurifyLoaded = new Promise(resolve => DOMPurifyFragment.querySelector('script').onload = () => resolve());
document.head.append(DOMPurifyFragment);
/**
 * Convert a string containing inline Markdown into a string containing HTML.
 * @param {string} md The string containing Markdown
 * @param {Object} options Options to convert Markdown
 * @param {boolean} [options.safe=true] Safe Mode
 * @param {boolean} [options.allowHtml=true] Allow HTML tags in the input to be rendered in the output
 */
const inlineMdToHtml = async (md, options) => {
	options ??= {};
	options.safe ??= true;
	options.allowHtml ??= true;
	let codes = [];
	let html = md
		.replaceAll(/(?<!`)(`+)(.*?)\1(?!`)/g, (_, __, code) => {
			codes.push(code.replaceAll(/&/g, '&amp;').replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;').replaceAll(/"/g, '&quot;'));
			return `\x00CODE_${codes.length - 1}\x00`
		})
		.replaceAll(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replaceAll(/\b__(.+?)__\b/g, '<strong>$1</strong>')
		.replaceAll(/\*(.+?)\*/g, '<em>$1</em>')
		.replaceAll(/\b_(.+?)_\b/g, '<em>$1</em>')
		.replaceAll(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
		.replaceAll(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
		.replaceAll(/\\(.)/g, '$1');
	if (!options.allowHtml) {
		html = html.replaceAll(/&/g, '&amp;').replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;').replaceAll(/"/g, '&quot;');
	}
	if (options.safe) {
		await DOMPurifyLoaded;
		html = DOMPurify.sanitize(html);
	}
	return html.replaceAll(/\x00CODE_(\d+)\x00/g, (_, idx) => `<code>${codes[parseInt(idx)]}</code>`);
};
/**
 * Convert a string containing Markdown into a string containing HTML.
 * @param {string} md The string containing Markdown
 * @param {Object} options Options to convert Markdown
 * @param {boolean} [options.safe=true] Safe Mode
 * @param {boolean} [options.allowHtml=true] Allow HTML tags in the input to be rendered in the output
 */
const mdToHtml = async (md, options) => {
	options ??= {};
	options.safe ??= true;
	let html = '';
	const lines = md.split('\n'), markerGenerator = (htmlTagName, contentOutline, subMarker = null) => ({
		name: htmlTagName,
		_started: false,
		content: '',
		subMarker: subMarker,
		started() {
			return this._started;
		},
		async start(started, attr = {}) {
			started = !!started;
			if (this._started !== started) {
				this._started = started;
				if (!started) {
					if (contentOutline || this.name === 'li' && /^(\n|#{1,6} |>|\+ |- |\* |\d+\. |\+{3,}|-{3,}|_{3,})/.test(this.content)) {
						html += await mdToHtml(this.content, options);
					} else {
						html += await inlineMdToHtml(this.content, options);
					}
				}
				this.content = '';
				if (!started && this.subMarker) {
					await this.subMarker.start(false);
				}
				html += `<${started ? '' : '/'}${htmlTagName} ${started ? Object.entries(attr).map(([key, val]) => `${key}=${val.replaceAll('"', '&quot;')}`).join(' ') : ''}>`;
			}
		},
		async restart(started) {
			await this.start(false);
			await this.start(true);
		}
	});
	const paragraphMarker = markerGenerator('p', false);
	const blockquoteMarker = markerGenerator('blockquote', true);
	const unorderedListMarker = markerGenerator('ul', true, markerGenerator('li', false));
	const orderedListMarker = markerGenerator('ol', true, markerGenerator('li', false));
	const startMarker = async (startMarker, attr) => {
		for (const marker of [
			paragraphMarker,
			blockquoteMarker,
			unorderedListMarker,
			orderedListMarker
		]) {
			await marker.start(startMarker === marker.name, attr);
		}
	};
	const endMarker = async () => await startMarker(null);
	for (const curLine of lines) {
		if (curLine.startsWith('  ') || curLine.startsWith('\t')) {
			if (unorderedListMarker.started()) {
				unorderedListMarker.subMarker.content += curLine.substring(curLine.startsWith('  ') ? 2 : 1);
				continue;
			}
			if (orderedListMarker.started()) {
				orderedListMarker.subMarker.content += curLine.substring(curLine.startsWith('  ') ? 2 : 1);
				continue;
			}
		}
		const trimed = curLine.trim();
		let gened = false;
		for (let headingLevel = 6; headingLevel > 0; headingLevel--) {
			if (trimed.startsWith('#'.repeat(headingLevel) + ' ')) {
				await endMarker();
				html += `<h${headingLevel}>${await inlineMdToHtml(trimed.substring(headingLevel + 1), options)}</h${headingLevel}>`;
				gened = true;
				break;
			}
		}
		if (gened)
		{
			continue;
		}
		if (trimed == '') {
			await endMarker();
			continue;
		}
		if (trimed.startsWith('>') || blockquoteMarker.started()) {
			await startMarker('blockquote');
			blockquoteMarker.content += (trimed.startsWith('>') ? trimed.substring(1) : trimed).trim() + '\n';
			continue;
		} else {
			await blockquoteMarker.start(false);
		}
		if (trimed.startsWith('+ ') || trimed.startsWith('- ') || trimed.startsWith('* ')) {
			await startMarker('ul');
			await unorderedListMarker.subMarker.restart();
			unorderedListMarker.subMarker.content += trimed.substring(2).trim() + '\n';
			continue;
		} else if (unorderedListMarker.started()) {
			unorderedListMarker.subMarker.content += trimed + '\n';
			continue;
		} else {
			await unorderedListMarker.start(false);
		}
		if (/^\d+\. /.test(trimed)) {
			await startMarker('ol', {start: parseInt(trimed).toString()});
			await orderedListMarker.subMarker.restart();
			orderedListMarker.subMarker.content += trimed.replace(/^\d+\. /, '').trim() + '\n';
			continue;
		} else if (orderedListMarker.started()) {
			orderedListMarker.subMarker.content += trimed + '\n';
			continue;
		} else {
			await orderedListMarker.start(false);
		}
		if (/^([*_\-])\1{2,}$/g.test(trimed)) {
			await endMarker();
			html += '<hr />';
			continue;
		}
		await startMarker('p');
		paragraphMarker.content += trimed + '\n';
		if (curLine.endsWith('  ') || curLine.endsWith('\\')) {
			html += '<br />';
		}
	}
	await endMarker();
	if (options.safe) {
		await DOMPurifyLoaded;
		html = DOMPurify.sanitize(html);
	}
	return html;
};
/**
 * Create a Markdown Editor.
 * @param {string} id The id of the Markdown Editor. It should be single in a page.
 * @param {'en-us' | 'zh-cn'} [lang] The Language of the Markdown Editor.
 * @returns {string} The HTML of the Markdown Editor.
 */
const createMdEditor = async (id, lang = 'en-us') => {
	if (typeof lang === 'string' && ['zh', 'zh-cn'].find(x => x === lang.toLowerCase()) !== undefined) {
		lang = 'zh-cn';
	} else {
		lang = 'en-us';
	}
	const i18n = {
		'en-us': {
			ok: 'OK'
		},
		'zh-cn': {
			ok: '确定'
		}
	}[lang];
	const features = [
// 		{
// 			name: 'futureSupportedFeatures',
// 			icon: 'flask',
// 			title: {
// 				'en-us': 'Future supported features',
// 				'zh-cn': '未来将会支持的功能'
// 			}[lang],
// 			content: await mdToHtml({
// 				'en-us': `
// ## Future supported features
// - Extended Markdown syntax: 
// 	- Warning: ([See here](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)), a block with an optional title and content; options include whether it is collapsible, whether it is collapsed by default:
// 	- Notes: ([See here](https://squidfunk.github.io/mkdocs-material/reference/annotations/)), allows collapsing inline text (supported only comments in code blocks)
// 	- Attributes can be added to text (e.g., #xxx for id, .xxx for class, xxx=yyy denotes the value of xxx), [.md-button](https://squidfunk.github.io/mkdocs-material/reference/buttons/) button styles, and [.card and .grid](https://squidfunk.github.io/mkdocs-material/reference/grids/) grid styles
// 	- Code blocks can include titles, support line number display (with customizable line numbers for the first line), highlight specific lines, and feature inline code highlighting. Optional automatic parsing or view-only modes are available for Mermaid, Markdown, HTML, JSON, YAML, and diff.
// 	- Multiple content tabs
// 	- Footnotes
// 	- Colors and background colors
// 	- Highlighting and underlining
// 	- Superscript and subscript
// 	- Expressions [Keyboard shortcuts](https://squidfunk.github.io/mkdocs-material/reference/formatting/#adding-keyboard-keys)
// 	- Icons and Emojis
// 	- Task lists
// 	- Mathematical formulas
// 	- Allow outline syntaxes to be inserted in places where only inline syntaxes is permitted
// - Synchronous scrolling (can be customized to enable or disable)
// - The right side displays the unrendered HTML source code (can be toggled on or off)
// - Auxiliary button row:
// 	- Functionality: Save Drafts (cached), Auto-Save (cached, configurable), Import Markdown, Export/Copy Markdown/HTML, Customize Synchronized Scrolling, Customize Real-Time Rendering
// 	- Content-based: Pressing the button adds the corresponding element to the input field. For example, H1 generates a level-1 heading.
// - Syntax Highlighting
// - Table of Contents
// - Custom Editor Size, Full-Screen Editor
// - Let the editor access your website (if you choose to) (Documentation not yet written)
// `,
// 				'zh-cn': `
// ## 未来将会支持的功能
// - 更多 Markdown 语法
// 	- 更多语法
// 		- 表格
// 		- 行间代码块
// 		- ~~删除线~~
// 		- [ ] 任务列表
// 		- 自动识别网址并转化成链接
// 		- 警告：（[可参考](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)），带有可选标题和内容的框，可选是否可折叠，可选是否默认折叠：
// 		- 注释：（[可参考](https://squidfunk.github.io/mkdocs-material/reference/annotations/)），可以折叠行内文本（代码块支持且只支持）
// 		- 可以对文本添加属性（#xxx 表示 id，.xxx 表示 class，xxx=yyy 表示 xxx 的值），[.md-button](https://squidfunk.github.io/mkdocs-material/reference/buttons/) 按钮样式，[.card 和 .grid](https://squidfunk.github.io/mkdocs-material/reference/grids/) 网格样式
// 		- 代码块可以添加标题，支持显示行号（允许自定义第一行的行号），可以高亮特定行，行内代码高亮，可选的自动解析/只查看解析 Mermaid、Markdown、HTML、JSON、YAML、diff
// 		- 多标签页
// 		- 脚注
// 		- 颜色和背景颜色
// 		- 高亮和下划线
// 		- 上标和下标
// 		- 表达[键盘快捷键](https://squidfunk.github.io/mkdocs-material/reference/formatting/#adding-keyboard-keys)
// 		- 图标和 Emojis
// 		- 任务列表
// 		- 数学公式
// 		- 允许通过某种方式将行间语法放入仅行内语法允许的位置
// - 设置启用/关闭 Markdown 语法
// - 同步滚动（可自设是否开启）
// - 右边显示未渲染的 HTML 源代码（可自设是否开启）
// - 用于辅助的按钮行：
// 	- 功能类：保存草稿（缓存）、自动保存（缓存，可设置是否开启）、导入 Markdown、导出/复制 Markdown/HTML、自设是否开启同步滚动、自设是否实时渲染
// 	- 内容类：按钮按下后会在输入框内增加对应的东西，如 H1 会产生一级标题
// - 语法高亮
// - 目录
// - 自定义编辑器的大小、全屏编辑器
// - 让编辑器进入你的网站（如果你愿意的话）（暂未编写文档）
// 			`
// 			}[lang])
		// },
		// {
		// 	name: 'markdownSyntax',
		// 	icon: 'code',
		// 	title: {
		// 		'en-us': 'Markdown Syntax (Chinese)',
		// 		'zh-cn': 'Markdown 语法'
		// 	}[lang],
		// 	content: `
		// 		<h2>已支持的 Markdown 语法</h2>
		// 		<table>
		// 			<thead>
		// 				<tr>
		// 					<th>类型</th>
		// 					<th>Markdown</th>
		// 					<th>HTML</th>
		// 					<th>预览</th>
		// 					<th>注意</th>
		// 				</tr>
		// 			</thead>
		// 			<tbody>
		// 				${(() => {
		// 					let str = '';
		// 					[
		// 						{
		// 							type: '标题',
		// 							md:
		// 								'# H1-content\n' +
		// 								'## H2-content\n' +
		// 								'### H3-content\n' +
		// 								'#### H4-content\n' +
		// 								'##### H5-content\n' +
		// 								'###### H6-content',
		// 							notice: '默认情况下 <code>#</code> 和内容之间要有空格'
		// 						},
		// 						{
		// 							type: '段落',
		// 							md:
		// 								'text-content1\n' +
		// 								'\n' +
		// 								'text-content2',
		// 							notice: '两个换行才能达成换行的效果'
		// 						},
		// 						{
		// 							type: '换行',
		// 							md:
		// 								'text-content1  \n' +
		// 								'text-content2',
		// 							notice: '前一行行末有两个空格'
		// 						},
		// 						{
		// 							type: '粗体',
		// 							md:
		// 								'**bold1**\n' +
		// 								'__bold2__',
		// 							notice: '如果使用下划线（<code>_</code>），那么需要空格才能渲染'
		// 						},
		// 						{
		// 							type: '斜体',
		// 							md:
		// 								'*bold1*\n' +
		// 								'_bold2_',
		// 							notice: '如果使用下划线（<code>_</code>），那么需要空格才能渲染'
		// 						},
		// 						{
		// 							type: '引用',
		// 							md:
		// 								'> text\n' +
		// 								'>\n' +
		// 								'> > inner\n' +
		// 								'> >\n' +
		// 								'> > **bold**',
		// 							notice: '可以嵌套其它语法'
		// 						},
		// 						{
		// 							type: '无序列表',
		// 							md:
		// 								'+ text\n' +
		// 								'+ text\n' +
		// 								'\n' +
		// 								'- text\n' +
		// 								'- text\n' +
		// 								'\n' +
		// 								'* text\n' +
		// 								'* text\n' +
		// 								'\n' +
		// 								'- text\n' +
		// 								'- text\n' +
		// 								'  - inner\n' +
		// 								'  - inner\n',
		// 							notice: '有 bug'
		// 						},
		// 						{
		// 							type: '有序列表',
		// 							md:
		// 								'1. text\n' +
		// 								'2. text\n' +
		// 								'\n' +
		// 								'1. text\n' +
		// 								'1. text\n' +
		// 								'\n' +
		// 								'2. text\n' +
		// 								'3. text\n' +
		// 								'\n' +
		// 								'1. text\n' +
		// 								'2. text\n' +
		// 								'   1. inner\n' +
		// 								'   2. inner\n',
		// 							notice: '有 bug'
		// 						},
		// 						{
		// 							type: '代码块',
		// 							md:
		// 								'`inline code`\n' +
		// 								'\n' +
		// 								'    outline code line1\n' +
		// 								'    outline code line2\n' +
		// 								'\n' +
		// 								'```\n' +
		// 								'another outline code line1\n' +
		// 								'another outline code line2\n' +
		// 								'```\n' +
		// 								'``` cpp\n' +
		// 								'#include <iostream>\n' +
		// 								'using namespace std;\n' +
		// 								'int main()\n' +
		// 								'{\n' +
		// 								'    int a, b;\n' +
		// 								'    cin >> a >> b;\n' +
		// 								'    cout << a + b;\n' +
		// 								'    return 0;\n' +
		// 								'}\n' +
		// 								'```\n' +
		// 								'\n' +
		// 								'```` markdown\n' +
		// 								'``` py\n' +
		// 								"print('Hello, world!')\n" +
		// 								'```\n' +
		// 								'````',
		// 							notice: '有 bug'
		// 						}
		// 					].forEach(ele => str += `
		// 							<tr>
		// 								<th>${ele.type}</th>
		// 								<td><pre><code>${ele.md}</code></pre></td>
		// 								<td><pre><code>${(html => {
		// 									const container = document.createElement('div');
		// 									container.innerHTML = html.trim();
		// 									function formatNode(node, indent = '') {
		// 										let result = '';
		// 										if (node.nodeType === Node.TEXT_NODE) {
		// 											const text = node.textContent.trim();
		// 											if (text) {
		// 												result += indent + text + '\n';
		// 											}
		// 										} else if (node.nodeType === Node.ELEMENT_NODE) {
		// 											const tagName = node.tagName.toLowerCase();
		// 											const children = Array.from(node.childNodes);
		// 											result += indent + '<' + tagName;
		// 											Array.from(node.attributes).forEach(attr => result += ` ${attr.name}='${attr.value}'`);
		// 											if (children.length === 0) {
		// 												result += ' />\n';
		// 											} else if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
		// 												const content = children[0].textContent.trim();
		// 												result += '>' + content + `</${tagName}>\n`;
		// 											} else {
		// 												result += '>\n';
		// 												children.forEach(child => result += formatNode(child, indent + '    '));
		// 												result += `${indent}</${tagName}>\n`;
		// 											}
		// 										}
		// 										return result;
		// 									}
		// 									let result = '';
		// 									container.childNodes.forEach(ele => result += formatNode(ele).trim() + '\n');
		// 									return result;
		// 								})(mdToHtml(ele.md))
		// 									.replaceAll('<', '&lt;')
		// 									.replaceAll('>', '&gt;')
		// 									.replaceAll(/(&lt;.*?&gt;)(&lt;.*?&gt;)/g, '$1\n$2')
		// 								}</code></pre></td>
		// 								<td>${mdToHtml(ele.md)}</td>
		// 								<td>${ele.notice}</td>
		// 							</tr>
		// 						`);
		// 					return str;
		// 				})()}
		// 			</tbody>
		// 		</table>
		// 	`
		// },
		// {
		// 	name: 'settings',
		// 	icon: 'gear',
		// 	title: {
		// 		'en-us': 'Settings',
		// 		'zh-cn': '设置'
		// 	}[lang],
		// 	content: `
		// 		<h2>${{ 'en-us': 'Settings', 'zh-cn': '设置' }[lang]}</h2>
		// 		<input type="checkbox" id="mdeditor-settings-autosave" /><label for="mdeditor-settings-autosave">${{ 'en-us': 'Auto Save', 'zh-cn': '自动保存' }[lang]}</label><br />
		// 		<button>${{ 'en-us': 'Save', 'zh-cn': '保存' }[lang]}</button> <button>${{ 'en-us': 'Reset to the Default', 'zh-cn': '重置为默认' }[lang]}</button>
		// 	`
		// }
	];
	return `
		<table class='mdeditor-table'>
			<tbody>
				<tr><td colspan='2' class='mdeditor-buttondiv'>${(() => {
					let str = '';
					features.forEach(ele => str += `
						<button
							id='mdeditor-button-${ele.name}${id}'
							class='mdeditor-button'
							onclick="createDialog(\`${ele.content.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('"', '&quot;')}\`, [{text: '${i18n.ok}'}])"
						>
							<i class='fa-solid fa-${ele.icon}'></i>
							<div class='mdeditor-button-name' id='mdeditor-button-name-${ele.name}${id}'>${ele.title}</div>
						</button>
					`);
					return str;
				})()}</td></tr>
				<tr>
					<td><textarea class='mdeditor-input' id='mdeditor-input${id}' oninput="(async () => document.getElementById('mdeditor-output${id}').innerHTML = await mdToHtml(document.getElementById('mdeditor-input${id}').value))()"></textarea></td>
					<td class='mdeditor-output' id='mdeditor-output${id}'></td>
				</tr>
			</tbody>
		</table>
	`;
}