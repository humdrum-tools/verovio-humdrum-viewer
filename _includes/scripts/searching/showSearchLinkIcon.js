


//////////////////////////////
//
// showSearchLinkIcon -- Show the search link icon.
//

function showSearchLinkIcon() {
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
	var element = document.querySelector("#search-link");
	if (element) {
		element.style.display = "inline-block";
	}
}

