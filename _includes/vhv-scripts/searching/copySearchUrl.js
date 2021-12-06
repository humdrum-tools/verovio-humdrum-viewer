


//////////////////////////////
//
// copySearchUrl -- Copy URL with search if there is a repertory work
//    present in the text editor (although it will not be checked for any
//    possible modifications).  This function gets the SEARCHFILTEROBJ parameter
//    and adds it to URL parameters.  A repertory work is
//    identify if the FILEINFO object is defined and not empty, and
//    FILEINFO.location and FILEINFO.file are present and non-empty.
//
// SEARCHFILTEROBJ.pitch    = p parameter
// SEARCHFILTEROBJ.interval = i parameter
// SEARCHFILTEROBJ.rhythm   = r parameter
//

function copySearchUrl() {
	if (!SEARCHFILTEROBJ) {
		console.log("SEARCHFILTEROBJ IS EMPTY:", SEARCHFILTEROBJ);
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
	var pitch    = SEARCHFILTEROBJ.pitch    || "";
	var interval = SEARCHFILTEROBJ.interval || "";
	var rhythm   = SEARCHFILTEROBJ.rhythm   || "";
	if (!pitch && !interval && !rhythm) {
		console.log("NO SEARCH PRESENT pitch:", pitch, "rhythm:", rhythm, "interval:", interval);
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
	if (pitch) {
		link += "&p=" + encodeURIComponent(pitch);
	}
	if (interval) {
		link += "&i=" + encodeURIComponent(interval);
	}
	if (rhythm) {
		link += "&r=" + encodeURIComponent(rhythm);
	}
	link = link.replace(/%2f/gi, "/");
	console.log("COPYING SEARCH URL", link, "TO CLIPBOARD");
	copyToClipboard(link);
}


