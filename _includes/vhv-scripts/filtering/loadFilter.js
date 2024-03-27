

//////////////////////////////
//
// loadFilter --
//

function loadFilter(element) {
	let filterElement = document.querySelector("#filter");
	if (!filterElement) {
		return;
	}
	let filter = decodeURIComponent(element.dataset.filter);
	if (filter) {
		filterElement.value = filter;
	}
	applyGlobalFilter(true);
}


