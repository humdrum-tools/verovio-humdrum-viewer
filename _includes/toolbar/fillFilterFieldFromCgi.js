


//////////////////////////////
//
// fillFilterFieldFromCgi --
//

function fillFilterFieldFromCgi() {
	if (!GLOBALFILTER) {
		// nothing to do
		return;
	}
	let efilter = document.querySelector("input#filter");
	if (!efilter) {
		return;
	}
	efilter.value = GLOBALFILTER;
	applyGlobalFilter();
	chooseToolbarMenu("filter");
	// A different function will try to override this, so force
	// it back to the filter toolbar:
	TOOLBAR = "filter";
	if (CGI.k && CGI.k.match(/c/)) {
		COMPILEFILTERAUTOMATIC = true;
	}
}



