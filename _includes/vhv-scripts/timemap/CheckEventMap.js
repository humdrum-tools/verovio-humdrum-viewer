

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


