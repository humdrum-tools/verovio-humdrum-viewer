//
// Search-related functions that are included in main.js
//


//////////////////////////////
//
// hideSearchLinkIcon -- Make sure that the search link icon is hidden.
//

function hideSearchLinkIcon() {
	var element = document.querySelector("#search-link");
	if (element) {
		element.style.display = "none";
	}
}



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



//////////////////////////////
//
// clearMatchInfo -- if there is no queries in the search toolbar,
//    then clear any old search results.
//

function clearMatchInfo() {
	var esearch = document.querySelector("#search-results");
	if (!esearch) {
		return;
	}
	esearch.innerHTML = "Search";
	hideSearchLinkIcon();
}



//////////////////////////////
//
// showSearchHelp --
//

function showSearchHelp() {
	var help = window.open("https://doc.verovio.humdrum.org/interface/search", "documentation");
	help.focus();
}



//////////////////////////////
//
// doMusicSearch --
//

function doMusicSearch() {
	var esearch   = document.querySelector("#search-group");
	if (!esearch) {
		return;
	}
	var epitch    = esearch.querySelector("#search-pitch");
	var einterval = esearch.querySelector("#search-interval");
	var erhythm   = esearch.querySelector("#search-rhythm");

	var pitch = epitch.value.replace(/["']/g, "");;
	var interval = einterval.value.replace(/["']/g, "");;
	var rhythm = erhythm.value.replace(/["']/g, "");;
	PQUERY = pitch;
	RQUERY = rhythm;
	IQUERY = interval;

	if (pitch.match(/^\s*$/) && interval.match(/^\s*$/) && rhythm.match(/^\s*$/)) {
		if (SEARCHFILTER) {
			clearMatchInfo();
			SEARCHFILTER = "";
			SEARCHFILTEROBJ = {};
			displayNotation();
			hideSearchLinkIcon();
		} else {
			// no previous search filter, so do not do anything
		}
		return;
	}

	SEARCHFILTEROBJ = {
		pitch: pitch,
		interval: interval,
		rhythm: rhythm
	};
	SEARCHFILTER = buildSearchQueryFilter(SEARCHFILTEROBJ);
	showSearchLinkIcon();

	displayNotation();
}

function buildSearchQueryFilter(parameters) {
	var output = "";

	var pitch    = parameters.pitch    || "";
	var interval = parameters.interval || "";
	var rhythm   = parameters.rhythm   || "";

	if (pitch.match(/^\s*bach\s*$/i)) {
		// Special search for the pitch sequence BACH.
		// H means B-natural in German, B means B-flat
		// The pitch search normally searches diatonically,
		// so also give the natural qualifications for
		// A and C (An and Cn for A-natural and C-natural).
		pitch = "b-ancnbn";
	}

	// var output = "!!!filter: msearch";
	var output = "msearch";
	if (!pitch.match(/^\s*$/)) {
		output += " -p '" + pitch + "'";
	}
	if (!interval.match(/^\s*$/)) {
		output += " -i '" + interval + "'";
	}
	if (!rhythm.match(/^\s*$/)) {
		output += " -r '" + rhythm + "'";
	}
	return output;
}



//////////////////////////////
//
// toggleChordSearchDirection --
//

function toggleChordSearchDirection() {
	var helement = document.querySelector("#search-chord");
	if (!helement) {
		console.log("CANNOT FIND HAND ICONS");
		return;
	}
	var output = "";
	if (SEARCHCHORDDIRECTION === "chord -d") {
		SEARCHCHORDDIRECTION = "chord -u";
		output = '<div title="Melodically searching lowest note of chord" class="nav-icon fa fa-hand-o-down"></div>';
	} else{
		SEARCHCHORDDIRECTION = "chord -d";
		output = '<div title="Melodically searching highest note of chord" class="nav-icon fa fa-hand-o-up"></div>';
	}
	helement.innerHTML = output;
	displayNotation();
}



//////////////////////////////
//
// toggleSearchView --
//

function toggleSearchView() {
	var selement = document.querySelector("#search-zoom");
	if (!selement) {
		console.log("CANNOT FIND SEARCH VIEW ICON");
		return;
	}
	var output = "";
	if (BRIEFSEARCHVIEW) {
		BRIEFSEARCHVIEW = "";
		output = '<div title="Show only measures with matches" class="nav-icon fa fa-search-minus"></div>';
	} else {
		BRIEFSEARCHVIEW = "myank -d --marks";
		output = '<div title="Show entire score with matches" class="nav-icon fa fa-search-plus"></div>';
	}
	selement.innerHTML = output;
	displayNotation();
}
