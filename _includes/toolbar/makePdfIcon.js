

//////////////////////////////
//
// makePdfIcon --
//

function makePdfIcon(url, title) {
	title = title.replace(/"/g, "'");

	let lindex = {};
	// let lindexArray = [];
	const regex = /@([A-Z]{2})\{(.*?)\}/g;
	let match;

	while ((match = regex.exec(title)) !== null) {
		let lang = match[1];
		let title = match[2];
		console.warn("LANG", lang, "TITLE", title);
		lindex[lang] = title;
		// let obj = {};
		// obj.lang = lang;
		// obj.title = title;
		// lindexArray.push(obj);
	}

	let newtitle = "";
	if (lindex[LANGUAGE]) {
		newtitle = lindex[LANGUAGE];
	} else if (lindex.EN) {
		newtitle = lindex.EN;
	} else {
		newtitle = title;
	}

	let output = "<div title=\"" + newtitle + "\" ";
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:100%' ";
	output += "onclick='openPdfAtBottomThirdOfScreen(\"" + url + "\")' ";
	output += "class='nav-icon fas fa-file-pdf'></div>";
	return output;

}


