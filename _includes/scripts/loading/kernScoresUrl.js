
//////////////////////////////
//
// kernScoresUrl -- convert kernscores location into URL.
//

function kernScoresUrl(file, measures, options) {
console.warn("ENTERING KERNSCORESURL");
	var location;
	var filename;
	var user = "" ;
	var repository = "";
	var matches;
	var jrp = false;
	var github = false;
	var nifc = false;

	if (matches = file.match(/^(j|jrp):\/?\/?(.*)/)) {
		jrp = true;
		file = matches[2];
	} else if (matches = file.match(/^(g|gh|github):\/?\/?([^\/]+)\/([^\/]+)\/(.+)/)) {
		github = true;
		user = matches[2];
		repository = matches[3];
		file = matches[4];
	} else if (matches = file.match(/^nifc:\/?\/?(?:krn)?(.*)/i)) {
		nifc = true;
		file = matches[1];
	}

	if (jrp) {
		filename = file;
		location = "";
	} else if (github) {
		filename = file;
	} else if (nifc) {
		filename = file;
	} else {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
	}

	if ((!filename) || !filename.match(/\.[a-z][a-z][a-z]$/)) {
		if (!jrp) {
			loadIndexFile(file, options);
			return;
		}
	}

	if (filename.match(/^\s*$/)) {
		if (!jrp) {
			loadIndexFile(file, options);
			return;
		}
	}

	var url;
	if (jrp) {
		url = "https://josquin.stanford.edu/cgi-bin/jrp?id=" + filename;
		url += "&a=humdrum";
	} else if (nifc) {
		url = "https://humdrum.nifc.pl/krn/" + filename;
	} else if (github) {
		url = "https://raw.githubusercontent.com/" + user + "/" + repository + "/master/" + filename;
	} else {
		url = "https://kern.humdrum.org/data?l=" + location + "&file=" + filename;
		url += "&format=info-json";
	}

	var key = "";
	if (!github) {
		key = location + "/" + filename;
		if (measures) {
			url += "&mm=" + measures;
			key += "&mm=" + measures;
		}
	}

	return {url: url, key: key};
}


