

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



