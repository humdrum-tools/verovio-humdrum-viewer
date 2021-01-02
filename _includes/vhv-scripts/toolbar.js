


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




//////////////////////////////
//
// gotoNextToolbar -- go to the next toolbar.  number is the current
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



//////////////////////////////
//
// showToolbarHelp --
//

function showToolbarHelp() {
	var help = window.open("https://doc.verovio.humdrum.org/interface/toolbar", "documentation");
	help.focus();
}



//////////////////////////////
//
// matchToolbarVisibilityIconToState -- Needed as a separate function
//     since the menu is created after the k=y URL parameter is set.
//

function matchToolbarVisibilityIconToState() {
	var velement = document.querySelector("#text-visibility-icon");
	var output;
	if (velement) {
		if (InputVisible) {
			output = "<div title='Click to hide text editor (alt-y)' class='nav-icon fas fa-eye'></div>";
		} else {
			output = "<div title='Click to show text editor (alt-y)' class='nav-icon fas fa-eye-slash'></div>";
		}
		velement.innerHTML = output;
	}

	var texticons = document.querySelectorAll(".text-only");
	var i;
	if (InputVisible) {
		for (i=0; i<texticons.length; i++) {
			texticons[i].style.display = "inline-block";
		}
	} else {
		for (i=0; i<texticons.length; i++) {
			texticons[i].style.display = "none";
		}
	}
}



///////////////////////////////
//
// toggleLineBreaks --
//

function toggleLineBreaks() {
	BREAKS = !BREAKS;
	var element = document.querySelector("#line-break-icon");
	if (!element) {
		console.log("Warning: cannot find line-break icon");
		return;
	}
	var output = "";
	if (BREAKS) {
		output += '<span title="Click for automatic line breaks" class="nav-icon fas fa-align-justify"></span>';
	} else {
		output += '<span title="Click to use embedded line breaks (if any)" class="nav-icon fas fa-align-center"></span>';
	}
	element.innerHTML = output;

	displayNotation();
}
