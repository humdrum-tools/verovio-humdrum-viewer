{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       addSpineToRight.js
// Web Address:    https://verovio.humdrum.org/scripts/addSpineToRight.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Add an extra spine to the immediate
//                 right of a given spine (must be done at an exinterp line).
//
{% endcomment %}


function addSpineToRight(exinterp, currentline, location) {
	console.log("EXINTERP", exinterp, "CURRENTLINE", currentline, "LOCATION", location);
	var column = location.column;

	// calculate spine number at current location
	var scount = 0;
	var i;
	var state = 0;
	for (i=0; i<location.column + 1; i++) {
		if (currentline[i] == '\t') {
			if (state == 1) {
				state = 0;
			}
		} else {
			if (state == 0) {
				state = 1;
				scount++;
			}
		}
	}

	// count the total number of spines:
	var tcount = 0;
	state = 0;
	for (i=0; i<currentline.length; i++) {
		if (currentline[i] == '\t') {
			if (state == 1) {
				state = 0;
			}
		} else {
			if (state == 0) {
				state = 1;
				tcount++;
			}
		}
	}

	console.log("   SPINE NUMBER IS ", scount, "TOTAL", tcount);
	var filter = "extract -s ";
	if (scount == 1) {
		if (tcount == 1) {
			filter += "1,0";
		} else if (tcount == 2) {
			filter += "1,0,2";
		} else {
			filter += "1,0,2-$";
		}
	} else {
		filter += "1-" + scount + ",0";
		if (scount == tcount) {
			// do nothing
		} else if (scount + 1 == tcount) {
			filter += "," + tcount;
		} else {
			filter += "," + (scount+1) + "-$";
		}
	}
	if (exinterp !== "**blank") {
		filter += " -n " + exinterp;
	}
	MENU.applyFilter(filter);
}



