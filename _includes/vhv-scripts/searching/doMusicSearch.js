


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
