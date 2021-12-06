


//////////////////////////////
//
// toggleMenuDisplay --
//

function toggleMenuDisplay() {
	var element = document.querySelector("ul.navbar-nav");
	if (!element) {
		return;
	}
	var fontsize = element.style["font-size"];
	if (fontsize === "" || fontsize === "17px") {
		element.style["font-size"] = "0px";
	} else {
		element.style["font-size"] = "17px";
	}
}


