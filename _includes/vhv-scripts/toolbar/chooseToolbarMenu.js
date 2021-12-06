

//////////////////////////////
//
// chooseToolbarMenu --
//    (presuming that the toolbars are in numeric order)
//

function chooseToolbarMenu(menunum) {
	if (menunum === "main")   { menunum = 1; }
	if (menunum === "save")   { menunum = 2; }
	if (menunum === "load")   { menunum = 3; }
	if (menunum === "search") { menunum = 4; }
	if (menunum === "filter") { menunum = 5; }
	if (!menunum) {
		menunum = InterfaceSingleNumber;
		InterfaceSingleNumber = 0;
	}

	var elements = document.querySelectorAll("[id^=toolbar-]");
	var eactive;
	var activeindex = -1;
	for (var i=0; i<elements.length; i++) {
		if (elements[i].style.display === "block") {
			activeindex = i;
			break;
		} else if (!elements[i].style.display) {
			activeindex = i;
			break;
		}
	}

	var nextindex = -1;
	if (menunum > 0) {
		// a specific toolbar menu is desired
		nextindex = menunum - 1;
		if (nextindex >= elements.length) {
			nextindex = elements.length - 1;
		}
	} else {
		nextindex = activeindex + 1;
		if (nextindex >= elements.length) {
			nextindex = 0;
		}
	}

	elements[activeindex].style.display = "none";
	elements[nextindex].style.display   = "block";

	LASTTOOLBAR = nextindex + 1;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}

