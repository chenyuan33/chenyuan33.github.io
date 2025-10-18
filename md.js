let mdtohtml = (md) => {
	let lines = md.split("\n\n"), html = "";
	lines.forEach(element => {
		let line = element.trim();
		if (line == "") {
			return;
		}
		if (line.startsWith("#")) {
			line = line
				.replace(/^# (.*?)$/igm, "<h1>$1</h1>")
				.replace(/^## (.*?)$/igm, "<h2>$1</h2>")
				.replace(/^### (.*?)$/igm, "<h3>$1</h3>")
				.replace(/^#### (.*?)$/igm, "<h4>$1</h4>")
				.replace(/^##### (.*?)$/igm, "<h5>$1</h5>")
				.replace(/^###### (.*?)$/igm, "<h6>$1</h6>");
		}
		else if (line.match(/\n# (.*?)$/igm)) {
			
		}
		else if (line.startsWith(">")) {
			line = `<blockquote>${mdtohtml(line.replace(/^>/igm, ""), settings)}</blockquote>`;
		}
		else if (line.match(/^\d+\. .+?$/igm)) {

		}
		else {
			line = `<p>${line}</p>`;
		}
		line = line
			.replace(/\x20\x20\n/igm, "<br />")
			.replace(/\*\*\*([\s\S]*?)\*\*\*/igm, "<strong><em>$1</em></strong>")
			.replace(/\*\*([\s\S]*?)\*\*/igm, "<strong>$1</strong>")
			.replace(/\*([\s\S]*?)\*/igm, "<em>$1</em>")
			.replace(/\b___([\s\S]*?)___\b/igm, "<strong><em>$1</em></strong>")
			.replace(/\b__([\s\S]*?)__\b/igm, "<strong>$1</strong>")
			.replace(/\b_([\s\S]*?)_\b/igm, "<em>$1</em>");
		html += line;
	});
	return html;
}