

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



