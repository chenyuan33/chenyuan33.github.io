let mdtohtml = (md) => {
	let lines = md.split("\n\n"), html = "";
	lines.forEach(element => {
		let line = element.trim();
		if (line == "") {
			return;
		}
		let x = line.split(/^(`{3,})(.*?)?\n([\s\S]*?)^(\1)/m), curlang = 'plain';
		line = "";
		for (let i = 0; i < x.length; i++) {
			if (i % 5 == 0) {
				if (x[i].match(/^\s*>[\s\S]*/igm)) {
					let y = x[i].split(/^\s*>/igm);
					x[i] = mdtohtml(y[0]);
					y = y.slice(1);
					html += x[i] + `<blockquote>${mdtohtml(y.join(''))}</blockquote>`;
					continue;
				}
				if (x[i].match(/^[ \t]*\d+\. /igm)) {
					let z = x[i].split(/^[ \t]*\d+\. /igm);
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
					let z = x[i].split(/^[ \t]*[-+*] /igm);
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
					.replace(/^# (.*?)$/igm, "</p><h1>$1</h1><p>")
					.replace(/^## (.*?)$/igm, "</p><h2>$1</h2><p>")
					.replace(/^### (.*?)$/igm, "</p><h3>$1</h3><p>")
					.replace(/^#### (.*?)$/igm, "</p><h4>$1</h4><p>")
					.replace(/^##### (.*?)$/igm, "</p><h5>$1</h5><p>")
					.replace(/^###### (.*?)$/igm, "</p><h6>$1</h6><p>")
					.replace(/\x20\x20\n/igm, "<br />")
					.replace(/\*\*\*([\s\S]*?)\*\*\*/igm, "<strong><em>$1</em></strong>")
					.replace(/\*\*([\s\S]*?)\*\*/igm, "<strong>$1</strong>")
					.replace(/\*([\s\S]*?)\*/igm, "<em>$1</em>")
					.replace(/\b___([\s\S]*?)___\b/igm, "<strong><em>$1</em></strong>")
					.replace(/\b__([\s\S]*?)__\b/igm, "<strong>$1</strong>")
					.replace(/\b_([\s\S]*?)_\b/igm, "<em>$1</em>")
					.replace(/`(.+?)`/igm, "<code>$1</code>");
			} else if (i % 5 == 1) {
				line += "<pre><code>";
			} else if (i % 5 == 2) {
				if (x[i] === undefined) {
					x[i] = '';
				}
				curlang = x[i].trim();
			} else if (i % 5 == 3) {
				line += x[i]
					.replace(/^\n+|\n+$/g, '')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;');
			} else if (i % 5 == 4) {
				line += "</code></pre>";
			}
		}
		if (line.startsWith('\t') || line.startsWith('    ')) {
			let x = line.split('\n'), i = 0;
			line = "<pre><code>";
			for (; i < x.length && (x[i].startsWith('\t') || x[i].startsWith('    ')); i++) {
				if (x[i].startsWith('\t')) {
					line += x[i].substring(1) + '\n';
				} else {
					line += x[i].substring(4) + '\n';
				}
			}
			line += "</code></pre>" + mdtohtml(x.slice(i));
		}
		html += `<p>${line}</p>`;
	});
	return html.replace(/<p>\s*<\/p>/igm, "");
}
let createMdEditor = (id, lang) => {
	if (typeof lang === 'string' && ['zh', 'zh-cn'].find(x => x == lang.toLowerCase()) !== undefined) {
		lang = 'zh-cn';
	}
	else {
		lang = 'en-us';
	}
	const i18n = {
		"en-us": {
			about: mdtohtml(`
				## About
				In the editor above, the left pane displays your Markdown text input, while the right pane shows the rendered HTML code. As you type, the HTML code on the right updates in real time. All Markdown-to-HTML conversion and display occurs locally, eliminating concerns about data leakage.
			`),
			futureSupportedFeatures: mdtohtml(`
				## Future supported features
				- Support for more Markdown syntax
				- Optional markdown syntax:
					- Title: Display works fine even without a space between the \`#\` and the content
					- Line breaks: Use [\`\\\` + line break] or [direct line break] to create line breaks
					- Bold/Italic: Whether to render when using underline with no spaces on either side of the underline
					- Code Block: Syntax Highlighting
				- Synchronous scrolling (can be customized to enable or disable)
				- The right side displays the unrendered HTML source code (can be toggled on or off)
				- Auxiliary button row:
					- Functionality: Save Drafts (cached), Auto-Save (cached, configurable), Import Markdown, Export/Copy Markdown/HTML, Customize Synchronized Scrolling, Customize Real-Time Rendering
					- Content-based: Pressing the button adds the corresponding element to the input field. For example, H1 generates a level-1 heading.
				- Syntax Highlighting
				- Custom Editor Size, Full-Screen Editor
				- Let the editor access your website (if you choose to) (Documentation not yet written)
			`)
		},
		"zh-cn": {
			about: mdtohtml(`
				## 关于
				上面的编辑器中，左边是输入的 Markdown 文本，右边是渲染后的 HTML 代码。输入文本时，右边的 HTML 代码会实时更新。所有 Markdown 到 HTML 的转换和显示均在本地进行，无需担心数据泄露的问题。
			`),
			futureSupportedFeatures: mdtohtml(`
				## 未来将会支持的功能
				- 支持更多 Markdown 语法
				- 可选的 Markdown 语法：
					- 标题：如果 \`#\` 和内容之间没有空格也可以正常显示
					- 换行：使用【\`\\\`+换行】或【直接换行】进行换行
					- 粗体/斜体：使用下划线并且下划线两边均无空格时是否渲染
					- 代码块：语法高亮
				- 同步滚动（可自设是否开启）
				- 右边显示未渲染的 HTML 源代码（可自设是否开启）
				- 用于辅助的按钮行：
					- 功能类：保存草稿（缓存）、自动保存（缓存，可设置是否开启）、导入 Markdown、导出/复制 Markdown/HTML、自设是否开启同步滚动、自设是否实时渲染
					- 内容类：按钮按下后会在输入框内增加对应的东西，如 H1 会产生一级标题
				- 语法高亮
				- 自定义编辑器的大小、全屏编辑器
				- 让编辑器进入你的网站（如果你愿意的话）（暂未编写文档）
			`),
			markdownSyntax: `
				<h2>已支持的 Markdown 语法</h2>
				<table>
					<tr>
						<th>类型</th>
						<th>Markdown</th>
						<th>HTML</th>
						<th>预览</th>
						<th>注意</th>
					</tr>
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
											}
											else if (node.nodeType === Node.ELEMENT_NODE) {
												const tagName = node.tagName.toLowerCase();
												const children = Array.from(node.childNodes);
												result += indent + '<' + tagName;
												Array.from(node.attributes).forEach(attr => result += ` ${attr.name}="${attr.value}"`);
												if (children.length === 0) {
													result += ' />\n';
												}
												else if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
													const content = children[0].textContent.trim();
													result += '>' + content + `</${tagName}>\n`;
												}
												else {
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
				</table>
			`
		}
	}[lang];
	let features = [
		{
			name: 'about',
			fa: 'question-circle',
			title: {
				'en-us': 'About',
				'zh-cn': '关于'
			}
		},
		{
			name: 'futureSupportedFeatures',
			fa: 'flask',
			title: {
				'en-us': 'Future supported features',
				'zh-cn': '未来将会支持的功能'
			}
		},
		{
			name: 'markdownSyntax',
			fa: 'code',
			title: {
				'en-us': 'Markdown Syntax (Only Supported in Chinese version yet)',
				'zh-cn': 'Markdown 语法'
			}
		}
	];
	curMdEditor = document.createElement('div');
	curMdEditor.classList.add("mdeditor");
	curMdEditor.innerHTML = `
		<table class="mdeditor-table">
			<tr>
				<td colspan="2">
					<div class="mdeditor-buttondiv">
						${(() => {
							let str = '';
							features.forEach(ele => str += `
								<button
									id="mdeditor-button-${ele.name}${id}"
									class="mdeditor-button"
									onclick="document.getElementById('mdeditor-${ele.name}${id}').style.display='block'"
								>
									<i class="fa-solid fa-${ele.fa}"></i>
									<div class="mdeditor-button-name" id="mdeditor-button-name-${ele.name}${id}">${ele.title[lang]}</div>
								</button>
							`);
							return str;
						})()}
					</div>
				</td>
			</tr>
			<tr>
				<td>
					<textarea class="mdeditor-input" id="mdeditor-input${id}"></textarea>
				</td>
				<td>
					<div class="mdeditor-output" id="mdeditor-output${id}"></div>
				</td>
			</tr>
		</table>
		${(() => {
			let str = '';
			features.forEach(ele => str += `
				<div class="mdeditor-doc" id="mdeditor-${ele.name}${id}">
					<div class="mdeditor-doc-background" onclick="document.getElementById('mdeditor-${ele.name}${id}').style.display='none'"></div>
					<div class="mdeditor-doc-content">
						<button class="mdeditor-close-doc-button" onclick="document.getElementById('mdeditor-${ele.name}${id}').style.display='none'">
							<i class="fa-solid fa-circle-xmark"></i>
						</button>
						${i18n[ele.name]}
					</div>
				</div>
			`);
			str += '<style>';
			features.forEach(ele => str += `
				#mdeditor-button-${ele.name}${id}:hover #mdeditor-button-name-${ele.name}${id} {
					opacity: 1;
				}
			`);
			str += '</style>';
			return str;
		})()}
	`;
	document.body.appendChild(curMdEditor);
	window.addEventListener('load', () => document.getElementById(`mdeditor-input${id}`).addEventListener("input", () => document.getElementById(`mdeditor-output${id}`).innerHTML = mdtohtml(document.getElementById(`mdeditor-input${id}`).value)));
}
let mdEditorStyle = document.createElement('style');
mdEditorStyle.innerHTML = `
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

	.mdeditor-button, .mdeditor-close-doc-button {
		border: none;
		background-color: unset;
		font: inherit;
	}

	.mdeditor-button:hover, .mdeditor-close-doc-button:hover {
		cursor: pointer;
	}

	.mdeditor-button-name {
		position: absolute;
		top: -35px;
		border: solid;
		border-radius: 5px;
		padding: 5px;
		background-color: white;
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
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 5px solid transparent;
		border-top-color: rgba(0, 0, 0, 0.8);
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
`;
document.head.appendChild(mdEditorStyle);