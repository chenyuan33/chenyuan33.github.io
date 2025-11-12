let mdtohtml = (md) => {
	let lines = md.split("\n\n"), html = "";
	lines.forEach(element => {
		let line = element.trim();
		if (line == "") {
			return;
		}
		if (line.match(/^>[\s\S]*/igm)) {
			let x = line.split(/^>/igm);
			line = mdtohtml(x[0]);
			x = x.slice(1);
			line += `<blockquote>${mdtohtml(x.join(''))}</blockquote>`;
			html += line;
			return;
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
		if (line.match(/^[ \t]*\d+\. /igm)) {
			let x = line.split(/^[ \t]*\d+\. /igm);
			line = mdtohtml(x[0]) + `<ol start=${x[1].split('.')[0]}>`;
			for (let i = 1; i < x.length; i++) {
				let y = mdtohtml(x[i]);
				if (y.startsWith('<p>') && y.endsWith('</p>')) {
					y = y.substring(3, y.length - 4);
				}
				line += `<li>${y}</li>`;
			}
			html += line + '</ol>';
			return;
		}
		if (line.match(/^[ \t]*[-+*] /igm)) {
			let x = line.split(/^[ \t]*[-+*] /igm);
			line = mdtohtml(x[0]) + `<ul>`;
			for (let i = 1; i < x.length; i++) {
				let y = mdtohtml(x[i]);
				if (y.startsWith('<p>') && y.endsWith('</p>')) {
					y = y.substring(3, y.length - 4);
				}
				line += `<li>${y}</li>`;
			}
			html += line + '</ul>';
			return;
		}
		line = line
			.replace(/^# (.*?)$/igm, "</p><h1>$1</h1><p>")
			.replace(/^## (.*?)$/igm, "</p><h2>$1</h2><p>")
			.replace(/^### (.*?)$/igm, "</p><h3>$1</h3><p>")
			.replace(/^#### (.*?)$/igm, "</p><h4>$1</h4><p>")
			.replace(/^##### (.*?)$/igm, "</p><h5>$1</h5><p>")
			.replace(/^###### (.*?)$/igm, "</p><h6>$1</h6><p>");
		let x = line.split(/(`+)(.*?)(\1)/);
		line = "";
		for (let i = 0; i < x.length; i++) {
			if (i % 4 == 0) {
				line += x[i]
					.replace(/\x20\x20\n/igm, "<br />")
					.replace(/\*\*\*([\s\S]*?)\*\*\*/igm, "<strong><em>$1</em></strong>")
					.replace(/\*\*([\s\S]*?)\*\*/igm, "<strong>$1</strong>")
					.replace(/\*([\s\S]*?)\*/igm, "<em>$1</em>")
					.replace(/\b___([\s\S]*?)___\b/igm, "<strong><em>$1</em></strong>")
					.replace(/\b__([\s\S]*?)__\b/igm, "<strong>$1</strong>")
					.replace(/\b_([\s\S]*?)_\b/igm, "<em>$1</em>");
			} else if (i % 4 == 1) {
				line += "<code>";
			} else if (i % 4 == 2) {
				line += x[i];
			} else if (i % 4 == 3) {
				line += "</code>";
			}
		}
		html += `<p>${line}</p>`;
	});
	return html.replace(/<p><\/p>/igm, "");
}
let createMdEditor = (id, lang) => {
	if (typeof lang === 'string' && ['zh', 'zh-cn'].find(x => x == lang.toLowerCase()) !== undefined) {
		lang = 'zh-cn';
	}
	else {
		lang = 'en-us';
	}
	curMdEditor = document.createElement('div');
	curMdEditor.classList.add("mdeditor");
	curMdEditor.innerHTML = `
		<table class="mdeditor-table">
			<tr>
				<td colspan="2">
					<div class="mdeditor-buttondiv">
						<button class="mdeditor-button" onclick="document.getElementById('mdeditor-about${id}').style.display='block'"><i class="fa-solid fa-question-circle"></i></button>
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
		<div class="mdeditor-about" id="mdeditor-about${id}">
			<button class="mdeditor-close-about-button" onclick="document.getElementById('mdeditor-about${id}').style.display='none'"><i class="fa-solid fa-circle-xmark"></i></button>
			<h2>${lang == "zh-cn" ? "关于" : "About"}</h2>
			<p>${lang == "zh-cn"
				? "上面的编辑器中，左边是输入的 Markdown 文本，右边是渲染后的 HTML 代码。输入文本时，右边的 HTML 代码会实时更新。所有 Markdown 到 HTML 的转换和显示均在本地进行，无需担心数据泄露的问题。"
				: "In the editor above, the left pane displays your Markdown text input, while the right pane shows the rendered HTML code. As you type, the HTML code on the right updates in real time. All Markdown-to-HTML conversion and display occurs locally, eliminating concerns about data leakage."
			}</p>
			<p>${lang == "zh-cn" ? "未来将会支持的功能有：" : "Future supported features include:"}</p>
			<ul>
				<li>${lang == "zh-cn" ? "支持更多 Markdown 语法" : "Support for more Markdown syntax"}</li>
				<li>${lang == "zh-cn" ? "同步滚动（可自设是否开启）" : "Synchronous scrolling (can be customized to enable or disable)"}</li>
				<li>${lang == "zh-cn" ? "右边显示未渲染的 HTML 源代码（可自设是否开启）" : "The right side displays the unrendered HTML source code (can be toggled on or off)"}</li>
				<li>${lang == "zh-cn" ? "用于辅助的按钮行：" : "Auxiliary button row:"}
					<ul>
						<li>${lang == "zh-cn" ? "功能类：保存草稿（缓存）、自动保存（缓存，可设置是否开启）、导入 Markdown、导出/复制 Markdown/HTML、自设是否开启同步滚动、自设是否实时渲染" : "Functionality: Save Drafts (cached), Auto-Save (cached, configurable), Import Markdown, Export/Copy Markdown/HTML, Customize Synchronized Scrolling, Customize Real-Time Rendering"}</li>
						<li>${lang == "zh-cn" ? "内容类：按钮按下后会在输入框内增加对应的东西，如 H1 会产生一级标题" : "Content-based: Pressing the button adds the corresponding element to the input field. For example, H1 generates a level-1 heading."}</li>
					</ul>
				</li>
				<li>${lang == "zh-cn" ? "自定义 Markdown 语法" : "Custom Markdown Syntax"}</li>
				<li>${lang == "zh-cn" ? "自定义编辑器的大小、全屏编辑器" : "Custom Editor Size, Full-Screen Editor"}</li>
				<li>${lang == "zh-cn" ? "让编辑器进入你的网站（如果你愿意的话）（暂未编写文档）" : "Let the editor access your website (if you choose to) (Documentation not yet written)"}</li>
			</ul>
		</div>
	`;
	document.body.appendChild(curMdEditor);
	window.addEventListener('load', () => document.getElementById(`mdeditor-input${id}`).addEventListener("input", () => document.getElementById(`mdeditor-output${id}`).innerHTML = mdtohtml(document.getElementById(`mdeditor-input${id}`).value)));
}
let mdEditorStyle = document.createElement('style');
mdEditorStyle.innerHTML = `
	.mdeditor-table {
		border-style: solid;
	}

	.mdeditor-table td {
		border-style: solid;
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
	}

	.mdeditor-button, .mdeditor-close-about-button {
		border: none;
		background-color: white;
	}

	.mdeditor-button:hover, .mdeditor-close-about-button:hover {
		cursor: pointer;
	}

	.mdeditor-about {
		display: none;
		position: absolute;
		left: 20%;
		right: 20%;
		top: 20%;
		bottom: 20%;
		background-color: white;
		border-style: solid;
		border-radius: 10px;
		overflow: auto;
		padding: 10px;
	}

	.mdeditor-close-about-button {
		position: absolute;
		left: 90%;
		top: 10%;
	}
`;
document.head.appendChild(mdEditorStyle);