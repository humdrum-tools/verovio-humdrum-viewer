

//////////////////////////////
//
// gotoNextToolbarDelta -- go to the next toolbar.  number is the current
//    toolbar (indexed from 1).  If the event has shiftKey then go
//    to the previous toolbar.
//

function gotoNextToolbarDelta() {
	var elements = document.querySelectorAll("[id^=toolbar-]");
	var i;
	var nextNumber = 0;
	for (i=0; i<elements.length; i++) {
		if (elements[i].style.display === "block") {
			nextNumber = i + 1;
			break;
		}
	}
	nextNumber++;
	if (nextNumber > elements.length) {
		nextNumber = 1;
	}
	var id = "toolbar-" + nextNumber;
	for (var i=0; i<elements.length; i++) {
		if (elements[i].id === id) {
			elements[i].style.display = "block";
		} else {
			elements[i].style.display = "none";
		}
	}
	LASTTOOLBAR = nextNumber;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}
