//
// Filter-related functions that are included in main.js
//


//////////////////////////////
//
// compileFilters -- Save contents of input#filter to GLOBALFILTER,
//     then get compiled data returned from verovio.  This will also
//     compile any filters emebedded in the data along with the global
//     filter.  Any active searches will also be compiled (which will add
//     marks to matches notes in the score.  Turns off filter icon in toolbar
//     if it is active, but keep the filter in input#filter.
//

function compileFilters() {
	let target = document.querySelector("input#filter");
	let results = validateFilter(target, "Enter");
	if (!results.status) {
		event.target.classList.add("invalid");
		alert(`Error: unknown filter ${results.filter}`);
		return;
	} else {
		event.target.classList.remove("invalid");
	}

	let xml = dataIsXml();
	if (xml) {
		// Could be done later in certain cases.
		alert("Cannot apply filters to XML data");
		return;
	}

	if (GLOBALFILTER) {
		showCompiledFilterData("!!!Xfilter: " + GLOBALFILTER);
	} else {
		showCompiledFilterData();
	}
}



//////////////////////////////
//
// showCompiledFilterData -- Run the Humdrum data through the vrvToolkit
//      to extract the output from tool filtering.  The is run from the
//      alt-c keyboard shortcut.  The filter toolbar calls this fromt
//

function showCompiledFilterData(deleteline) {
	let text = getTextFromEditorWithGlobalFilter();
	let options = humdrumToSvgOptions();
	vrvWorker.filterData(options, text, "humdrum")
	.then(function(newdata) {
		newdata = newdata.replace(/\s+$/m, "");
		setTextInEditor(newdata);
		deactivateFilterInToolbar();
		removeLastLineInTextEditorIfMatches(deleteline);
	});
}



//////////////////////////////
//
// applyGlobalFilter --  Save contents of input#filter to GLOBALFILTER,
//    and then apply notation.  After apllying the global filter,
//    activate the filter icon in the filter toolbar.
//

function applyGlobalFilter() {
	let target = document.querySelector("input#filter");
	let results = validateFilter(target, "Enter");
	if (!results.status) {
		target.classList.add("invalid");
		alert(`Error: unknown filter ${results.filter}`);
		return;
	} else {
		target.classList.remove("invalid");
	}

	let xml = dataIsXml();
	if (xml) {
		// Could be done later in certain cases.
		alert("Cannot apply filters to XML data");
		return;
	}

	var ficon = document.querySelector(".filter-icon");
	if (!ficon) {
		console.log("SOMETHING STRANGE HAPPENED: missing filter icon");
		return;
	}

	if (ficon.classList.contains("active")) {
		// The filter is already active, so deactivate it.
		ficon.classList.remove("active");
		GLOBALFILTER = "";
		displayNotation();
		return;
	}

	var efilter = document.querySelector("input#filter");
	if (!efilter) {
		console.log("CANNOT FIND FILTER");
		return;
	}

	var ftext = efilter.value;
	if (ftext.match(/^\s*$/)) {
		// nothing to do.
		return;
	}
	GLOBALFILTER = ftext;
	displayNotation();
	ficon.classList.add("active");
	showFilterLinkIcon();
}



//////////////////////////////
//
// showSpreadsheetHelp --
//

function showSpreadsheetHelp() {
	var url = "https://doc.verovio.humdrum.org/interface/toolbar/spreadsheet";
	var help = window.open(url, "documentation");
	help.focus();
}



//////////////////////////////
//
// detachGlobalFilter --
//

function detachGlobalFilter() {
	var ficon = document.querySelector(".filter-icon");
	if (ficon) {
		ficon.classList.remove("active");
		if (GLOBALFILTER) {
			GLOBALFILTER = "";
		}
	}
}



//////////////////////////////
//
// showFilterLinkIcon -- Show the filter link icon.
//

function showFilterLinkIcon() {
	if (!FILEINFO) {
		// console.log("NO REPERTORY FILE TO WORK WITH");
		return;
	}
	if (!FILEINFO.location) {
		// console.log("NO LOCATION FOR REPERTORY FILE");
		return;
	}
	if (!FILEINFO.file) {
		// console.log("NO FILENAME FOR REPERTORY FILE");
		return;
	}
	var element = document.querySelector("#filter-link");
	if (element) {
		element.style.display = "inline-block";
	}
}



//////////////////////////////
//
// copyFilterUrl -- Copy URL with filter if there is a repertory work
//    present in the text editor (although it will not be checked for any
//    possible modifications).  This function gets the GLOBALFILTER parameter
//    and adds it in the "filter" URL parameter.  A repertory work is
//    identify if the FILEINFO object is defined and not empty, and
//    FILEINFO.location and FILEINFO.file are present and non-empty.
//

function copyFilterUrl() {
	if (!GLOBALFILTER) {
		console.log("GLOBALFILTER IS EMPTY:", GLOBALFILTER);
		copyToClipboard("");
		return;
	}

	if (!FILEINFO) {
		console.log("NO REPERTORY FILE TO WORK WITH");
		copyToClipboard("");
		return;
	}
	if (!FILEINFO.location) {
		console.log("NO LOCATION FOR REPERTORY FILE");
		copyToClipboard("");
		return;
	}
	if (!FILEINFO.file) {
		console.log("NO FILENAME FOR REPERTORY FILE");
		copyToClipboard("");
		return;
	}

	// Assuming data is accessed through https://, may
	// need to be adjusted if through http://
	var link = "https://verovio.humdrum.org/?file=";
	var file = FILEINFO.location
	file += "/";
	file += FILEINFO.file;
	link += encodeURIComponent(file);
	link += "&filter=";
	link += encodeURIComponent(GLOBALFILTER);
	link = link.replace(/%2f/gi, "/");
	copyToClipboard(link);
}



//////////////////////////////
//
// checkForFilterActivate -- Monitor filter input area for an entry key.
//     If detected then activate the filter.
//

function checkForFilterActivate(event) {
	let results = validateFilter(event, event.key);
	if (!results.status) {
		event.target.classList.add("invalid");
		if (event.key === "Enter") {
			alert(`Error: unknown filter ${results.filter}`);
		}
		return;
	} else {
		event.target.classList.remove("invalid");
	}

	if (event.shiftKey && event.key === "Enter") {
		compileFilters();
	} else if (event.key === "Enter") {
		applyGlobalFilter();
	}
}



//////////////////////////////
//
// validateFilter --
//

function validateFilter(event, key) {
	let target;
	if (event && (typeof event.target !== "undefined")) {
		target = event.target;
	} else if (!event) {
		target = document.querySelector("input#filter");
	} else {
		target = event;
	}
	if (!target) {
		return {status:0, filter: "missing target"};
	}
	if (target.nodeName !== "INPUT") {
		return {status:0, filter: "missing input target"};
	}
	let value = target.value;
	console.log("VALUE", value);

	let checkend = 0;
	if (key == "Enter") {
		checkend = 1;
	}

	if (!checkend) {
		value = value.replace(/[a-zA-Z0-9_-]+$/, "");
	}
	let values = value.split(/\s*[|]+\s*/);
	console.log("VALUES", values);

	let filterindex = {};
	for (let i=0; i<FILTERS.length; i++) {
		if (!FILTERS[i]) {
			continue;
		}
		filterindex[FILTERS[i]] = 1;
	}

	for (let i=0; i<values.length; i++) {
		if (!values[i]) {
			continue;
		}
		var term = values[i].replace(/^\s+/, "").replace(/\s.*/, "");
		if (!term) {
			continue;
		}
		if (!filterindex[term]) {
			return {status:0, filter:term};
		}
	}
	return {status:1, filter:""};
}



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



//////////////////////////////
//
// getPipedRegion --
//

function getPipedRegion(ftext, fstart) {
	if (!ftext) {
		return "";
	}
	let pstart = -1;
	let pend = -1;
	for (let i=fstart; i>=0; i--) {
		if (ftext.charAt(i) === "|") {
			pstart = i+1;
			break;
		}
	}
	let text = ftext;
	if (pstart >= 0) {
		text = text.substring(pstart);
	}
	text = text.replace(/\|.*/, "");
	return text;
}



//////////////////////////////
//
// deactivateFilterInToolbar -- If the filter toolbar has an active filter,
//     then stop it.  This means to turn of the filter icon highlight
//     and clear the contents of the GLOBALFILTER variable.
//

function deactivateFilterInToolbar() {
	hideFilterLinkIcon();
	updateFilterState();
}



//////////////////////////////
//
// updateFilterState --  Deactivate the filter if changed.
//    Need to press the button to reapply.
//

function updateFilterState() {
	var ficon = document.querySelector(".filter-icon");
	if (ficon) {
		ficon.classList.remove("active");
		if (GLOBALFILTER) {
			GLOBALFILTER = "";
			displayNotation();
		}
		hideFilterLinkIcon();
	}
}



//////////////////////////////
//
// hideFilterLinkIcon -- Make sure that the filter link icon is hidden.
//

function hideFilterLinkIcon() {
	var element = document.querySelector("#filter-link");
	if (element) {
		element.style.display = "none";
	}
	// also deactivate the filter in the toolbar
	detachGlobalFilter();
}



