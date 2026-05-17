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
		}

		.mdeditor-output {
			height: 300px;
			width: 200px;
			overflow: auto;
		}

		.mdeditor-buttondiv {
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
const mdtohtml = (md) => {
	let html = '';
	md.split('\n\n').forEach(element => {
		let line = element.trim();
		if (line === '') {
			return;
		}
		const x = line.split(/^(`{3,})(.*?)?\n([\s\S]*?)^(\1)/m);
		let curlang = 'plain';
		line = '';
		for (let i = 0; i < x.length; i++) {
			switch (i % 5) {
				case 0:
					if (x[i].match(/^\s*>[\s\S]*/igm)) {
						let y = x[i].split(/^\s*>/igm);
						x[i] = mdtohtml(y[0]);
						y = y.slice(1);
						html += x[i] + `<blockquote>${mdtohtml(y.join(''))}</blockquote>`;
						continue;
					}
					if (x[i].match(/^[ \t]*\d+\. /igm)) {
						const z = x[i].split(/^[ \t]*\d+\. /igm);
						let cur = mdtohtml(z[0]) + `<ol start=${z[1].split('.')[0]}>`;
						for (let i = 1; i < z.length; i++) {
							let y = mdtohtml(z[i]);
							if (y.startsWith('<p>') && y.endsWith('</p>')) {
								y = y.substring(3, y.length - 4);
							}
							cur += `<li>${y}</li>`;
						}
						html += cur + '</ol>';
						continue;
					}
					if (x[i].match(/^[ \t]*[-+*] /igm)) {
						const z = x[i].split(/^[ \t]*[-+*] /igm);
						let cur = mdtohtml(z[0]) + `<ul>`;
						for (let i = 1; i < z.length; i++) {
							let y = mdtohtml(z[i]);
							if (y.startsWith('<p>') && y.endsWith('</p>')) {
								y = y.substring(3, y.length - 4);
							}
							cur += `<li>${y}</li>`;
						}
						html += cur + '</ul>';
						continue;
					}
					line += x[i]
						.replace(/^# (.*?)$/igm, '</p><h1>$1</h1><p>')
						.replace(/^## (.*?)$/igm, '</p><h2>$1</h2><p>')
						.replace(/^### (.*?)$/igm, '</p><h3>$1</h3><p>')
						.replace(/^#### (.*?)$/igm, '</p><h4>$1</h4><p>')
						.replace(/^##### (.*?)$/igm, '</p><h5>$1</h5><p>')
						.replace(/^###### (.*?)$/igm, '</p><h6>$1</h6><p>')
						.replace(/\x20\x20\n/igm, '<br />')
						.replace(/\*\*\*([\s\S]*?)\*\*\*/igm, '<strong><em>$1</em></strong>')
						.replace(/\*\*([\s\S]*?)\*\*/igm, '<strong>$1</strong>')
						.replace(/\*([\s\S]*?)\*/igm, '<em>$1</em>')
						.replace(/\b___([\s\S]*?)___\b/igm, '<strong><em>$1</em></strong>')
						.replace(/\b__([\s\S]*?)__\b/igm, '<strong>$1</strong>')
						.replace(/\b_([\s\S]*?)_\b/igm, '<em>$1</em>')
						.replace(/`(.+?)`/igm, '<code>$1</code>');
				case 1:
					line += '<pre><code>';
				case 2:
					if (x[i] === undefined) {
						x[i] = '';
					}
					curlang = x[i].trim();
				case 3:
					line += x[i]
						.replace(/^\n+|\n+$/g, '')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;');
				case 4:
					line += '</code></pre>';
			}
		}
		if (line.startsWith('\t') || line.startsWith('    ')) {
			const x = line.split('\n'), i = 0;
			line = '<pre><code>';
			for (; i < x.length && (x[i].startsWith('\t') || x[i].startsWith('    ')); i++) {
				if (x[i].startsWith('\t')) {
					line += x[i].substring(1) + '\n';
				} else {
					line += x[i].substring(4) + '\n';
				}
			}
			line += '</code></pre>' + mdtohtml(x.slice(i));
		}
		html += `<p>${line}</p>`;
	});
	return html.replace(/<p>\s*<\/p>/igm, '');
}, createMdEditor = (id, lang) => {
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
		{
			name: 'about',
			icon: 'question-circle',
			title: {
				'en-us': 'About',
				'zh-cn': '关于'
			}[lang],
			content: mdtohtml({
				'en-us': '## About\nIn the editor above, the left pane displays your Markdown text input, while the right pane shows the rendered HTML code. As you type, the HTML code on the right updates in real time. All Markdown-to-HTML conversion and display occurs locally, eliminating concerns about data leakage.',
				'zh-cn': '## 关于\n上面的编辑器中，左边是输入的 Markdown 文本，右边是渲染后的 HTML 代码。输入文本时，右边的 HTML 代码会实时更新。所有 Markdown 到 HTML 的转换和显示均在本地进行，无需担心数据泄露的问题。'
			}[lang])
		},
		{
			name: 'futureSupportedFeatures',
			icon: 'flask',
			title: {
				'en-us': 'Future supported features',
				'zh-cn': '未来将会支持的功能'
			}[lang],
			content: mdtohtml({
				'en-us': `
## Future supported features
- Support for more Markdown syntax
- Optional markdown syntax:
	- Title: Display works fine even without a space between the \`#\` and the content
	- Line breaks: Use [\`\\\` + line break] or [direct line break] to create line breaks
	- Bold/Italic: Whether to render when using underline with no spaces on either side of the underline
	- Code Block: Syntax Highlighting
- Extended Markdown syntax: 
	- Warning: ([See here](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)), a block with an optional title and content; options include whether it is collapsible, whether it is collapsed by default, and whether it includes an icon:
		\`\`\` yaml
		note: fontawesome/solid/note-sticky
		abstract: fontawesome/solid/book
		info: fontawesome/solid/circle-info
		tip: fontawesome/solid/bullhorn
		success: fontawesome/solid/check
		question: fontawesome/solid/circle-question
		warning: fontawesome/solid/triangle-exclamation
		failure: fontawesome/solid/bomb
		danger: fontawesome/solid/skull
		bug: fontawesome/solid/robot
		example: fontawesome/solid/flask
		quote: fontawesome/solid/quote-left
		\`\`\`
	- Notes: ([See here](https://squidfunk.github.io/mkdocs-material/reference/annotations/)), allows collapsing inline text (supported only comments in code blocks)
	- Attributes can be added to text (e.g., #xxx for id, .xxx for class, xxx=yyy denotes the value of xxx), [.md-button](https://squidfunk.github.io/mkdocs-material/reference/buttons/) button styles, and [.card and .grid](https://squidfunk.github.io/mkdocs-material/reference/grids/) grid styles
	- Code blocks can include titles, support line number display (with customizable line numbers for the first line), highlight specific lines, and feature inline code highlighting. Optional automatic parsing or view-only modes are available for Mermaid, Markdown, HTML, JSON, YAML, and diff.
	- Multiple content tabs
	- Footnotes
	- Colors and background colors
	- Highlighting and underlining
	- Superscript and subscript
	- Expressions [Keyboard shortcuts](https://squidfunk.github.io/mkdocs-material/reference/formatting/#adding-keyboard-keys)
	- Icons and Emojis
	- Task lists
	- Mathematical formulas
	- Allow outline syntaxes to be inserted in places where only inline syntaxes is permitted
- Synchronous scrolling (can be customized to enable or disable)
- The right side displays the unrendered HTML source code (can be toggled on or off)
- Auxiliary button row:
	- Functionality: Save Drafts (cached), Auto-Save (cached, configurable), Import Markdown, Export/Copy Markdown/HTML, Customize Synchronized Scrolling, Customize Real-Time Rendering
	- Content-based: Pressing the button adds the corresponding element to the input field. For example, H1 generates a level-1 heading.
- Syntax Highlighting
- Custom Editor Size, Full-Screen Editor
- Let the editor access your website (if you choose to) (Documentation not yet written)
`,
				'zh-cn': `
## 未来将会支持的功能
- 支持更多 Markdown 语法
- 可选的 Markdown 语法：
	- 标题：如果 \`#\` 和内容之间没有空格也可以正常显示
	- 换行：使用【\`\\\`+换行】或【直接换行】进行换行
	- 粗体/斜体：使用下划线并且下划线两边均无空格时是否渲染
	- 代码块：语法高亮
- 扩展 Markdown 语法：
	- 警告：（[可参考](https://squidfunk.github.io/mkdocs-material/reference/admonitions/)），带有可选标题和内容的框，可选是否可折叠，可选是否默认折叠，可选是否包含图标：
		\`\`\` yaml
		note: fontawesome/solid/note-sticky
		abstract: fontawesome/solid/book
		info: fontawesome/solid/circle-info
		tip: fontawesome/solid/bullhorn
		success: fontawesome/solid/check
		question: fontawesome/solid/circle-question
		warning: fontawesome/solid/triangle-exclamation
		failure: fontawesome/solid/bomb
		danger: fontawesome/solid/skull
		bug: fontawesome/solid/robot
		example: fontawesome/solid/flask
		quote: fontawesome/solid/quote-left
		\`\`\`
	- 注释：（[可参考](https://squidfunk.github.io/mkdocs-material/reference/annotations/)），可以折叠行内文本（代码块支持且只支持）
	- 可以对文本添加属性（#xxx 表示 id，.xxx 表示 class，xxx=yyy 表示 xxx 的值），[.md-button](https://squidfunk.github.io/mkdocs-material/reference/buttons/) 按钮样式，[.card 和 .grid](https://squidfunk.github.io/mkdocs-material/reference/grids/) 网格样式
	- 代码块可以添加标题，支持显示行号（允许自定义第一行的行号），可以高亮特定行，行内代码高亮，可选的自动解析/只查看解析 Mermaid、Markdown、HTML、JSON、YAML、diff
	- 多标签页
	- 脚注
	- 颜色和背景颜色
	- 高亮和下划线
	- 上标和下标
	- 表达[键盘快捷键](https://squidfunk.github.io/mkdocs-material/reference/formatting/#adding-keyboard-keys)
	- 图标和 Emojis
	- 任务列表
	- 数学公式
	- 允许通过某种方式将行间语法放入仅行内语法允许的位置
- 同步滚动（可自设是否开启）
- 右边显示未渲染的 HTML 源代码（可自设是否开启）
- 用于辅助的按钮行：
	- 功能类：保存草稿（缓存）、自动保存（缓存，可设置是否开启）、导入 Markdown、导出/复制 Markdown/HTML、自设是否开启同步滚动、自设是否实时渲染
	- 内容类：按钮按下后会在输入框内增加对应的东西，如 H1 会产生一级标题
- 语法高亮
- 自定义编辑器的大小、全屏编辑器
- 让编辑器进入你的网站（如果你愿意的话）（暂未编写文档）
			`
			}[lang])
		},
		{
			name: 'markdownSyntax',
			icon: 'code',
			title: {
				'en-us': 'Markdown Syntax (Only Supported in Chinese version yet)',
				'zh-cn': 'Markdown 语法'
			}[lang],
			content: `
				<h2>已支持的 Markdown 语法</h2>
				<table>
					<thead>
						<tr>
							<th>类型</th>
							<th>Markdown</th>
							<th>HTML</th>
							<th>预览</th>
							<th>注意</th>
						</tr>
					</thead>
					<tbody>
						${(() => {
							let str = '';
							[
								{
									type: '标题',
									md:
										'# H1-content\n' +
										'## H2-content\n' +
										'### H3-content\n' +
										'#### H4-content\n' +
										'##### H5-content\n' +
										'###### H6-content',
									notice: '默认情况下 <code>#</code> 和内容之间要有空格'
								},
								{
									type: '段落',
									md:
										'text-content1\n' +
										'\n' +
										'text-content2',
									notice: '两个换行才能达成换行的效果'
								},
								{
									type: '换行',
									md:
										'text-content1  \n' +
										'text-content2',
									notice: '前一行行末有两个空格'
								},
								{
									type: '粗体',
									md:
										'**bold1**\n' +
										'__bold2__',
									notice: '如果使用下划线（<code>_</code>），那么需要空格才能渲染'
								},
								{
									type: '斜体',
									md:
										'*bold1*\n' +
										'_bold2_',
									notice: '如果使用下划线（<code>_</code>），那么需要空格才能渲染'
								},
								{
									type: '引用',
									md:
										'> text\n' +
										'>\n' +
										'> > inner\n' +
										'> >\n' +
										'> > **bold**',
									notice: '可以嵌套其它语法'
								},
								{
									type: '无序列表',
									md:
										'+ text\n' +
										'+ text\n' +
										'\n' +
										'- text\n' +
										'- text\n' +
										'\n' +
										'* text\n' +
										'* text\n' +
										'\n' +
										'- text\n' +
										'- text\n' +
										'  - inner\n' +
										'  - inner\n',
									notice: '有 bug'
								},
								{
									type: '有序列表',
									md:
										'1. text\n' +
										'2. text\n' +
										'\n' +
										'1. text\n' +
										'1. text\n' +
										'\n' +
										'2. text\n' +
										'3. text\n' +
										'\n' +
										'1. text\n' +
										'2. text\n' +
										'   1. inner\n' +
										'   2. inner\n',
									notice: '有 bug'
								},
								{
									type: '代码块',
									md:
										'`inline code`\n' +
										'\n' +
										'    outline code line1\n' +
										'    outline code line2\n' +
										'\n' +
										'```\n' +
										'another outline code line1\n' +
										'another outline code line2\n' +
										'```\n' +
										'``` cpp\n' +
										'#include <iostream>\n' +
										'using namespace std;\n' +
										'int main()\n' +
										'{\n' +
										'    int a, b;\n' +
										'    cin >> a >> b;\n' +
										'    cout << a + b;\n' +
										'    return 0;\n' +
										'}\n' +
										'```\n' +
										'\n' +
										'```` markdown\n' +
										'``` py\n' +
										"print('Hello, world!')\n" +
										'```\n' +
										'````',
									notice: '有 bug'
								}
							].forEach(ele => str += `
									<tr>
										<th>${ele.type}</th>
										<td><pre><code>${ele.md}</code></pre></td>
										<td><pre><code>${(html => {
											const container = document.createElement('div');
											container.innerHTML = html.trim();
											function formatNode(node, indent = '') {
												let result = '';
												if (node.nodeType === Node.TEXT_NODE) {
													const text = node.textContent.trim();
													if (text) {
														result += indent + text + '\n';
													}
												} else if (node.nodeType === Node.ELEMENT_NODE) {
													const tagName = node.tagName.toLowerCase();
													const children = Array.from(node.childNodes);
													result += indent + '<' + tagName;
													Array.from(node.attributes).forEach(attr => result += ` ${attr.name}='${attr.value}'`);
													if (children.length === 0) {
														result += ' />\n';
													} else if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
														const content = children[0].textContent.trim();
														result += '>' + content + `</${tagName}>\n`;
													} else {
														result += '>\n';
														children.forEach(child => result += formatNode(child, indent + '    '));
														result += `${indent}</${tagName}>\n`;
													}
												}
												return result;
											}
											let result = '';
											container.childNodes.forEach(ele => result += formatNode(ele).trim() + '\n');
											return result;
										})(mdtohtml(ele.md))
											.replaceAll('<', '&lt;')
											.replaceAll('>', '&gt;')
											.replaceAll(/(&lt;.*?&gt;)(&lt;.*?&gt;)/g, '$1\n$2')
										}</code></pre></td>
										<td>${mdtohtml(ele.md)}</td>
										<td>${ele.notice}</td>
									</tr>
								`);
							return str;
						})()}
					</tbody>
				</table>
			`
		}
	];
	return `
		<table class='mdeditor-table'>
			<tbody>
				<tr>
					<td colspan='2' class='mdeditor-buttondiv'>
						${(() => {
							let str = '';
							features.forEach(ele => str += `
								<button
									id='mdeditor-button-${ele.name}${id}'
									class='mdeditor-button'
									onclick="createDialog(\`${ele.content.replaceAll('\\', '\\\\').replaceAll('`', '\\`')}\`, [{html: '${i18n.ok}'}])"
								>
									<i class='fa-solid fa-${ele.icon}'></i>
									<div class='mdeditor-button-name' id='mdeditor-button-name-${ele.name}${id}'>${ele.title}</div>
								</button>
							`);
							return str;
						})()}
					</td>
				</tr>
				<tr>
					<td><textarea class='mdeditor-input' id='mdeditor-input${id}' oninput="document.getElementById('mdeditor-output${id}').innerHTML = mdtohtml(document.getElementById('mdeditor-input${id}').value)"></textarea></td>
					<td class='mdeditor-output' id='mdeditor-output${id}'></td>
				</tr>
			</tbody>
		</table>
	`;
}