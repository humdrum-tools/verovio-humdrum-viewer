


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

