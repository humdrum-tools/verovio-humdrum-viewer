

//////////////////////////////
//
// loadFilter --
//

function loadFilter(element) {
	let filterElement = document.querySelector("#filter");
	if (!filterElement) {
		return;
	}

	let filterText = filterElement.value || "";
	if (filterText) {
		filterText = encodeURIComponent(filterText);
	}

	let elementFilter = element.dataset.filter;
	if (elementFilter === filterText) {
		// Filter is currently active with matching filter, so disable it:
		filterElement.value = "";
		applyGlobalFilter();
	} else {
		let filter = decodeURIComponent(elementFilter);
		if (filter) {
			filterElement.value = filter;
		}
		applyGlobalFilter(true);
	}
}


