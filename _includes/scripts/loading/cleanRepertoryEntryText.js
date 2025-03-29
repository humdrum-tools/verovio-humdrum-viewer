

//////////////////////////////
//
// cleanRepertoryEntryText --
//

function cleanRepertoryEntryText(text) {
	text = text.replace(/-sharp/g, "&sharp;").replace(/-flat/g, "&flat;");
	text = text.replace(/<not>.*?<\/not>/g, "");
	let matches = text.match(/@\{link:([^}]+)\}/);
	if (matches) {
		let link = matches[1];
		let replacement = "";
		if (link.match(/https?:\/\/.*wikipedia/)) {
			replacement += '<a target="_blank" href="' + link + '">';
			replacement += '<span style="float:right; font-size:60%" class="fa-stack fa-1x">\n';
			replacement += '<i class="fas fa-square fa-stack-2x"></i>\n';
			replacement += '<i class="fab fa-wikipedia-w fa-stack-1x fa-inverse"></i>\n';
			replacement += '</span>\n';
			replacement += '</a>\n';
			text = text.replace(/@\{link:[^}]+\}/, replacement);
		}
	}
	return text;
}



