

//////////////////////////////
//
// downloadKernScoresFile --
//

function downloadKernScoresFile(file, measures, page) {
	var location;
	var filename;
	var matches;
	var jrp = false;
	var bitbucket = false;
	var github = false;
	var nifc = false;

	matches = file.match(/^jrp:(.*)/i);
	if (matches) {
		jrp = true;
		file = matches[1];
	} else {
		matches = file.match(/^(?:bitbucket|bb):(.*)/i);
		if (matches) {
			bitbucket = true;
			file = matches[1];
		} else {
			matches = file.match(/^(?:github|gh):(.*)/i);
			if (matches) {
				bitbucket = true;
				file = matches[1];
			} else {
				matches = file.match(/^nifc:(.*)/i);
				if (matches) {
					nifc = true;
					file = matches[1];
				}
			}
		}
	}

	var url;
	if (jrp) {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
		url = "https://josquin.stanford.edu/data?id=" + location;
		url += "&a=humdrum";
	} else if (nifc) {
		file = file.replace(/^\/+/, "");
		url = "https://humdrum.nifc.pl/krn/" + file;
	} else {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
		url = "https://kern.humdrum.org/data?l=" + location + "&file=" + filename;
		if (measures) {
			url += "&mm=" + measures;
		}
	}

	if (filename) {
		SAVEFILENAME = filename;
		console.log("SAVEFILENAME - ", SAVEFILENAME);
	}

	if (bitbucket && url.match(/,/)) {
		downloadMultipleFiles(url);
		return;
	}

	console.log("DATA URL", url);
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			// console.log("DATA", request.responseText);
			//var inputarea = document.querySelector("#input");
			//console.log("Current file:", file);
			//inputarea.value = request.response;

			// https://ace.c9.io/#nav=api&api=editor
			replaceEditorContentWithHumdrumFile(request.response, page);
			if (CGI.k.match(/c/)) {
				CGI.k = CGI.k.replace(/c/, "");
				compileFilters();
			}
		}

	});
	request.send();
}


