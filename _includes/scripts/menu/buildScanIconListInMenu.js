


//////////////////////////////
//
// buildScanIconListInMenu -- Read !!!URL-scan: reference records and
//    create icons for each one at the top right of the VHV window.
//

function buildScanIconListInMenu() {
	var container = document.querySelector("#scan-urls");
	if (!container) {
		return;
	}

	var urllist = getScanUrlList();

	var output = "";
	if (urllist.length > 0) {
		for (var i=0; i<urllist.length; i++) {
			output += makeScanIcon(urllist[i].url, urllist[i].title);
		}
	}

	container.innerHTML = output;
}


