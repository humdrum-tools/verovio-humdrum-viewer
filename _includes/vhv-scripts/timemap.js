//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Fri Jun 23 08:11:13 CEST 2017
// Last Modified:  Fri Jun 23 08:11:16 CEST 2017
// Filename:       _includes/vhv-scripts/timemap.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Timemap processing code for VHV.
//


var TIMEMAP = [];
var LAST_TIMEMAP_INDEX = -1;
var LAST_TIME = -1;
var LOOKAHEAD = 20;  // 20 milliseconds
var INCREMENT = 20;  // 20 milliseconds
var REFRESH;

//////////////////////////////
//
// getTimemap --
//

function getTimemap() {
	try {
		var map = vrvToolkit.renderToTimemap();
		var data;
		// verovio 2.0.0 switches from string output to parsed JSON object for .renderToTimemap()
		if (typeof map === "string" || map instanceof String) {
			data = JSON.parse(map);
		} else {
			data = map;
		}
		TIMEMAP = data;
		console.log(TIMEMAP);
	} catch(err) {
		console.log("Error extracting timemap");
	}
}

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



//////////////////////////////
//
// CheckEventMap --
//

function CheckEventMap(etime, events) {
	for (var i=0; i<events.length; i++) {
		if (Math.abs(etime - events[i].qstamp) < 0.01) {
			ProcessNoteEvents(events[i]);
		}
	}
}



//////////////////////////////
//
// ProcessNoteEvents --
//

function ProcessNoteEvents(event) {
	var ons = event.on;
	var offs = event.off;
	var i;

	for (i=0; i<ons.length; i++) {
		// ons[i].style.stroke = "red";
		// ons[i].style.fill = "red";
		// have to re-find on page in case the image has changed:
		var xon = document.querySelector("#" + ons[i].id);
		xon.style.fill = "red";
	}

	for (i=0; i<offs.length; i++) {
		// have to re-find on page in case the image has changed:
		var xoff = document.querySelector("#" + offs[i].id);
		xoff.style.fill = "";
	}
}



//////////////////////////////
//
// TurnOffAllNotes --
//

function TurnOffAllNotes() {
	var list = document.querySelectorAll("svg g[id^='note-']");
	for (var i=0; i<list.length; i++) {
		list[i].style.fill = "";
	}
}



