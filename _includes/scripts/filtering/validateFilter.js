
//////////////////////////////
//
// validateFilter --
//

function validateFilter(event, key) {
	let target;
	if (event && (typeof event.target !== "undefined")) {
		target = event.target;
	} else if (!event) {
		target = document.querySelector("input#filter");
	} else {
		target = event;
	}
	if (!target) {
		return {status:0, filter: "missing target"};
	}
	if (target.nodeName !== "INPUT") {
		return {status:0, filter: "missing input target"};
	}
	let value = target.value;
	console.log("VALUE", value);

	let checkend = 0;
	if (key == "Enter") {
		checkend = 1;
	}

	if (!checkend) {
		value = value.replace(/[a-zA-Z0-9_-]+$/, "");
	}
	value = removeStrings(value);  // Suppress any pipes in option strings
	let values = value.split(/\s*[|]+\s*/);
	console.log("VALUES", values);

	let filterindex = {};
	for (let i=0; i<FILTERS.length; i++) {
		if (!FILTERS[i]) {
			continue;
		}
		filterindex[FILTERS[i]] = 1;
	}

	for (let i=0; i<values.length; i++) {
		if (!values[i]) {
			continue;
		}
		var term = values[i].replace(/^\s+/, "").replace(/\s.*/, "");
		if (!term) {
			continue;
		}
		if (!filterindex[term]) {
			return {status:0, filter:term};
		}
	}
	return {status:1, filter:""};
}



