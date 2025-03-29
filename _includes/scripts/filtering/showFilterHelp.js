

//////////////////////////////
//
// showFilterHelp --
//

function showFilterHelp() {
	let filterindex = {};
	for (let i=0; i<FILTERS.length; i++) {
		if (!FILTERS[i]) {
			continue;
		}
		filterindex[FILTERS[i]] = 1;
	}

	let felement = document.querySelector("input#filter");
	let ftext = "";
	let command = "";
	if (felement) {
		ftext = felement.value;
		fstart = felement.selectionStart;
		ftext = getPipedRegion(ftext, fstart);
		let matches = ftext.match(/^\s*([a-zA-Z0-9_-]+)/);
		if (matches) {
			if (filterindex[matches[1]]) {
				command = matches[1];
			}
		}
	}

	let url = "https://doc.verovio.humdrum.org/filter";
	if (command) {
		url += "/" + command;
	}

	let help = window.open(url, "documentation");
	help.focus();
}


