

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

