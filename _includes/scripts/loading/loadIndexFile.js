


///////////////////////////////
//
// loadIndexFile --
//

function loadIndexFile(location, options) {
	if (location.match(/index.hmd$/)) {
		loadHmdIndexFile(location);
		return;
	}

	let url;
	if (location.match(/http/)) {
		url = location;
	} else {
		url = "https://kern.humdrum.org/data?l=" + location;
		url += "&format=index";
	}

	if (!options) {
		let matches = url.match(/data\?l=(.*?)(&|$)/);

		if (matches) {
			options = {};
			options.file = matches[1];
		}
	}

	console.log("Loading index", url, options);

	let request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			let INDEX = request.responseText;
			// console.log("INDEX= ", INDEX);
			$('html').css('cursor', 'auto');
			displayIndexFinally(INDEX, location, options);
		}
	});
	request.send();
}



