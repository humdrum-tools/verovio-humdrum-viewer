

function gotoPrevToolbarDelta() {
	var elements = document.querySelectorAll("[id^=toolbar-]");
	var i;
	var nextNumber = elements.length;
	for (i=0; i<elements.length; i++) {
		if (elements[i].style.display === "block") {
			nextNumber = i;
			break;
		}
	}
	if (nextNumber < 1) {
		nextNumber = elements.length;
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



