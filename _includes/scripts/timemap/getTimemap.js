
//////////////////////////////
//
// InitializeTimemap --
//

function InitializeTimemap() {
	if (typeof REFRESH === "undefined") {
		return;
	}
	INCREMENT = 20;
	REFRESH = setInterval(function() {
		if (AUDIO && AUDIO.paused) {
			clearInterval(REFRESH);
			return;
		}
		if (!AUDIO) {
			clearInterval(REFRESH);
			return;
		}
		var currenttime = AUDIO.currentTime;
		CheckTimeMap(TIMEMAP[ID], QEVENTS, currenttime, increment/1000.0 * 2);
	}, INCREMENT);
}


