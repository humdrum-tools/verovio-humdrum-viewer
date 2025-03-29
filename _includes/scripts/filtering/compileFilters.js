

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


