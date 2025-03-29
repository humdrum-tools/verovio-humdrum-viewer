


//////////////////////////////
//
// copyFilterUrl -- Copy URL with filter if there is a repertory work
//    present in the text editor (although it will not be checked for any
//    possible modifications).  This function gets the GLOBALFILTER parameter
//    and adds it in the "filter" URL parameter.  A repertory work is
//    identify if the FILEINFO object is defined and not empty, and
//    FILEINFO.location and FILEINFO.file are present and non-empty.
//

function copyFilterUrl() {
	if (!GLOBALFILTER) {
		console.log("GLOBALFILTER IS EMPTY:", GLOBALFILTER);
		copyToClipboard("");
		return;
	}

	if (!FILEINFO) {
		console.log("NO REPERTORY FILE TO WORK WITH");
		copyToClipboard("");
		return;
	}
	if (!FILEINFO.location) {
		console.log("NO LOCATION FOR REPERTORY FILE");
		copyToClipboard("");
		return;
	}
	if (!FILEINFO.file) {
		console.log("NO FILENAME FOR REPERTORY FILE");
		copyToClipboard("");
		return;
	}

	// Assuming data is accessed through https://, may
	// need to be adjusted if through http://
	var link = "https://verovio.humdrum.org/?file=";
	var file = FILEINFO.location
	file += "/";
	file += FILEINFO.file;
	link += encodeURIComponent(file);
	link += "&filter=";
	link += encodeURIComponent(GLOBALFILTER);
	if (GLOBAL_VEROVIO_FILTER) {
		link += "&v=";
		link += encodeURIComponent(GLOBAL_VEROVIO_FILTER);
	}
	link = link.replace(/%2f/gi, "/");
	copyToClipboard(link);
}


