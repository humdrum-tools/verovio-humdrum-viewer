

function gotoNextToolbar(number, event) {
	var elements = document.querySelectorAll("[id^=toolbar-]");
	var newnum;
	if (event) {
		if (event.shiftKey) {
			if (event.altKey) {
				newnum = 1;
			} else {
				newnum = number - 1;
			}
		} else if (event.altKey) {
			newnum = 1;
		} else {
			newnum = number + 1;
		}
	} else {
		newnum = number + 1;
	}
	if (newnum < 1) {
		newnum = elements.length;
	} else if (newnum > elements.length) {
		newnum = 1;
	}

	var id = "toolbar-" + newnum;
	for (var i=0; i<elements.length; i++) {
		if (elements[i].id === id) {
			elements[i].style.display = "block";
		} else {
			elements[i].style.display = "none";
		}
	}

	LASTTOOLBAR = newnum;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}
