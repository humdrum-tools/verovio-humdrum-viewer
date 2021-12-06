
//////////////////////////////
//
// CheckTimeMap --
//

function CheckTimeMap(timemap, events, currenttime, lookahead) {
	var target = null;
	var diff;
	for (var i=0; i<timemap.length; i++) {
		if (Math.abs(timemap[i].tstamp - currenttime) < lookahead) {
			target = timemap[i];
		}
	}

	if (!target) {
		return;
	}

	if (target.tstamp == LASTTIME) {
		return;
	}
	LASTTIME = target.tstamp;
	// console.log("TIMEENTRY", target);
	CheckEventMap(target.qstamp, events);
}


