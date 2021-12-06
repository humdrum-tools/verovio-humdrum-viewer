
//////////////////////////////
//
// gotoToolbarMenu -- show a particular toolbar menu:
//

function gotoToolbarMenu(number) {
	var id = "toolbar-" + number;
	var etoolbar = document.querySelector("#toolbar");
	var elements = toolbar.querySelectorAll("[id^=toolbar-]");
	for (var i=0; i<elements.length; i++) {
		if (elements[i].id === id) {
			elements[i].style.display = "block";
		} else {
			elements[i].style.display = "none";
		}
	}
	LASTTOOLBAR = number;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}



