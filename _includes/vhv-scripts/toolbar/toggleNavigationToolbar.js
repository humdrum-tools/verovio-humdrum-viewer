



//////////////////////////////
//
// toggleNavigationToolbar --
//

function toggleNavigationToolbar() {
	var element = document.querySelector("#toolbar");
	if (!element) {
		return;
	}
	var state = element.style.display;
	if (state !== "none") {
		element.style.display = "none";
	} else {
		element.style.display = "flex";
	}
}



