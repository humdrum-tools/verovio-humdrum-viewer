//
// menu.js -- functions to interface with the top menu.
//
// vim: ts=3
//

let MENU = new MenuInterface();
let MENUDATA = { };
let LANGUAGE = "DEFAULT";
let DICTIONARY = {};
let COMPILEFILTERAUTOMATIC = false;

function MenuInterface() {
	this.contextualMenus = {};
}


function setInitialLanguage() {
	if (localStorage["LANGUAGE"]) {
		LANGUAGE = localStorage["LANGUAGE"];
	} else {
		let lang = navigator.language.replace(/-.*/, "").toUpperCase();
		if (lang.length = 2) {
			LANGUAGE = lang;
		}
	}
}



document.addEventListener("DOMContentLoaded", function() {
	setInitialLanguage();
	processMenuAton();
	MENU.initialize();
});



function processMenuAton() {
	let element = document.querySelector("script#aton-menu-data");
	if (!element) {
		console.log("Warning: cannot find element script#aton-menu-data");
		return;
	}
	let aton = new ATON();
	MENUDATA = aton.parse(element.textContent).MENU;
	adjustMenu(MENUDATA);

	DICTIONARY = {};
	let MD = MENUDATA.DICTIONARY.ENTRY;
	for (let i=0; i<MD.length; i++) {
			DICTIONARY[MD[i].DEFAULT] = MD[i];
	}

	// Use handlebars to generate HTML code for menu.

	let tsource = document.querySelector("#template-menu").textContent;
	let menuTemplate = Handlebars.compile(tsource);
	let output = menuTemplate(MENUDATA);
	let newmenuelement = document.querySelector("#menu-div");

	let tsource2 = document.querySelector("#template-toolbar").textContent;
	let toolbarTemplate = Handlebars.compile(tsource2);
	let output2 = toolbarTemplate("");
	let toolbarelement = document.querySelector("#toolbar");

	if (newmenuelement && toolbarelement) {
		newmenuelement.innerHTML = output;
		MENU.highlightOptions();
		toolbarelement.innerHTML = output2;
		prepareBufferStates();
		if (HIDEINITIALTOOLBAR) {
			toggleNavigationToolbar();
		}
		if (HIDEMENUANDTOOLBAR) {
			toggleMenuAndToolbarDisplay();
		}
		if (MULTIPAGEVIEW) {
			MENU.multiPageView();
			// just used once at initialization:
			MULTIPAGEVIEW = false;
		}
		fillSearchFieldsFromCgi();
		fillFilterFieldFromCgi();
		if (HIDEMENU) {
			toggleMenuDisplay();
		}
		if (!InputVisible) {
			// Or do it all of the time.
			matchToolbarVisibilityIconToState();
		}
	}
	if (TOOLBAR) {
		if (TOOLBAR.match(/save/i)) {
			chooseToolbarMenu("save");
		} else if (TOOLBAR.match(/load/i)) {
			chooseToolbarMenu("load");
		} else if (TOOLBAR.match(/search/i)) {
			chooseToolbarMenu("search");
		} else if (TOOLBAR.match(/filter/i)) {
			chooseToolbarMenu("filter");
		} else if (TOOLBAR.match(/spreadsheet/i)) {
			chooseToolbarMenu("spreadsheet");
		} else {
			// toolbar menu 1 is otherwise the default
			chooseToolbarMenu(1);
		}
	} else if (LASTTOOLBAR) {
			// load toolbar from last visit
			chooseToolbarMenu(LASTTOOLBAR);
	}
	fillSpreadsheetId();
}



//////////////////////////////
//
// fillFilterFieldFromCgi --
//

function fillFilterFieldFromCgi() {
	if (!GLOBALFILTER) {
		// nothing to do
		return;
	}
	let efilter = document.querySelector("input#filter");
	if (!efilter) {
		return;
	}
	efilter.value = GLOBALFILTER;
	applyGlobalFilter();
	chooseToolbarMenu("filter");
	// A different function will try to override this, so force
	// it back to the filter toolbar:
	TOOLBAR = "filter";
	if (CGI.k && CGI.k.match(/c/)) {
		COMPILEFILTERAUTOMATIC = true;
	}
}



//////////////////////////////
//
// fillSpreadsheetId --
//

function fillSpreadsheetScriptId() {
	if (!SPREADSHEETSCRIPTID) {
		return;
	}
	let element = document.querySelector("input#scriptid");
	if (!element) {
		return;
	}
	let value = SPREADSHEETSCRIPTID;
	if (SPREADSHEETID) {
		value += "|" + SPREADSHEETID;
	}
	element.value = value;
}



//////////////////////////////
//
// fillSearchFieldsFromCgi --
//

function fillSearchFieldsFromCgi() {
	let esearch = document.querySelector("#search-group");
	if (!esearch) {
		return;
	}

	if (!PQUERY.match(/^\s*$/)) {
		let epitch = esearch.querySelector("#search-pitch");
		if (epitch) {
			epitch.value = PQUERY;
		}
	}

	if (!IQUERY.match(/^\s*$/)) {
		let ipitch = esearch.querySelector("#search-interval");
		if (ipitch) {
			ipitch.value = IQUERY;
		}
	}

	if (!RQUERY.match(/^\s*$/)) {
		let rpitch = esearch.querySelector("#search-rhythm");
		if (rpitch) {
			rpitch.value = RQUERY;
		}
	}

	// the SEARCHFILTER let does not need to be built
	// because that was done in scripts/listeners.js when
	// DOMContentLoaded event was triggered.
}



//////////////////////////////
//
// adjustMenu --
//

function adjustMenu (object) {
	for (let property in object) {
		if (object.hasOwnProperty(property)) {
			if (property === "RIGHT_TEXT") {
				if (!Array.isArray(object[property])) {
					object[property] = [ object[property] ];
				}
			} else if (typeof object[property] == "object") {
				adjustMenu(object[property]);
			}
		}
	}
}



MenuInterface.prototype.initialize = function () {
	this.contextualMenus = this.getContextualMenus();
};



MenuInterface.prototype.hideContextualMenus = function () {
	let keys = Object.keys(this.contextualMenus);
	for (let i=0; i<keys.length; i++) {
		this.contextualMenus[keys[i]].style.display = "none";
	}
};



MenuInterface.prototype.hideMenus = function (name) {
	this.hideContextualMenu();
};



MenuInterface.prototype.showMenu = function (name) {
	this.showContextualMenu(name);
};



MenuInterface.prototype.showContextualMenu = function (name) {
	let keys = Object.keys(this.contextualMenus);
	for (let i=0; i<keys.length; i++) {
		if (name === keys[i]) {
			this.contextualMenus[keys[i]].style.display = "block";
		} else {
			this.contextualMenus[keys[i]].style.display = "none";
		}
	}
};



MenuInterface.prototype.showCursorNoteMenu = function (element) {
	if (!element) {
		this.hideContextualMenus();
		return;
	}
	let id = element.id;
	if (!id) {
		this.hideContextualMenus();
		return;
	}
	let matches = id.match(/^([A-Z]+)-/i);
	if (!matches) {
		this.hideContextualMenus();
		return;
	}
	let name = matches[1];
	name = name.charAt(0).toUpperCase() + name.slice(1);
	this.showContextualMenu(name);
};



///////////////////////////////////////////////////////////////////////////
//
// Maintenance functions
//

MenuInterface.prototype.getContextualMenus = function () {
	let output = {};
	let element = document.querySelector("#navbarNavDropdown");
	if (!element) {
		return output;
	}
	let items = element.querySelectorAll("li.contextual");
	if (!items) {
		return output;
	}
	for (let i=0; i<items.length; i++) {
		let nameelement = items[i].querySelector(".menu-name");
		if (!nameelement) {
			continue;
		}
		let name = nameelement.textContent.trim();
		output[name] = items[i];
	}

	return output;
};



///////////////////////////////////////////////////////////////////////////
//
// Regular interface commnds (no graphical commands):
//


//////////////////////////////
//
// MenuInterface::toggleOriginalClefs --
//

MenuInterface.prototype.toggleOriginalClefs = function () {
	let event = {};
	event.code = KEYS.OKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::displaySvgData --  This is now obsolete (the
//   SVG image will be saved to a file in the Downloads folder.
//

MenuInterface.prototype.displaySvgData = function () {
	let event = {};
	event.code = KEYS.GKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::saveSvgData --
//

MenuInterface.prototype.saveSvgData = function () {
	let event = {};
	event.code = KEYS.GKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::loadRepertory --
//

MenuInterface.prototype.loadRepertory = function (repertory, filter) {
	let options = {
			file: repertory,
			next: true,
			previous: true
		}
	if (filter) {
		options.filter = filter;
		CGI.filter = filter;
	} else {
		CGI.filter = "";
	}
	loadKernScoresFile(options);
};



//////////////////////////////
//
// MenuInterface::saveTextEditorContents --
//

MenuInterface.prototype.saveTextEditorContents = function () {
	let event = {};
	event.code = KEYS.SKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::saveHtmlContents --
//

MenuInterface.prototype.saveHtmlContents = function () {
	downloadEditorContentsInHtml();
};



//////////////////////////////
//
// MenuInterface::compileEmbeddedFilters --
//

MenuInterface.prototype.compileEmbeddedFilters = function () {
	let event = {};
	event.code = KEYS.CKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::clearEditorContents --
//

MenuInterface.prototype.clearEditorContents = function () {
	let event = {};
	event.code = KEYS.EKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::showSourceScan --
//

MenuInterface.prototype.showSourceScan = function () {
	let event = {};
	event.code = KEYS.PKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::createPdf --
//

MenuInterface.prototype.createPdf = function () {
	let event = {};
	event.code = KEYS.TKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::reloadFromSource --
//

MenuInterface.prototype.reloadFromSource = function () {
	let event = {};
	event.code = KEYS.RKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::createPdfPage --
//

MenuInterface.prototype.createPdfPage = function () {
	let event = {};
	event.code = KEYS.TKey;
	event.altKey = true;
	event.shiftKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::increaseNotationSpacing --
//

MenuInterface.prototype.increaseNotationSpacing = function () {
	let event = {};
	event.code = KEYS.WKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::decreaseNotationSpacing --
//

MenuInterface.prototype.decreaseNotationSpacing = function () {
	let event = {};
	event.code = KEYS.WKey;
	event.altKey = true;
	event.shiftKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::decreaseStaffSpacing --
//

MenuInterface.prototype.decreaseStaffSpacing = function () {
	SPACING_STAFF -= 1;
	if (SPACING_STAFF < 0) {
		SPACING_STAFF = 0;
	}
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::increaseStaffSpacing --
//

MenuInterface.prototype.increaseStaffSpacing = function () {
	SPACING_STAFF += 1;
	if (SPACING_STAFF > 24) {
		SPACING_STAFF = 24;
	}
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::decreaseSystemSpacing --
//

MenuInterface.prototype.decreaseSystemSpacing = function () {
	SPACING_SYSTEM -= 1;
	if (SPACING_SYSTEM < 0) {
		SPACING_SYSTEM = 0;
	}
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::increaseSystemSpacing --
//

MenuInterface.prototype.increaseSystemSpacing = function () {
	SPACING_SYSTEM += 1;
	if (SPACING_SYSTEM > 12) {
		SPACING_SYSTEM = 12;
	}
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::decreaseLyricSize --
//

MenuInterface.prototype.decreaseLyricSize = function () {
	LYRIC_SIZE -= 0.25;
	if (LYRIC_SIZE < 2.0) {
		LYRIC_SIZE = 2.0;
	}
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::increaseLyricSize --
//

MenuInterface.prototype.increaseLyricSize = function () {
	LYRIC_SIZE += 0.25;
	if (LYRIC_SIZE > 8.0) {
		LYRIC_SIZE = 8.0;
	}
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::useLeipzigFont --
//

MenuInterface.prototype.useLeipzigFont = function () {
	FONT = "Leipzig";
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::useLelandFont --
//

MenuInterface.prototype.useLelandFont = function () {
	FONT = "Leland";
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::usePetalumaFont --
//

MenuInterface.prototype.usePetalumaFont = function () {
	FONT = "Petaluma";
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::useBravuraFont --
//

MenuInterface.prototype.useBravuraFont = function () {
	FONT = "Bravura";
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::useGootvilleFont --
//

MenuInterface.prototype.useGootvilleFont = function () {
	FONT = "Gootville";
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::applyFilter --
//

MenuInterface.prototype.applyFilter = function (filter, data, callback) {
	let contents = "";
	let editor = 0;
	if (!data) {
		contents = EDITOR.getValue().replace(/^\s+|\s+$/g, "");
		editor = 1;
	} else {
		contents = data.replace(/^\s+|\s+$/g, "");;
	}
	let options = humdrumToSvgOptions();
	data = contents + "\n!!!filter: " + filter + "\n";
	vrvWorker.filterData(options, data, "humdrum")
	.then(function (newdata) {
		newdata = newdata.replace(/\s+$/m, "");
		let lines = newdata.match(/[^\r\n]+/g);
		for (let i=lines.length-1; i>=0; i--) {
			if (lines[i].match(/^!!!Xfilter:/)) {
				lines[i] = "";
				break;
			}
		}
		newdata = "";
		for (let i=0; i<lines.length; i++) {
			if (lines[i] === "") {
				continue;
			}
			newdata += lines[i] + "\n";
		}
		if (editor) {
			EDITOR.setValue(newdata, -1);
		}
		if (callback) {
			callback(newdata);
		}
	});
};



//////////////////////////////
//
// MenuInterface::insertLocalCommentLine --
//

MenuInterface.prototype.insertLocalCommentLine = function () {
	let event = {};
	event.code = KEYS.LKey;
	event.shiftKey = true;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::insertNullDataLine --
//

MenuInterface.prototype.insertNullDataLine = function () {
	let event = {};
	event.code = KEYS.DKey;
	event.shiftKey = true;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::insertInterpretationLine --
//

MenuInterface.prototype.insertInterpretationLine = function () {
	let event = {};
	event.code = KEYS.IKey;
	event.shiftKey = true;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::insertBarline --
//

MenuInterface.prototype.insertBarline = function () {
	let event = {};
	event.code = KEYS.BKey;
	event.key = "B";
	event.shiftKey = true;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::insertInvisibleBarline --
//

MenuInterface.prototype.insertInvisibleBarline = function () {
	let event = {};
	event.code = KEYS.BKey;
	event.key = "B";
	event.shiftKey = true;
	event.altKey = true;
	event.ctrlKey = true;
	processInterfaceKeyCommand(event);
};




//////////////////////////////
//
// MenuInterface::toggleDataDisplay --
//

MenuInterface.prototype.toggleDataDisplay = function () {
	let event = {};
	event.code = KEYS.YKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::toggleToolbarDisplay --
//

MenuInterface.prototype.toggleToolbarDisplay = function () {
	toggleNavigationToolbar();
};



//////////////////////////////
//
// MenuInterface::toggleMenuAndToolbarDisplay --
//

MenuInterface.prototype.toggleMenuAndToolbarDisplay = function () {
	toggleMenuAndToolbarDisplay();
};



//////////////////////////////
//
// MenuInterface::toggleLogoDisplay --
//

MenuInterface.prototype.toggleLogoDisplay = function () {
	toggleVhvTitle();
};



//////////////////////////////
//
// MenuInterface::toggleLayerHighlighting --
//

MenuInterface.prototype.toggleLayerHighlighting = function () {
	let event = {};
	event.code = KEYS.LKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::increaseTabSize --
//

MenuInterface.prototype.increaseTabSize = function () {
	let event = {};
	event.code = KEYS.DotKey;
	event.altKey = true;
	event.shiftKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::decreaseTabSize --
//

MenuInterface.prototype.decreaseTabSize = function () {
	let event = {};
	event.code = KEYS.CommaKey;
	event.altKey = true;
	event.shiftKey = true;
	processInterfaceKeyCommand(event);
};


//////////////////////////////
//
// MenuInterface::fitTabSizeToData -- Not perfect since not using an equal-sized character font.
//

MenuInterface.prototype.fitTabSizeToData = function () {
	let lines = EDITOR.getValue().match(/[^\r\n]+/g);
	let max = 4;
	for (let i=0; i<lines.length; i++) {
		if (lines[i].match(/^\s*$/)) {
			continue;
		}
		if (lines[i].match(/^!/)) {
			// not keeping track of local comments which can be long
			// due to embedded layout commands.
			continue;
		}
		let line = lines[i].split("\t");
		for (let j=0; j<line.length; j++) {
			if (line[j].length > 25) {
				// ignore very long tokens
				continue;
			}
			if (line[j].length > max) {
				max = line[j].length + 3;
			}
		}
	}
	// ignore strangely long cases:
	if (max > 25) {
		max = 25;
	}
	TABSIZE = max;
	EDITOR.getSession().setTabSize(TABSIZE);
};



//////////////////////////////
//
// MenuInterface::openURL -- opens in a new tab.
//

MenuInterface.prototype.openUrl = function (url, target) {
	if (!target) {
		target = "_blank";
	}
	window.open(url, target);
};



//////////////////////////////
//
// MenuInterface::dropdown menu funcionality:
//

$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
  if (!$(this).next().hasClass('show')) {
    $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
  }
  let $subMenu = $(this).next(".dropdown-menu");
  $subMenu.toggleClass('show');


  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
    $('.dropdown-submenu .show').removeClass("show");
  });

  return false;
});



//////////////////////////////
//
// MenuInterface::toggleCsvTsv --
//

MenuInterface.prototype.toggleCsvTsv = function () {
	toggleHumdrumCsvTsv();
};



//////////////////////////////
//
// MenuInterface::toggleVimPlainTextMode --
//

MenuInterface.prototype.toggleVimPlainTextMode = function () {
	let event = {};
	event.code = KEYS.VKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};




//////////////////////////////
//
// MenuInterface::displayHumdrumData --
//

MenuInterface.prototype.displayHumdrumData = function () {
	let event = {};
	event.code = KEYS.HKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::displayMeiData --
//

MenuInterface.prototype.displayMeiData = function () {
	let event = {};
	event.code = KEYS.MKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::loadFromBuffer --
//

MenuInterface.prototype.loadFromBuffer = function (bufferNumber) {
	let event = {};
	switch (bufferNumber) {
		case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
		case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
		case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
		case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
		case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
		case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
		case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
		case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
		case 8: event.code = KEYS.EightKey; event.key = "8"; break;
		case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
		default:
			console.log("UNKNOWN BUFFER:", bufferNumber);
			return;
	}
	event.altKey = true;
	processInterfaceKeyCommand(event);

	event.code = KEYS.RKey;
	event.shiftKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::saveToBuffer --
//

MenuInterface.prototype.saveToBuffer = function (bufferNumber) {
	let event = {};

	// First store the buffer number in the number register:
	switch (bufferNumber) {
		case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
		case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
		case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
		case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
		case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
		case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
		case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
		case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
		case 8: event.code = KEYS.EightKey; event.key = "8"; break;
		case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
		default:
			console.log("UNKNOWN BUFFER:", bufferNumber);
			return;
	}

	event.altKey = true;
	processInterfaceKeyCommand(event);

	// Now run the save buffer command:
	event.code = KEYS.SKey;
	event.shiftKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::goToLastPage --
//

MenuInterface.prototype.goToLastPage = function (event) {
	if (!event) {
		event = {};
	}
	event.code = KEYS.EndKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::goToFirstPage --
//

MenuInterface.prototype.goToFirstPage = function (event) {
	if (!event) {
		event = {};
	}
	event.code = KEYS.HomeKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::goPreviousWork --
//

MenuInterface.prototype.goToPreviousWork = function (event) {
	if (!event) {
		event = {};
	}
	event.code = LeftKey;
	event.altKey = true;
	event.shiftKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::goToNextWork --
//

MenuInterface.prototype.goToNextWork = function () {
	let event = {};
	event.code = RightKey;
	event.altKey = true;
	event.shiftKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::goToNextPage --
//

MenuInterface.prototype.goToNextPage = function (event) {
	if (!event) {
		event = {};
	}
	event.code = RightKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::goToPreviousPage --
//

MenuInterface.prototype.goToPreviousPage = function (event) {
	if (!event) {
		event = {};
	}
	event.code = LeftKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::toggleMidiPlayback --
//

MenuInterface.prototype.toggleMidiPlayback = function () {
	let event = {};
	event.code = KEYS.SpaceKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};



//////////////////////////////
//
// MenuInterface::toggleNotationFreezing --
//

MenuInterface.prototype.toggleNotationFreezing = function () {
	let event = {};
	event.code = KEYS.FKey;
	event.altKey = true;
	processInterfaceKeyCommand(event);
};


///////////////////////////////////////////////////////////////////////////
//
// Contextual Graphic editing functions
//



//////////////////////////////
//
// MenuInterface::forceNoteStemUp --
//

MenuInterface.prototype.forceNoteStemUp = function () {
	processNotationKey("a", CursorNote);
};



//////////////////////////////
//
// MenuInterface::forceNoteStemDown --
//

MenuInterface.prototype.forceNoteStemDown = function () {
	processNotationKey("b", CursorNote);
};



//////////////////////////////
//
// MenuInterface::removeStemDirection --
//

MenuInterface.prototype.removeStemDirection = function () {
	processNotationKey("c", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleEditorialAccidental --
//

MenuInterface.prototype.toggleEditorialAccidental = function () {
	processNotationKey("i", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleNaturalAccidental --
//

MenuInterface.prototype.toggleNaturalAccidental = function () {
	processNotationKey("n", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleSharpAccidental --
//

MenuInterface.prototype.toggleSharpAccidental = function () {
	processNotationKey("#", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleFlatAccidental --
//

MenuInterface.prototype.toggleFlatAccidental = function () {
	processNotationKey("-", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleForcedDisplay --
//

MenuInterface.prototype.toggleForcedDisplay = function () {
	processNotationKey("X", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleStaccato --
//

MenuInterface.prototype.toggleStaccato = function () {
	processNotationKey("'", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleMinorLowerMordent --
//

MenuInterface.prototype.toggleMinorLowerMordent = function () {
	processNotationKey("m", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleMajorLowerMordent --
//

MenuInterface.prototype.toggleMajorLowerMordent = function () {
	processNotationKey("M", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleMinorUpperMordent --
//

MenuInterface.prototype.toggleMinorUpperMordent = function () {
	processNotationKey("w", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleMajorUpperMordent --
//

MenuInterface.prototype.toggleMajorUpperMordent = function () {
	processNotationKey("W", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleFermata --
//

MenuInterface.prototype.toggleFermata = function () {
	processNotationKey(";", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleArpeggio --
//

MenuInterface.prototype.toggleArpeggio = function () {
	processNotationKey(":", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleAccent --
//

MenuInterface.prototype.toggleAccent = function () {
	processNotationKey("^", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleMarcato --
//

MenuInterface.prototype.toggleMarcato = function () {
	processNotationKey("^^", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleStaccatissimo --
//

MenuInterface.prototype.toggleStaccatissimo = function () {
	processNotationKey("`", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleTenuto --
//

MenuInterface.prototype.toggleTenuto = function () {
	processNotationKey("~", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleMajorTrill --
//

MenuInterface.prototype.toggleMajorTrill = function () {
	processNotationKey("T", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleMinorTrill --
//

MenuInterface.prototype.toggleMinorTrill = function () {
	processNotationKey("t", CursorNote);
};



//////////////////////////////
//
// MenuInterface::forceSlurAbove --
//

MenuInterface.prototype.forceSlurAbove = function () {
	processNotationKey("a", CursorNote);
};



//////////////////////////////
//
// MenuInterface::forceSlurBelow --
//

MenuInterface.prototype.forceSlurBelow = function () {
	processNotationKey("b", CursorNote);
};



//////////////////////////////
//
// MenuInterface::removeSlurOrientation --
//

MenuInterface.prototype.removeSlurOrientation = function () {
	processNotationKey("c", CursorNote);
};



//////////////////////////////
//
// MenuInterface::deleteSlur --
//

MenuInterface.prototype.deleteSlur = function () {
	processNotationKey("D", CursorNote);
};



//////////////////////////////
//
// MenuInterface::forceBeamAbove --
//

MenuInterface.prototype.forceBeamAbove = function () {
	processNotationKey("a", CursorNote);
};




//////////////////////////////
//
// MenuInterface::forceBeamBelow --
//

MenuInterface.prototype.forceBeamBelow = function () {
	processNotationKey("b", CursorNote);
};



//////////////////////////////
//
// MenuInterface::removeBeamOrientation --
//

MenuInterface.prototype.removeBeamOrientation = function () {
	processNotationKey("c", CursorNote);
};



//////////////////////////////
//
// MenuInterface::forceTieAbove --
//

MenuInterface.prototype.forceTieAbove = function () {
	processNotationKey("a", CursorNote);
};



//////////////////////////////
//
// MenuInterface::forceTieBelow --
//

MenuInterface.prototype.forceTieBelow = function () {
	processNotationKey("b", CursorNote);
};



//////////////////////////////
//
// MenuInterface::removeTieOrientation --
//

MenuInterface.prototype.removeTieOrientation = function () {
	processNotationKey("c", CursorNote);
};



//////////////////////////////
//
// MenuInterface::breakBeamAfterNote --
//

MenuInterface.prototype.breakBeamAfterNote = function () {
	processNotationKey("J", CursorNote);
};



//////////////////////////////
//
// MenuInterface::breakBeamBeforeNote --
//

MenuInterface.prototype.breakBeamBeforeNote = function () {
	processNotationKey("L", CursorNote);
};



//////////////////////////////
//
// MenuInterface::makeRestInvisible --
//

MenuInterface.prototype.makeRestInvisible = function () {
	processNotationKey("y", CursorNote);
};




//////////////////////////////
//
// MenuInterface::togglePedalDown --
//

MenuInterface.prototype.togglePedalDown = function () {
	processNotationKey("p", CursorNote);
};



//////////////////////////////
//
// MenuInterface::togglePedalUp --
//

MenuInterface.prototype.togglePedalUp = function () {
	processNotationKey("P", CursorNote);
};



//////////////////////////////
//
// MenuInterface::togglePedalUp --
//

MenuInterface.prototype.togglePedalUp = function () {
	processNotationKey("P", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleGraceNoteStyle --
//

MenuInterface.prototype.toggleGraceNoteStyle = function () {
	processNotationKey("q", CursorNote);
};



//////////////////////////////
//
// MenuInterface::toggleAtMark --
//

MenuInterface.prototype.toggleAtMark = function () {
	processNotationKey("@", CursorNote);
};



//////////////////////////////
//
// MenuInterface::addSlur --
//

MenuInterface.prototype.addSlur = function (number) {
	if ((number < 10) && (number > 1)) {
		let event = {};

		// First store the buffer number in the number register:
		switch (bufferNumber) {
			case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
			case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
			case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
			case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
			case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
			case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
			case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
			case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
			case 8: event.code = KEYS.EightKey; event.key = "8"; break;
			case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
			default:
				console.log("UNKNOWN BUFFER:", bufferNumber);
				return;
		}

		event.altKey = true;
		processInterfaceKeyCommand(event);
	}

	processNotationKey("s", CursorNote);
};


//////////////////////////////
//
// MenuInterface::nextHarmonicNote --
//

MenuInterface.prototype.nextHarmonicNote = function () {
	goUpHarmonically(CursorNote);
};



//////////////////////////////
//
// MenuInterface::previousHarmonicNote --
//

MenuInterface.prototype.previousHarmonicNote = function () {
	goDownHarmonically(CursorNote);
};



//////////////////////////////
//
// MenuInterface::nextMelodicNote --
//

MenuInterface.prototype.nextMelodicNote = function () {
	goToNextNoteOrRest(CursorNote.id);
};



//////////////////////////////
//
// MenuInterface::previousMelodicNote --
//

MenuInterface.prototype.previousMelodicNote = function () {
	goToPreviousNoteOrRest(CursorNote.id);
};



//////////////////////////////
//
// MenuInterface::pitchDownStep --
//

MenuInterface.prototype.pitchDownStep = function (number) {
	if ((number < 10) && (number > 1)) {
		let event = {};

		// First store the buffer number in the number register:
		switch (bufferNumber) {
			case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
			case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
			case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
			case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
			case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
			case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
			case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
			case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
			case 8: event.code = KEYS.EightKey; event.key = "8"; break;
			case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
			default:
				console.log("UNKNOWN BUFFER:", bufferNumber);
				return;
		}

		event.altKey = true;
		processInterfaceKeyCommand(event);
	}
	processNotationKey("transpose-down-step", CursorNote);
};



//////////////////////////////
//
// MenuInterface::pitchUpStep --
//

MenuInterface.prototype.pitchUpStep = function (number) {
	if ((number < 10) && (number > 1)) {
		let event = {};

		// First store the buffer number in the number register:
		switch (bufferNumber) {
			case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
			case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
			case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
			case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
			case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
			case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
			case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
			case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
			case 8: event.code = KEYS.EightKey; event.key = "8"; break;
			case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
			default:
				console.log("UNKNOWN BUFFER:", bufferNumber);
				return;
		}

		event.altKey = true;
		processInterfaceKeyCommand(event);
	}
	processNotationKey("transpose-up-step", CursorNote);
};



//////////////////////////////
//
// MenuInterface::pitchUpOctave --
//

MenuInterface.prototype.pitchUpOctave = function (number) {
	if ((number < 10) && (number > 1)) {
		let event = {};

		// First store the buffer number in the number register:
		switch (bufferNumber) {
			case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
			case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
			case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
			case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
			case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
			case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
			case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
			case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
			case 8: event.code = KEYS.EightKey; event.key = "8"; break;
			case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
			default:
				console.log("UNKNOWN BUFFER:", bufferNumber);
				return;
		}

		event.altKey = true;
		processInterfaceKeyCommand(event);
	}
	processNotationKey("transpose-up-octave", CursorNote);
};



//////////////////////////////
//
// MenuInterface::pitchDownOctave --
//

MenuInterface.prototype.pitchDownOctave = function (number) {
	if ((number < 10) && (number > 1)) {
		let event = {};

		// First store the buffer number in the number register:
		switch (bufferNumber) {
			case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
			case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
			case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
			case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
			case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
			case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
			case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
			case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
			case 8: event.code = KEYS.EightKey; event.key = "8"; break;
			case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
			default:
				console.log("UNKNOWN BUFFER:", bufferNumber);
				return;
		}

		event.altKey = true;
		processInterfaceKeyCommand(event);
	}
	processNotationKey("transpose-down-octave", CursorNote);
};



//////////////////////////////
//
// MenuInterface::moveSlurStart --
//

MenuInterface.prototype.moveSlurStart = function (number) {
	if (number < 0) {
		if ((number < 10) && (number > 1)) {
			number = -number;
			let event = {};

			// First store the buffer number in the number register:
			switch (bufferNumber) {
				case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
				case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
				case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
				case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
				case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
				case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
				case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
				case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
				case 8: event.code = KEYS.EightKey; event.key = "8"; break;
				case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
				default:
					console.log("UNKNOWN BUFFER:", bufferNumber);
					return;
			}

			event.altKey = true;
			processInterfaceKeyCommand(event);
		}
		processNotationKey("leftEndMoveBack", CursorNote);
	} else {
		if ((number < 10) && (number > 1)) {
			let event = {};

			// First store the buffer number in the number register:
			switch (bufferNumber) {
				case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
				case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
				case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
				case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
				case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
				case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
				case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
				case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
				case 8: event.code = KEYS.EightKey; event.key = "8"; break;
				case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
				default:
					console.log("UNKNOWN BUFFER:", bufferNumber);
					return;
			}

			event.altKey = true;
			processInterfaceKeyCommand(event);
		}
		processNotationKey("leftEndMoveForward", CursorNote);
	}
};



//////////////////////////////
//
// MenuInterface::moveSlurEnd --
//

MenuInterface.prototype.moveSlurEnd = function (number) {
	if (number < 0) {
		number = -number;
		if ((number < 10) && (number > 1)) {
			let event = {};

			// First store the buffer number in the number register:
			switch (bufferNumber) {
				case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
				case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
				case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
				case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
				case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
				case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
				case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
				case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
				case 8: event.code = KEYS.EightKey; event.key = "8"; break;
				case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
				default:
					console.log("UNKNOWN BUFFER:", bufferNumber);
					return;
			}

			event.altKey = true;
			processInterfaceKeyCommand(event);
		}
		processNotationKey("rightEndMoveBack", CursorNote);
	} else {
		if ((number < 10) && (number > 1)) {
			let event = {};

			// First store the buffer number in the number register:
			switch (bufferNumber) {
				case 0: event.code = KEYS.ZeroKey;  event.key = "0"; break;
				case 1: event.code = KEYS.OneKey;   event.key = "1"; break;
				case 2: event.code = KEYS.TwoKey;   event.key = "2"; break;
				case 3: event.code = KEYS.ThreeKey; event.key = "3"; break;
				case 4: event.code = KEYS.FourKey;  event.key = "4"; break;
				case 5: event.code = KEYS.FiveKey;  event.key = "5"; break;
				case 6: event.code = KEYS.SixKey;   event.key = "6"; break;
				case 7: event.code = KEYS.SevenKey; event.key = "7"; break;
				case 8: event.code = KEYS.EightKey; event.key = "8"; break;
				case 9: event.code = KEYS.NineKey;  event.key = "9"; break;
				default:
					console.log("UNKNOWN BUFFER:", bufferNumber);
					return;
			}

			event.altKey = true;
			processInterfaceKeyCommand(event);
		}
		processNotationKey("rightEndMoveForward", CursorNote);
	}
};



//////////////////////////////
//
// MenuInterface::adjustNotationScale -- add or subtract the input value,
//     not going below 15 or above 500.
//

MenuInterface.prototype.adjustNotationScale = function (event, number) {
	if (event && event.shiftKey) {
		SCALE = 40;
	} else {
		SCALE = parseInt(SCALE * number + 0.5);
		if (SCALE < 15) {
			SCALE = 15;
		} else if (SCALE > 500) {
			SCALE = 500;
		}
	}
	localStorage.SCALE = SCALE;

	displayNotation();
};



//////////////////////////////
//
// MenuInterface::setLanguage --
//

MenuInterface.prototype.setLanguage = function (lang) {
	LANGUAGE = lang;

	// Use handlebars to generate HTML code for menu.
	let tsource = document.querySelector("#template-menu").textContent;
	let menuTemplate = Handlebars.compile(tsource);
	let output = menuTemplate(MENUDATA);
	let newmenuelement = document.querySelector("#menu-div");
	if (newmenuelement) {
		newmenuelement.innerHTML = output;
	}
};



//////////////////////////////
//
// MenuInterface::saveCurrentLanguagePreference --
//

MenuInterface.prototype.saveCurrentLanguagePreference = function () {
	localStorage["LANGUAGE"] = LANGUAGE;
};



//////////////////////////////
//
// MenuInterface::clearLanguagePreference --
//

MenuInterface.prototype.clearLanguagePreference = function () {
	delete localStorage["LANGUAGE"];
};



//////////////////////////////
//
// MenuInterface::increaseTextFontSize --
//

MenuInterface.prototype.increaseTextFontSize = function (event) {
	if (event.shiftKey) {
		INPUT_FONT_SIZE = 1.0;
	} else {
		INPUT_FONT_SIZE *= 1.05;
		if (INPUT_FONT_SIZE > 3.0) {
			INPUT_FONT_SIZE = 3.0;
		}
	}
	let element = document.querySelector("#input");
	if (!element) {
		return;
	}
	element.style.fontSize = INPUT_FONT_SIZE + "rem";
	localStorage.INPUT_FONT_SIZE = INPUT_FONT_SIZE;
};



////////////////////
//
// MenuInterface::resetTextFontSize --
//

MenuInterface.prototype.resetTextFontSize = function (event) {
	INPUT_FONT_SIZE = 1.0;
	let element = document.querySelector("#input");
	if (!element) {
		return;
	}
	element.style.fontSize = INPUT_FONT_SIZE + "rem";
	localStorage.INPUT_FONT_SIZE = INPUT_FONT_SIZE;
};


//////////////////////////////
//
// MenuInterface::decreaseTextFontSize --
//

MenuInterface.prototype.decreaseTextFontSize = function (event) {
	if (event.shiftKey) {
		INPUT_FONT_SIZE = 1.0;
	} else {
		INPUT_FONT_SIZE *= 0.95;
		if (INPUT_FONT_SIZE < 0.25) {
			INPUT_FONT_SIZE = 0.25;
		}
	}
	let element = document.querySelector("#input");
	if (!element) {
		return;
	}
	element.style.fontSize = INPUT_FONT_SIZE + "rem";
	localStorage.INPUT_FONT_SIZE = INPUT_FONT_SIZE;
};



//////////////////////////////
//
// MenuInterface::lineBreaksOff --
//

MenuInterface.prototype.lineBreaksOff = function () {
	BREAKS = true;
	toggleLineBreaks();
};



//////////////////////////////
//
// MenuInterface::lineBreaksOn --
//

MenuInterface.prototype.lineBreaksOn = function () {
	BREAKS = false;
	toggleLineBreaks();
};



//////////////////////////////
//
// MenuInterface::singlePageView --
//

MenuInterface.prototype.singlePageView = function () {
	PAGED = false;
	let element = document.querySelector("#page-nav");
	if (element) {
		element.style.display = "none";
	}
	let element2 = document.querySelector("#multi-page");
	if (element2) {
		element2.style.display = "block";
	}
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::multiPageView --
//

MenuInterface.prototype.multiPageView = function () {
	// return; // disabled until fix for issue https://github.com/rism-digital/verovio/issues/2034
	PAGED = true;
	let element = document.querySelector("#page-nav");
	if (element) {
		element.style.display = "block";
	}
	let element2 = document.querySelector("#multi-page");
	if (element2) {
		element2.style.display = "none";
	}
	displayNotation();
};



//////////////////////////////
//
// MenuInterface::startSplit --
//

MenuInterface.prototype.startSplit = function (count) {
	if (!count) {
		count = 32;
	}
	MenuInterface.prototype.removeSplits();
	let lines = EDITOR.getValue().match(/[^\r\n]+/g);
	let position = EDITOR.getCursorPosition();
	let counter = 0;
	let adjust = 0;
	let change = 0;
	let i;
	for (i=0; i<lines.length; i++) {
		if (lines[i].match(/^=/)) {
			counter++;
			if (counter == count) {
				lines[i] = "!!ignore\n" + lines[i];
				if (i > lines.row) {
					adjust++;
				}
				change = 1;
				break;
			}
		}
	}
	if (!change) {
		return;
	}
	let output = "";
	for (i=0; i<lines.length; i++) {
		output += lines[i] + "\n";
	}
	EDITOR.setValue(output, -1);
	position.row += adjust;
	EDITOR.moveCursorToPosition(position);
};



//////////////////////////////
//
// MenuInterface::nextSplit --
//

MenuInterface.prototype.nextSplit = function (count) {
	if (!count) {
		count = 32;
	}
	let lines = EDITOR.getValue().match(/[^\r\n]+/g);
	let position = EDITOR.getCursorPosition();
	if (lines.length == 0) {
		return;
	}
	let i;
	let adjust = 0;
	let changed = 0;
	let startpos = -1;
	let counter = 0;
	for (i=1; i<lines.length; i++) {
		if (lines[i] === "!!Xignore") {
			lines[i] = "XXX DELETE XXX";
			changed = 1;
			continue;
		} else if (lines[i] === "!!ignore") {
			lines[i] = "!!Xignore";
			changed = 1;
			startpos = i;
			break;
		}
	}
	if (!changed) {
		return;
	}
	// mark count measures later with !!ignore
	for (i=startpos + 1; i<lines.length; i++) {
		if (lines[i].match(/^=/)) {
			counter++;
			if (counter == count) {
				lines[i] = "!!ignore\n" + lines[i];
				if (i > lines.row) {
					adjust++;
				}
				change = 1;
				break;
			}
		}
	}
	if (lines[0] !== "!!ignore") {
		lines[0] = "!!ignore\n" + lines[0];
		adjust++;
	}
	let output = "";
	for (i=0; i<lines.length; i++) {
		if (lines[i] === "XXX DELETE XXX") {
			continue;
		}
		output += lines[i] + "\n";
	}
	EDITOR.setValue(output, -1);
	position.row += adjust;
	EDITOR.moveCursorToPosition(position);
};



//////////////////////////////
//
// MenuInterface::previousSplit --
//

MenuInterface.prototype.previousSplit = function (count) {
	if (!count) {
		count = 32;
	}
	let lines = EDITOR.getValue().match(/[^\r\n]+/g);
	let position = EDITOR.getCursorPosition();
	if (lines.length == 0) {
		return;
	}
	let i;
	let adjust = 0;
	let changed = 0;
	let startpos = -1;
	let counter = 0;
	for (i=1; i<lines.length; i++) {
		if (lines[i] === "!!Xignore") {
			lines[i] = "!!ignore";
			changed = 1;
			startpos = i;
		} else if (lines[i] === "!!ignore") {
			lines[i] = "XXX DELETE XXX";
		}
	}
	if (!changed) {
		return;
	}

	// mark count measures later with !!ignore
	for (i=startpos - 2; i>0; i--) {
		if (lines[i].match(/^=/)) {
			counter++;
			if (counter == count - 1) {
				lines[i] = "!!Xignore\n" + lines[i];
				if (i > lines.row) {
					adjust++;
				}
				change = 1;
				break;
			}
		}
	}
	if (lines[0] !== "!!ignore") {
		lines[0] = "!!ignore\n" + lines[0];
		adjust++;
	}
	let output = "";
	for (i=0; i<lines.length; i++) {
		if (lines[i] === "XXX DELETE XXX") {
			continue;
		}
		output += lines[i] + "\n";
	}
	EDITOR.setValue(output, -1);
	position.row += adjust;
	EDITOR.moveCursorToPosition(position);
};



//////////////////////////////
//
// MenuInterface::startSplitSystem --
//

MenuInterface.prototype.startSplitSystem = function (count) {
	if (!count) {
		count = 8;
	}
	count--;  // adjustment for first system not being labeled.
	MenuInterface.prototype.removeSplits();
	let lines = EDITOR.getValue().match(/[^\r\n]+/g);
	let position = EDITOR.getCursorPosition();
	let counter = 0;
	let adjust = 0;
	let change = 0;
	let i;
	for (i=0; i<lines.length; i++) {
		if (lines[i].match(/^!!LO:LB/)) {
			counter++;
			if (counter == count) {
				lines[i] = "!!ignore\n" + lines[i];
				if (i > lines.row) {
					adjust++;
				}
				change = 1;
				break;
			}
		}
	}
	if (!change) {
		return;
	}
	let output = "";
	for (i=0; i<lines.length; i++) {
		output += lines[i] + "\n";
	}
	EDITOR.setValue(output, -1);
	position.row += adjust;
	EDITOR.moveCursorToPosition(position);
};



//////////////////////////////
//
// MenuInterface::nextSplitSystem --
//

MenuInterface.prototype.nextSplitSystem = function (count) {
	if (!count) {
		count = 8;
	}
	let lines = EDITOR.getValue().match(/[^\r\n]+/g);
	let position = EDITOR.getCursorPosition();
	if (lines.length == 0) {
		return;
	}
	let i;
	let adjust = 0;
	let changed = 0;
	let startpos = -1;
	let counter = 0;
	for (i=1; i<lines.length; i++) {
		if (lines[i] === "!!Xignore") {
			lines[i] = "XXX DELETE XXX";
			changed = 1;
			continue;
		} else if (lines[i] === "!!ignore") {
			lines[i] = "!!Xignore";
			changed = 1;
			startpos = i;
			break;
		}
	}
	if (!changed) {
		return;
	}
	// mark count measures later with !!ignore
	for (i=startpos + 1; i<lines.length; i++) {
		if (lines[i].match(/^!!LO:LB/)) {
			counter++;
			if (counter == count) {
				lines[i] = "!!ignore\n" + lines[i];
				if (i > lines.row) {
					adjust++;
				}
				change = 1;
				break;
			}
		}
	}
	if (lines[0] !== "!!ignore") {
		lines[0] = "!!ignore\n" + lines[0];
		adjust++;
	}
	let output = "";
	for (i=0; i<lines.length; i++) {
		if (lines[i] === "XXX DELETE XXX") {
			continue;
		}
		output += lines[i] + "\n";
	}
	EDITOR.setValue(output, -1);
	position.row += adjust;
	EDITOR.moveCursorToPosition(position);
};



//////////////////////////////
//
// MenuInterface::previousSplitSystem --
//

MenuInterface.prototype.previousSplitSystem = function (count) {
	if (!count) {
		count = 8;
	}
	let lines = EDITOR.getValue().match(/[^\r\n]+/g);
	let position = EDITOR.getCursorPosition();
	if (lines.length == 0) {
		return;
	}
	let i;
	let adjust = 0;
	let changed = 0;
	let startpos = -1;
	let counter = 0;
	for (i=1; i<lines.length; i++) {
		if (lines[i] === "!!Xignore") {
			lines[i] = "!!ignore";
			changed = 1;
			startpos = i;
		} else if (lines[i] === "!!ignore") {
			lines[i] = "XXX DELETE XXX";
		}
	}
	if (!changed) {
		return;
	}

	// mark count measures later with !!ignore
	for (i=startpos - 2; i>0; i--) {
		if (lines[i].match(/^!!LO:LB/)) {
			counter++;
			if (counter == count - 1) {
				lines[i] = "!!Xignore\n" + lines[i];
				if (i > lines.row) {
					adjust++;
				}
				change = 1;
				break;
			}
		}
	}
	if (lines[0] !== "!!ignore") {
		lines[0] = "!!ignore\n" + lines[0];
		adjust++;
	}
	let output = "";
	for (i=0; i<lines.length; i++) {
		if (lines[i] === "XXX DELETE XXX") {
			continue;
		}
		output += lines[i] + "\n";
	}
	EDITOR.setValue(output, -1);
	position.row += adjust;
	EDITOR.moveCursorToPosition(position);
};


//////////////////////////////
//
// MenuInterface::removeSplits --
//

MenuInterface.prototype.removeSplits = function () {
	let lines = EDITOR.getValue().match(/[^\r\n]+/g);
	let output = "";
	let position = EDITOR.getCursorPosition();
	let row = position.row;
	let col = position.column;
	let change = 0;
	for (let i=0; i<lines.length; i++) {
		if (lines[i] === "!!ignore") {
			if (i < row) {
				row--;
			}
			change++;
			continue;
		}
		if (lines[i] === "!!Xignore") {
			if (i < row) {
				row--;
			}
			change++;
			continue;
		}
		output += lines[i] + "\n";
	}
	if (change) {
		EDITOR.setValue(output, -1);
		position.row = row;
		EDITOR.moveCursorToPosition(position);
	}
};



//////////////////////////////
//
// MenuInterface::undo --
//

MenuInterface.prototype.undo = function () {
	EDITOR.undo();
};



//////////////////////////////
//
// MenuInterface::chooseToolbarMenu --
//

MenuInterface.prototype.chooseToolbarMenu = function () {
	chooseToolbarMenu();
};



//////////////////////////////
//
// MenuInterface::displayMainToolbar --
//

MenuInterface.prototype.displayMainToolbar = function () {
	chooseToolbarMenu(1);
};



//////////////////////////////
//
// MenuInterface::displayLoadToolbar --
//

MenuInterface.prototype.displayLoadToolbar = function () {
	chooseToolbarMenu("load");
};



//////////////////////////////
//
// MenuInterface::displaySearchToolbar --
//

MenuInterface.prototype.displaySearchToolbar = function () {
	chooseToolbarMenu("search");
};



//////////////////////////////
//
// MenuInterface::displayFilterToolbar --
//

MenuInterface.prototype.displayFilterToolbar = function () {
	chooseToolbarMenu("filter");
};



//////////////////////////////
//
// MenuInterface::displaySpreadsheetToolbar --
//

MenuInterface.prototype.displaySpreadsheetToolbar = function () {
	chooseToolbarMenu("spreadsheet");
};



//////////////////////////////
//
// MenuInterface::displaySaveToolbar --
//

MenuInterface.prototype.displaySaveToolbar = function () {
	chooseToolbarMenu("save");
};



//////////////////////////////
//
// MenuInterface::choosePreviousToolbarMenu --
//

MenuInterface.prototype.choosePreviousToolbarMenu = function () {
	gotoPrevToolbarDelta();
};



//////////////////////////////
//
// MenuInterface::convertToHumdrum --
//

MenuInterface.prototype.convertToHumdrum = function () {
	replaceEditorContentWithHumdrumFile();
};




//////////////////////////////
//
// MenuInterface::trimTabsInEditor --
//

MenuInterface.prototype.trimTabsInEditor = function () {
	trimTabsInEditor();
};



//////////////////////////////
//
// MenuInterface::mimeEncode --
//

MenuInterface.prototype.mimeEncode = function () {
	let text = getTextFromEditorNoCsvProcessing();
	// let lines = btoa(text).match(/.{1,80}/g);
	let lines = Base64.encode(text).match(/.{1,80}/g);
	let output = "";
	for (let i=0; i<lines.length; i++) {
		output += lines[i] + "\n";
	}
	EDITOR.setValue(output, -1);
};



//////////////////////////////
//
// MenuInterface::copyMimeUrl -- Copy the editor contents into a
//   MIME encoded string as an input parameter to display
//   from a URL in VHV.
//

MenuInterface.prototype.copyMimeUrl = function () {
	let text = getTextFromEditorNoCsvProcessing();
	let lastchar = text.charAt(text.length - 1);
	if (lastchar != "\n") {
		text += "\n";
	}
	let mime = Base64.encode(text);
	// Alternately	mime = btoa(escape(encodeURIComponent(text)));
	// but that is much longer.

	let url = `https://verovio.humdrum.org?t=${mime}`;
	let felement = document.querySelector("#filter");
	let ftext = "";
	if (felement) {
		ftext = felement.value;
		if (!ftext.match(/^\s*$/)) {
			ftext = encodeURIComponent(ftext);
		}
	}
	let applyfilter = document.querySelector("#apply-filter");
	if (applyfilter) {
		if (!applyfilter.classList.contains("active")) {
			ftext = "";
		}
	}
	if (ftext.length > 0) {
		url += "&filter=" + ftext;
	}

	let length = url.length;
	if (length > 2083) {
		alert(`Warning: URL length of ${length} is too long for some browsers.`);
	}
	copyToClipboard(url);
}


//////////////////////////////
//
// MenuInterface::mimeDecode --
//

MenuInterface.prototype.mimeDecode = function () {
	let text = getTextFromEditorNoCsvProcessing();
	// text is already decoded by getTextFromEditor().
	EDITOR.setValue(text, -1);
};



//////////////////////////////
//
// MenuInterface::toggleCsvTsv --
//

MenuInterface.prototype.toggleCsvTsv = function () {
	toggleHumdrumCsvTsv();
};



//////////////////////////////
//
// MenuInterface::convertToMusicXmlAndSave --
//

MenuInterface.prototype.convertToMusicXmlAndSave = function () {
	convertToMusicXmlAndSave();
}



//////////////////////////////
//
// MenuInterface::selectLandscapePdfOrientation --
//

MenuInterface.prototype.selectLandscapePdfOrientation = function () {
	PDFOPTIONS.orientation = "landscape";
	localStorage.PDFOPTIONS_orientation = "landscape";
	this.highlightSelectedPdfOrientation();
};



//////////////////////////////
//
// MenuInterface::selectPortraitPdfOrientation --
//

MenuInterface.prototype.selectPortraitPdfOrientation = function () {
	PDFOPTIONS.orientation = "portrait";
	localStorage.PDFOPTIONS_orientation = "portrait";
	this.highlightSelectedPdfOrientation();
};



//////////////////////////////
//
// MenuInterface::highlightSelectedPdfOrientation --
//

MenuInterface.prototype.highlightSelectedPdfOrientation = function () {
	let landscapeElement = document.querySelector("#menu_option-orientation-landscape");
	let portraitElement = document.querySelector("#menu_option-orientation-portrait");
	if (PDFOPTIONS.orientation === "landscape") {
		landscapeElement.classList.add("menu-highlight");
		portraitElement.classList.remove("menu-highlight");
	} else {
		landscapeElement.classList.remove("menu-highlight");
		portraitElement.classList.add("menu-highlight");
	}
};



//////////////////////////////
//
// MenuInterface::setA4SizedPdf --
//

MenuInterface.prototype.setA4SizedPdf = function () {
	PDFOPTIONS.format = "A4";
	localStorage.PDFOPTIONS_format = "A4";
	this.highlightSelectedPdfFormat();
};



//////////////////////////////
//
// MenuInterface::setLetterSizedPdf --
//

MenuInterface.prototype.setLetterSizedPdf = function () {
	PDFOPTIONS.format = "letter";
	localStorage.PDFOPTIONS_format = "letter";
	this.highlightSelectedPdfFormat();
};



//////////////////////////////
//
// MenuInterface::highlightSelectedPdfFormat --
//

MenuInterface.prototype.highlightSelectedPdfFormat = function () {
	let a4Element = document.querySelector("#menu_option-format-a4");
	let letterElement = document.querySelector("#menu_option-format-letter");
	if (PDFOPTIONS.format === "A4") {
		a4Element.classList.add("menu-highlight");
		letterElement.classList.remove("menu-highlight");
	} else {
		a4Element.classList.remove("menu-highlight");
		letterElement.classList.add("menu-highlight");
	}
};



//////////////////////////////
//
// MenuInterface::highlightOptions --
//

MenuInterface.prototype.highlightOptions = function () {
	this.highlightSelectedPdfFormat();
	this.highlightSelectedPdfOrientation();
};



//////////////////////////////
//
// MenuInterface::toggleCompactScore --
//

MenuInterface.prototype.toggleCompactScore = function () {
	EVENNOTESPACING = !EVENNOTESPACING;
	displayNotation();
};


