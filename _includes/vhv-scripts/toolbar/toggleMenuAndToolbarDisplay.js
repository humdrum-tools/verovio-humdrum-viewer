


//////////////////////////////
//
// toggleMenuAndToolbarDisplay --  alt-shift-E shortcut
//
// #menubar.style.display = "none" if not visible
// #menubar.style.display = "block" if visible
//
// #input.style.top: 64px if visible
//	#input.style.top  30px if not visible
//
// #output.style.top: 64px if visible
//	#output.style.top  30px if not visible
//

function toggleMenuAndToolbarDisplay() {
	var melement = document.querySelector("#menubar");
	if (!melement) {
		return;
	}
	var ielement = document.querySelector("#input");
	var oelement = document.querySelector("#output");
	var selement = document.querySelector("#splitter");

	if (melement.style.display != "none") {
		// hide display of menu and toolbar
		ielement.style.top = "30px";
		oelement.style.top = "30px";
		melement.style.display = "none";
		selement.style.top = "30px";

	} else {
		// show menu and toolbar
		ielement.style.top = "64px";
		oelement.style.top = "64px";
		selement.style.top = "64px";
		melement.style.display = "block";
	}
}

