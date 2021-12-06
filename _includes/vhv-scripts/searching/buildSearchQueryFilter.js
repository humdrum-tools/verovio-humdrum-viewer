

function buildSearchQueryFilter(parameters) {
	var output = "";

	var pitch    = parameters.pitch    || "";
	var interval = parameters.interval || "";
	var rhythm   = parameters.rhythm   || "";

	if (pitch.match(/^\s*bach\s*$/i)) {
		// Special search for the pitch sequence BACH.
		// H means B-natural in German, B means B-flat
		// The pitch search normally searches diatonically,
		// so also give the natural qualifications for
		// A and C (An and Cn for A-natural and C-natural).
		pitch = "b-ancnbn";
	}

	// var output = "!!!filter: msearch";
	var output = "msearch";
	if (!pitch.match(/^\s*$/)) {
		output += " -p '" + pitch + "'";
	}
	if (!interval.match(/^\s*$/)) {
		output += " -i '" + interval + "'";
	}
	if (!rhythm.match(/^\s*$/)) {
		output += " -r '" + rhythm + "'";
	}
	return output;
}

