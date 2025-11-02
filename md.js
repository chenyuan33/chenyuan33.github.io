let mdtohtml = (md) => {
	let lines = md.split("\n\n"), html = "";
	lines.forEach(element => {
		let line = element.trim();
		if (line == "") {
			return;
		}
		line = line
			.replace(/^# (.*?)$/igm, "</p><h1>$1</h1><p>")
			.replace(/^## (.*?)$/igm, "</p><h2>$1</h2><p>")
			.replace(/^### (.*?)$/igm, "</p><h3>$1</h3><p>")
			.replace(/^#### (.*?)$/igm, "</p><h4>$1</h4><p>")
			.replace(/^##### (.*?)$/igm, "</p><h5>$1</h5><p>")
			.replace(/^###### (.*?)$/igm, "</p><h6>$1</h6><p>");
		if (line.match(/^>[\s\S]*/igm)) {
			let x = line.split(/^>/igm);
			line = x[0];
			x.reverse();
			x.pop();
			x.reverse();
			line += `<blockquote>${mdtohtml(x.join(''))}</blockquote>`;
		}
		line = `<p>${line}</p>`;
		line = line
			.replace(/\x20\x20\n/igm, "<br />")
			.replace(/\*\*\*([\s\S]*?)\*\*\*/igm, "<strong><em>$1</em></strong>")
			.replace(/\*\*([\s\S]*?)\*\*/igm, "<strong>$1</strong>")
			.replace(/\*([\s\S]*?)\*/igm, "<em>$1</em>")
			.replace(/\b___([\s\S]*?)___\b/igm, "<strong><em>$1</em></strong>")
			.replace(/\b__([\s\S]*?)__\b/igm, "<strong>$1</strong>")
			.replace(/\b_([\s\S]*?)_\b/igm, "<em>$1</em>");
		html += '<p>' + line + '</p>';
	});
	return html.replace(/<p><\/p>/igm, "");
}