


//////////////////////////////
//
// showFilterLinkIcon -- Show the filter link icon.
//

function showFilterLinkIcon() {
	if (!FILEINFO) {
		// console.log("NO REPERTORY FILE TO WORK WITH");
		return;
	}
	if (!FILEINFO.location) {
		// console.log("NO LOCATION FOR REPERTORY FILE");
		return;
	}
	if (!FILEINFO.file) {
		// console.log("NO FILENAME FOR REPERTORY FILE");
		return;
	}
	var element = document.querySelector("#filter-link");
	if (element) {
		element.style.display = "inline-block";
	}
}

