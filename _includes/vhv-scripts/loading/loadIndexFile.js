

///////////////////////////////
//
// loadIndexFile --
//

function loadIndexFile(location) {
	if (location.match(/index.hmd$/)) {
		loadHmdIndexFile(location);
		return;
	}
	var url = "https://kern.humdrum.org/data?l=" + location;
	url += "&format=index";

	console.log("Loading index", url);

	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			var INDEX = request.responseText;
			// console.log("INDEX= ", INDEX);
			$('html').css('cursor', 'auto');
			displayIndexFinally(INDEX, location);
		}
	});
	request.send();
}


