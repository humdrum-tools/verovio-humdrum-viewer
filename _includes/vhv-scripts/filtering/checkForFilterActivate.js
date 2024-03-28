

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

	// Highlight any .filter-button that matches the contents
	// of #filter.
	let filterText = event.target.value;
	if (!filterText) {
		filterText = "";
	} else {
		filterText = encodeURIComponent(filterText);
	}
	let filters = document.querySelectorAll(".filter-button");
	for (let i=0; i<filters.length; i++) {
		let localText = filters[i].dataset.filter;
		if (!localText) {
			localText = "";
		} else {
			localText = encodeURIComponent(localText);
		}
		if ((localText !== "") && (localText === filterText)) {
			filters[i].classList.add("highlight");
		} else {
			filters[i].classList.remove("highlight");
		}
	}

}



