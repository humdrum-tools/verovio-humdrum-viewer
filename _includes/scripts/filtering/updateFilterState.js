

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


