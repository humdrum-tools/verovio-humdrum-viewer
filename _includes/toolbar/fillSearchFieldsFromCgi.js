

//////////////////////////////
//
// fillSearchFieldsFromCgi --
//

function fillSearchFieldsFromCgi() {
	let esearch = document.querySelector("#search-group");
	if (!esearch) {
		return;
	}

	if (!PQUERY.match(/^\s*$/)) {
		let epitch = esearch.querySelector("#search-pitch");
		if (epitch) {
			epitch.value = PQUERY;
		}
	}

	if (!IQUERY.match(/^\s*$/)) {
		let ipitch = esearch.querySelector("#search-interval");
		if (ipitch) {
			ipitch.value = IQUERY;
		}
	}

	if (!RQUERY.match(/^\s*$/)) {
		let rpitch = esearch.querySelector("#search-rhythm");
		if (rpitch) {
			rpitch.value = RQUERY;
		}
	}

	// the SEARCHFILTER let does not need to be built
	// because that was done in scripts/listeners.js when
	// DOMContentLoaded event was triggered.
}



