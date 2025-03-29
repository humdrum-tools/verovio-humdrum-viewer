
///////////////////////////////
//
// loadHmdIndexFile --
//

function loadHmdIndexFile(location) {
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			var INDEX = request.responseText;
			HMDINDEX = new HMDIndex(info.data);
			// console.log("INDEX= ", INDEX);
			$('html').css('cursor', 'auto');
			displayHmdIndexFinally(HMDINDEX, location);
		}
	});
	request.send();
}


