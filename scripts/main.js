//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Thu Aug 25 13:16:42 CEST 2016
// Filename:       main.js
// Web Address:    https://verovio.humdrum.org/scripts/main.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3
//
// Description:   Event listeners and related code for index.html.
//

var CGI = {};
var OPTIONS = {}; // used for debugging display options.

// var turl = "https://raw.githubusercontent.com/craigsapp/mozart-piano-sonatas/master/index.hmd";
// var hmdindex = new HMDIndex(turl);

// verovio variables for a movement:
var vrvWorker;

// verovio-related options:
// Primarily set in menu system and used in humdrumToSvgOptions().
var SCALE = 40;
var SPACING_STAFF = 8;
var SPACING_SYSTEM = 3;
var LYRIC_SIZE = 4.5;
var FONT = "Leipzig";
var BREAKS = false;   // false = "auto", true = "encoded"
var PAGED = false;

// menu interaction variables:
var INPUT_FONT_SIZE = 1.0;   // used to set font-size in #input (1.0rem is the default);

var FILEINFO = {};
var EDITOR;
var dummyEDITOR;

var EditorModes = {
	humdrum: {
		vim: {
			theme: "ace/theme/humdrum_dark"
		},
		ace: {
			theme: "ace/theme/humdrum_light"
		}
	},
	xml: {
		vim: {
			theme: "ace/theme/solarized_dark"
		},
		ace: {
			theme: "ace/theme/solarized_light"
		}
	},
	musedata: {
		vim: {
			theme: "ace/theme/solarized_dark"
		},
		ace: {
			theme: "ace/theme/solarized_light"
		}
	}
};

var EditorMode = "humdrum";
var KeyboardMode = "ace";
//var EditorTheme = "ace/theme/solarized_light";
var EditorLine = -1;
var TABSIZE = 12;
var DISPLAYTIME = 0;
var HIGHLIGHTQUERY = null;
var EDITINGID = null;
var SAVEFILENAME = "data.txt";
var SPACINGADJUSTMENT = 0.0;

// no timeout for slow delivery of verovio
window.basketSession.timeout = 1000000000;


// used to highlight the current note at the location of the cursor.
var CursorNote;

// RestoreCursorNote: Used to go back to a highlighted note after a redraw.
// This is an ID string rather than an element.
var RestoreCursorNote;

// Increment BasketVersion when the verovio toolkit is updated, or
// the Midi player software or soundfont is updated.
var BasketVersion = 531;
// Basket is no longer working since verovio.js is now over 5MB (maximum for localStorage)
// console.log("VERSION", BasketVersion);

var Actiontime = 0;

// see https://github.com/ajaxorg/ace/wiki/Embedding-API
// Use EditSession instead of BufferedHumdrumFile:
var BufferedHumdrumFile = "";
var Range = function() { console.log("Range is undefined"); }

var ids   = [];
var ZOOM  = 0.4;
var PLAY  = false;
var PAUSE = false;

// State variables for interface:
var FirstInitialization = false;
var InputVisible        = true;
var LastInputWidth      = 0;
var VrvTitle            = true;
var OriginalClef        = false;
var UndoHide            = false;
var ApplyZoom           = false;
var ShowingIndex        = false;
var FreezeRendering     = false;

var AKey      = 65;
var BKey      = 66;
var CKey      = 67;
var DKey      = 68;
var EKey      = 69;
var FKey      = 70;
var GKey      = 71;
var HKey      = 72;
var IKey      = 73;
var JKey      = 74;
var KKey      = 75;
var LKey      = 76;
var MKey      = 77;
var NKey      = 78;
var OKey      = 79;
var PKey      = 80;
var QKey      = 81;
var RKey      = 82;
var SKey      = 83;
var TKey      = 84;
var UKey      = 85;
var VKey      = 86;
var WKey      = 87;
var XKey      = 88;
var YKey      = 89;
var ZKey      = 90;
var ZeroKey   = 48;
var OneKey    = 49;
var TwoKey    = 50;
var ThreeKey  = 51;
var FourKey   = 52;
var FiveKey   = 53;
var SixKey    = 54;
var SevenKey  = 55;
var EightKey  = 56;
var NineKey   = 57;
var PgUpKey   = 33;
var PgDnKey   = 34;
var EndKey    = 35;
var HomeKey   = 36;
var LeftKey   = 37;
var UpKey     = 38;
var RightKey  = 39;
var DownKey   = 40;
var EnterKey  = 13;
var SpaceKey  = 32;
var SlashKey  = 191;
var EscKey    = 27;
var BackKey   = 8;
var CommaKey  = 188;
var MinusKey  = 189;
var DotKey    = 190;
var SemiColonKey = 186;
var BackQuoteKey   = 192;
var SingleQuoteKey = 222;


///////////////////////////////////////////////////////////////////////////
//
// Split window interface:
//

function SPLITTER() {
	this.mouseState    = 0;
	this.positionX     = null;
	this.leftContent   = null;
	this.splitContent  = null;
	this.splitWidth    = 5;
	this.minXPos       = 100;
	this.maxXPos       = 2000;
	this.rightPadding  = 10;
	this.defaultPos    = 400;
	this.snapTolerance = 30;
	return this;
}


SPLITTER.prototype.setPositionX = function(xPosition) {
	if ((xPosition < this.defaultPos + this.snapTolerance) &&
			(xPosition > this.defaultPos - this.snapTolerance)){
		xPosition = this.defaultPos;
	}

	if (xPosition < 0) {
		xPosition = 0;
	}
	if (xPosition > this.maxXPos) {
		xPosition = this.maxXPos;
	}
	this.positionX = xPosition;

	if (!this.leftContent) {
		this.leftContent = document.querySelector('#input');
	}
	if (!this.splitContent) {
		this.splitContent = document.querySelector('#splitter');
	}
	if (!this.rightContent) {
		this.rightContent = document.querySelector('#output');
	}

	if (this.leftContent) {
		this.leftContent.style.left = 0;
		this.leftContent.style.width = xPosition + 'px';
	}
	if (this.splitContent) {
		this.splitContent.style.left = xPosition + 'px';
	}
	if (this.rightContent) {
		this.rightContent.style.left = (xPosition
			+ this.splitWidth + this.rightPadding)
			+ 'px';
	}

};

var Splitter = new SPLITTER();



//////////////////////////////
//
// displayNotation -- Convert Humdrum data in textarea to notation.
//  This function seems to be called twice in certain cases (editing).
//

function displayNotation(page, force, restoreid) {
	if (!vrvWorker.initialized || (FreezeRendering && !force)) {
		return;
	};

	// if input area is a <textarea>, then use .value to access contnets:
	// var inputarea = document.querySelector("#input");
	// var data = inputarea.value;

	var data = EDITOR.getValue().replace(/^\s+/, "");
	if (data.match(/^\s*$/)) {
		return;
	};
	var options = humdrumToSvgOptions();
	if (data.match(/CUT[[]/)) {
		options.from = "esac";
	};
	if (data.match(/Group memberships:/)) {
		options.from = "musedata";
	};
	OPTIONS = options;
	vrvWorker.renderData(options, data, page, force)
	.then(function(svg) {
		var ishumdrum = true;
		if (data.charAt(0) == "<") {
			ishumdrum = false;
		} else if (data.match(/CUT[[]/)) {
			ishumdrum = false;
		} else if (data.match(/Group memberships:/)) {
			ishumdrum = false;
		}

		var output = document.querySelector("#output");
		output.innerHTML = svg;
		if (ishumdrum) {
			if (restoreid) {
				restoreSelectedSvgElement(restoreid);
			} else if (RestoreCursorNote) {
				restoreSelectedSvgElement(RestoreCursorNote);
			}
			displayFileTitle(data);
			if (!force) document.querySelector('body').classList.remove("invalid");
		}
		return true;
	})
	.catch(function(message) {
		document.querySelector('body').classList.add("invalid");
		console.log(">>>>>>>>>> ERROR LOG:", message);
		return false;
	})
	.finally(function() {
		var indexelement = document.querySelector("#index");
		indexelement.style.visibility = "invisibile";
		indexelement.style.display = "none";
		if (UndoHide) {
			showInputArea(true);
			UndoHide = false;
		}
		if (ApplyZoom) {
			applyZoom();
			ApplyZoom = false;
		}
		if (CGI.k && !CGI.kInitialized) {
			processOptions();
		}
		if (ApplyZoom) {
			applyZoom();
			ApplyZoom = false;
		}
		ShowingIndex = false;
		$('html').css('cursor', 'auto');
		// these lines are needed to re-highlight the note when
		// the notation has been updated.
		//setCursorNote (null, "displayNotation");
		//highlightNoteInScore();
	});

}



//////////////////////////////
//
// processOptions -- Can only handle alphabetic key commands.
//   Also only lower case, but that is easier to fix when there
//   is an uppercase command.
//

function processOptions() {
	CGI.kInitialized = true;
	if (!CGI.k) {
		return;
	}
/* is this function needed anymore?  Now seems to be done
 * in DOMContentLoaded event listener, but maybe it is
 * needed whne a new score is loaded.
	var list = CGI.k.split('');
	for (var i=0; i<list.length; i++) {
		var event = {};
		event.target = {};
		event.target.nodeName = "moxie";
		event.keyCode = list[i].charCodeAt(0) - 32;
		switch(event.keyCode) {
			case HKey:
				break;
			case OKey:
			case VKey:
				if (!FirstInitialization) {
					processKeyCommand(event);
				}
				break;
			default:
				processKeyCommand(event);
		}
	}
	FirstInitialization = true;
*/
}



//////////////////////////////
//
// humdrumToSvgOptions --
//
// Verovio options:
// # = number
// B = boolean (1, or 0)
// S = string
//
// border #           == border around SVG image (default 50)
// from S             == input data from (darms, mei, pae, xml)
// pageHeight #       == height of page (default 2970)
// pageWidth #        == width of page (default 2100)
// scale #            == scaling percent for image
// adjustPageHeight B == crop the page height to content
// evenNoteSpacing B  == space notes evenly and close regardless of durations
// font S             == Bravura, Gootville, (default Leipzig)
// ignoreLayout       == ignore any encoded layout and recalulate
// noLayout B         == ignore any encoded layout and display single system
// page #             == select page to engrave
// appXPathQuery S    == xpath query for selecting app
// spacingLinear #    == linear spacing factor (default 0.25)
// spacingNonLinear # == non-linear spacing factor (default 0.6)
// spacingStaff #     == spacing above each staff (MEI vu)
// spacigSystem #     == spacing above each system (MEI vu)
// humType            == embedd extra type/class attributes
//

function humdrumToSvgOptions() {
	var output = {
		adjustPageHeight     : 1,
		barLineWidth         : 0.12,
		breaks               : (BREAKS ? "encoded" : "auto"),
		font                 : FONT,
		from                 : "auto",
		humType              : 1,
		leftMarginClef       : 1.50,
		lyricSize            : LYRIC_SIZE,
		minLastJustification : 0.5,
		footer               : "none",
		header               : "none",
		pageHeight           : 60000,
		pageMarginBottom     : 20,
		pageMarginLeft       : 20,
		pageMarginRight      : 20,
		pageMarginTop        : 20,
		pageWidth            : 2500,
		scale                : SCALE,
		spacingLinear        : 0.25,
		spacingNonLinear     : 0.6,
		spacingStaff         : SPACING_STAFF,
		spacingSystem        : SPACING_SYSTEM,
		staffLineWidth       : 0.12
	}
	if (OriginalClef) {
		output.appXPathQuery = "./rdg[contains(@label, 'original-clef')]";
	} else {
		// the xpath query may need to be cleared
		// out of the persistent object:
		output.appXPathQuery = "./rdg[contains(@label, 'asiuahetlkj')]";
	}
	if (PAGED && !BREAKS) {
		var tw = $("#input").outerWidth();
		if ($("#input").css("display") == "none") {
			tw = 0;
		}
		// output.pageHeight = ($(window).innerHeight() - $("#navbar").outerHeight()) / ZOOM - 100;
		// output.pageWidth = ($(window).innerWidth() - tw) / ZOOM - 100;
		// jQuery $window.innerHeight() not working properly (in Chrome).
		output.pageHeight = (window.innerHeight - $("#topnav").outerHeight()) / (ZOOM * SCALE / 40) - 50;
		output.pageWidth = (window.innerWidth - tw) / (ZOOM * SCALE / 40 ) - 100;
	} else {
		var tw = $("#input").outerWidth();
		if ($("#input").css("display") == "none") {
			tw = 0;
		}
		output.pageWidth = (window.innerWidth - tw) / (ZOOM * SCALE / 40 ) - 100;
	}
	if (CGI.tasso) {
		output.spacingNonLinear = 0.65;
	}

	var newLinearSpacing = SPACINGADJUSTMENT + output.spacingLinear;
	if (newLinearSpacing < 0.05) {
		newLinearSpacing = 0.05;
	}
	output.spacingLinear = newLinearSpacing;

	return output;
}

function humdrumToMeiOptions() {
	return {

		from              : "humdrum",
		adjustPageHeight  : 1,
		pageHeight        : 8000,
		pageMarginLeft    : 20,
		pageMarginRight   : 20,
		pageMarginTop     : 50,
		pageMarginBottom  : 50,
		pageWidth         : 2500,
		scale             : 40,
		footer            : "none",
		header            : "none",
		breaks            : "auto",
		spacingNonLinear	: 0.6,
		spacingLinear		: 0.25,
		barLineWidth		: 0.12,
		staffLineWidth		: 0.12,
		font              : "Leipzig"

	}
}

function humdrumToHumdrumOptions() {
	return {
		from              : "humdrum"
	}
}

function musicxmlToHumdrumOptions() {
	return {
		from              : "musicxml-hum"
	}
}

function musedataToHumdrumOptions() {
	return {
		from              : "musedata-hum"
	}
}

function musicxmlToMeiOptions() {
	return {
		from              : "musicxml",
		allPages          : 1,
		breaks            : "auto"
	}
}

function meiToMeiOptions() {
	return {
		from              : "mei",
		allPages          : 1,
		breaks            : "encoded"
	}
}

function meiToHumdrumOptions() {
	return {
		from              : "mei-hum",
		allPages          : 1,
		breaks            : "auto"
	}
}

function esacToHumdrumOptions() {
	return {
		from              : "esac"
	}
}



//////////////////////////////
//
// allowTabs -- Allow tab characters in textarea content.
//

function allowTabs() {
// This function is not needed to activate tabs with the ace editor.
return;
/*
	var textareas = document.getElementsByTagName('textarea');
	var count = textareas.length;
	for (var i=0; i<count; i++) {
		textareas[i].onkeydown = function(e) {
			if (e.keyCode==9 || e.which==9) {
				e.preventDefault();
				var s = this.selectionStart;
				this.value = this.value.substring(0,this.selectionStart)
					+ "\t" + this.value.substring(this.selectionEnd);
				this.selectionEnd = s+1;
			}
		}
	}
*/
}



//////////////////////////////
//
// toggleFreeze --
//

function toggleFreeze() {
	FreezeRendering = !FreezeRendering;
	document.querySelector('body').classList.toggle("frozen");
	if (!FreezeRendering) {
		displayNotation();
	}
}



//////////////////////////////
//
// toggleInputArea --
//

function toggleInputArea(suppressZoom) {
	InputVisible = !InputVisible;
	var input = document.querySelector("#input");
	if (InputVisible) {
		if (LastInputWidth == 0) {
			LastInputWidth = 400;
		}
		Splitter.setPositionX(LastInputWidth);
	} else {
		LastInputWidth = parseInt(input.style.width);
		Splitter.setPositionX(0);
	}
	if (!suppressZoom) {
		applyZoom();
	}
	EDITOR.resize();
}



//////////////////////////////
//
// redrawInputArea --
//

function redrawInputArea(suppressZoom) {
	var input = document.querySelector("#input");
	if (InputVisible) {
		if (LastInputWidth == 0) {
			LastInputWidth = 400;
		}
		Splitter.setPositionX(LastInputWidth);
	} else {
		LastInputWidth = parseInt(input.style.width);
		Splitter.setPositionX(0);
	}
	if (!suppressZoom) {
		applyZoom();
	}
	EDITOR.resize();
}



//////////////////////////////
//
// hideInputArea --
//

function hideInputArea(suppressZoom) {
	InputVisible = false;
	var input = document.querySelector("#input");
	LastInputWidth = parseInt(input.style.width);
	Splitter.setPositionX(0);
	if (!suppressZoom) {
		applyZoom();
	}
}



//////////////////////////////
//
// showInputArea --
//

function showInputArea(suppressZoom) {
	InputVisible = true;
	Splitter.setPositionX(LastInputWidth);
	if (!suppressZoom) {
		applyZoom();
	};
	EDITOR.resize();
}



//////////////////////////////
//
// toggleVhvTitle --
//

function toggleVhvTitle() {
	VrvTitle = !VrvTitle;
	var area = document.querySelector("#vhv");
	if (VrvTitle) {
		area.style.visibility = "visible";
		area.style.display = "inline";
	} else {
		area.style.visibility = "hidden";
		area.style.display = "none";
	}
}




//////////////////////////////
//
// getReferenceRecords --
//

function getReferenceRecords(contents) {
	var lines = contents.split(/\r?\n/);
	var output = {};

	var matches;
	for (i=lines.length-1; i>=0; i--) {
		if (matches = lines[i].match(/^\!\!\!([^\s]+):\s*(.*)\s*$/)) {
			var key   = matches[1];
			var value = matches[2];
			output[key] = value;
			if (matches = key.match(/(.*)@@(.*)/)) {
				output[matches[1]] = value;
			}
			if (matches = key.match(/(.*)@(.*)/)) {
				output[matches[1]] = value;
			}
		}
		if (matches = lines[i].match(/^\!?\!\!title:\s*(.*)\s*/)) {
			output["title"] = matches[1];
		}
	}

	if ((!output["title"]) || output["title"].match(/^\s*$/)) {
		output["title"] = FILEINFO["title-expansion"];
	}

	var counter = 0;
	var prefix = "";
	var postfix = "";
	var substitute;
	if (output["title"] && !output["title"].match(/^\s*$/)) {
		var pattern = output["title"];
		while (matches = pattern.match(/@\{([^\}]*)\}/)) {
			prefix = "";
			postfix = "";
			key = "";
			if (matches = pattern.match(/@\{([^\}]*)\}\{([^\}]*)\}\{([^\}]*)\}/)) {
				prefix = matches[1];
				key = matches[2];
				postfix = matches[3];
				pattern = pattern.replace(/@\{([^\}]*)\}\{([^\}]*)\}\{([^\}]*)\}/, "ZZZZZ");
			} else if (matches = pattern.match(/@\{([^\}]*)\}\{([^\}]*)\}/)) {
				prefix = matches[1];
				key = matches[2];
				postfix = "";
				pattern = pattern.replace(/@\{([^\}]*)\}\{([^\}]*)\}/, "ZZZZZ");
			} else if (matches = pattern.match(/@\{([^\}]*)\}/)) {
				prefix = "";
				key = matches[1];
				postfix = "";
				pattern = pattern.replace(/@\{([^\}]*)\}/, "ZZZZZ");
			}

			if (!key) {
				break;
			}
			if (key.match(/^\s*$/)) {
				break;
			}
			if (output[key]) {
				substitute = prefix + output[key] + postfix;
			} else {
				substitute = "";
			}
			pattern = pattern.replace(/ZZZZZ/, substitute);
			counter++;
			if (counter > 20) {
				// avoid infinite loop in case something goes wrong
				break;
			}
		}
		output["title"] = pattern;
	}

	return output;
}


//////////////////////////////
//
// displayWorkNavigation --
//

function displayWorkNavigation(selector) {
	if (!selector) {
		selector = "#work-navigator";
	}
	contents = "";
	element = document.querySelector(selector);
	if (!element) {
		console.log("Error: cannot find work navigator");
		return;
	}

	if (FILEINFO["previous-work"]) {
		contents += "<span style=\"cursor:pointer\" onclick=\"displayWork('"
		contents += FILEINFO["previous-work"];
		contents += "');\"";
		contents += " title='previous work/movement (&#8679;+&#8592;)'";
		contents += ">";
		contents += "<span class='fas fa-arrow-circle-left'></span>";
		contents += "</span>";
	}

	if (FILEINFO["previous-work"] &&
		FILEINFO["next-work"] &&
		(FILEINFO["has-index"] == "true")) {
		contents += "&nbsp;";
	}

	if (FILEINFO["has-index"] == "true") {
		contents += "<span style=\"cursor:pointer\" onclick=\"displayIndex('"
		contents += FILEINFO["location"];
		contents += "');\"";
		contents += " title='repertory index (&#8679;+&#8593;)'";
		contents += ">";
		contents += "<span class='fas fa-arrow-circle-up'></span>";
		contents += "</span>";
	}

	if (FILEINFO["previous-work"] &&
			FILEINFO["next-work"] &&
			(FILEINFO["has-index"] == "true")) {
		contents += "&nbsp;";
	}

	if (FILEINFO["previous-work"] &&
			FILEINFO["next-work"] &&
			(FILEINFO["has-index"] != "true")) {
		contents += "&nbsp;";
	}

	if (FILEINFO["next-work"]) {
		contents += "<span style=\"cursor:pointer\" onclick=\"displayWork('"
		contents += FILEINFO["next-work"];
		contents += "');\"";
		contents += " title='next work/movement (&#8679;+&#8594;)'";
		contents += ">";
		contents += "<span class='fas fa-arrow-circle-right'></span>";
		contents += "</span>";
	}

	if (FILEINFO["previous-work"] ||
		FILEINFO["next-work"]) {
		contents += "&nbsp;&nbsp;";
	}

	element.innerHTML = contents;

}




//////////////////////////////
//
// displayFileTitle --
//

function displayFileTitle(contents) {
	var references = getReferenceRecords(contents);

	var lines = contents.split(/\r?\n/);
	var title = "";
	var number = "";
	var composer = "";
	var sct = "";
	var matches;

	if (references["title"] && !references["title"].match(/^\s*$/)) {
		title = references["title"];
	} else if (references["OTL"] && !references["OTL"].match(/^\s*$/)) {
		title = references["OTL"];
	}

	if (references["COM"] && !references["COM"].match(/^\s*$/)) {
		if (matches = references["COM"].match(/^\s*([^,]+),/)) {
			composer = matches[1];
		} else {
			composer = references["COM"];
		}
	}

	title = title.replace(/-sharp/g, "&#9839;");
	title = title.replace(/-flat/g, "&#9837;");

	var tarea;
	tarea = document.querySelector("#title");
	if (tarea) {
		tarea.innerHTML = title;
	}

	tarea = document.querySelector("#composer");
	var pretitle = "";




	if (tarea && !composer.match(/^\s*$/)) {
		pretitle += composer + ", ";
	}
	tarea.innerHTML = pretitle;

	displayWorkNavigation("#work-navigator");

}



//////////////////////////////
//
// displayWork --
//

function displayWork(file) {
	if (!file) {
		return;
	}
	vrvWorker.page = 1;
	CGI.file = file;
	delete CGI.mm;
	delete CGI.kInitialized;
	$('html').css('cursor', 'wait');
	stop();
	loadKernScoresFile(
		{
			file: CGI.file,
			measures: CGI.mm,
			previous: true,
			next: true
		});
}



//////////////////////////////
//
// displayIndex --
//

function displayIndex(directory) {
	ShowingIndex = true;
	if (!directory) {
		return;
	}
	$('html').css('cursor', 'wait');
	loadIndexFile(directory);
}



//////////////////////////////
//
// GetCgiParameters -- Returns an associative array containing the
//     page's URL's CGI parameters
//

function GetCgiParameters() {
	var url = window.location.search.substring(1);
	var output = {};
	var settings = url.split('&');
	for (var i=0; i<settings.length; i++) {
		var pair = settings[i].split('=');
		pair[0] = decodeURIComponent(pair[0]);
		pair[1] = decodeURIComponent(pair[1]);
		if (typeof output[pair[0]] === 'undefined') {
			output[pair[0]] = pair[1];
		} else if (typeof output[pair[0]] === 'string') {
			var arr = [ output[pair[0]], pair[1] ];
			output[pair[0]] = arr;
		} else {
			output[pair[0]].push(pair[1]);
		}
	}
	if (!output.mm || output.mm.match(/^\s*$/)) {
		if (output.m) {
			output.mm = output.m;
		}
	}
	return output;
}



///////////////////////////////
//
// loadIndexFile --
//

function loadIndexFile(location) {
	var url = "https://kern.humdrum.org/data?l=" + location;
	url += "&format=index";

	console.log("Loading index", url);

	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			var INDEX = request.responseText;
			// console.log("INDEX= ", INDEX);
			$('html').css('cursor', 'auto');
			displayIndexFinally(INDEX, location);
		}
	});
	request.send();
}



//////////////////////////////
//
// displayIndexFinally --
//

function displayIndexFinally(index, location) {
	ShowingIndex = true;

	IndexSupressOfInput = true;
	if (InputVisible == true) {
		UndoHide = true;
		ApplyZoom = true;
		// hideInputArea(true);
	}

	var lines = index.split(/\r?\n/);
	var i;
	var newlines = [];
	var data;
	for (i=0; i<lines.length; i++) {
		if (lines[i].match(/^\s*$/)) {
			continue;
		}
		data = lines[i].split(/\t+/);
		if (data.length >= 3) {
			newline = data[1] + "\t" + data[0] + "\t" + data[2];
			newlines.push(newline);
		}
	}
	newlines.sort();
	var items = [];
	for (i=0; i<newlines.length; i++) {
		data = newlines[i].split(/\t+/);
		var entry = {};
		entry.filename = data[1];
		entry.text = data[2];
		entry.sorter = data[0];
		items.push(entry);
	}

	var indents = {};

	var final = "<table class='index-list'>";
	for (i=0; i<items.length; i++) {
		if (items[i].text.match(/^All /)) {
			continue;
		}
		items[i].text = items[i].text.replace(/\[?<a[^>]*wikipedia[^<]*.*?<\/a>\]?/gi, "");
		final += "<tr><td>"

		if (indents[items[i].sorter]) {
			final += "<span class='indenter'></span>";
		}

		if (items[i].filename.match(/^@/)) {
			items[i].text.replace(/<not>.*?<\/not>/g, "");
			final += items[i].text;
			var xtext = items[i].filename;
			xtext = xtext.replace(/^@/, "");
			var tindent = xtext.split(/:/);
			indents = {};
			for (var j=0; j<tindent.length; j++) {
				indents[tindent[j]] = "true";
			}
		} else if (!items[i].text.match(/hlstart/)) {
			final += "<span class='ilink' onclick=\"displayWork('";
			final += location;
			final += "/" + items[i].filename;
			final += "');\">";
			final += items[i].text;
			final += "</span>";
		} else {
			var spantext = "";
			spantext += "<span class='ilink' onclick=\"displayWork('";
			spantext += location;
			spantext += "/" + items[i].filename;
			spantext += "');\">";
			items[i].text = items[i].text.replace(/<hlstart>/, spantext);
			if (items[i].text.match(/<hlend>/)) {
				items[i].text = items[i].text.replace(/<hlend>/, "</span>");
			} else {
				items[i].text += "</span>";
			}
			final += items[i].text;
		}
		final += "</td></tr>"
	}
	final += "</table>";
	var indexelem = document.querySelector("#index");
	indexelem.innerHTML = final;
	indexelem.style.visibility = "visible";
	indexelem.style.display = "block";
}


var COUNTER = 0;

//////////////////////////////
//
// loadKernScoresFile --
//

function loadKernScoresFile(obj, force) {
	var file        = obj.file;
	var measures    = obj.measures;
	var page        = obj.page;
	var getnext     = obj.next;
	var getprevious = obj.previous;

	if (measures) {
		var getnext     = false;
		var getprevious = false;
	}

	COUNTER++;
	if (COUNTER > 10000) {
		console.log("RECURSION TOO LARGE", file);
		return;
	}

	var url = "";
	var key = "";
	var ret;

	if (file) {
		if (file.match(/^https?:/)) {
			url = file;
			key = file;
		} else if (file.match(/^bb:/)) {
			ret = getBitbucketUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.key;
			}
		} else if (file.match(/^bitbucket:/)) {
			ret = getBitbucketUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.key;
			}
		} else {
			ret = kernScoresUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.url;
			}
		}
	} else if (obj.tasso) {
		ret = getTassoUrl(obj.tasso, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	} else if (obj.bb) {
		ret = getBitbucketUrl(obj.bb, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	} else if (obj.bitbucket) {
		ret = getBitbucketUrl(obj.bitbucket, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	}

	if (!key) {
		key = "DATA";
		// return;
	}

	var requires = getRequires(url, key);

	var keys = commaDuplicate(key);

	if (force) {
		for (var i=0; i<keys.length; i++) {
			basketSession.remove(key[i]);
			console.log("removed ", key[i]);
		}
	}

	redrawInputArea();

	var expire = 142;

	var jinfo;

	var info = basketSession.get(keys[0]);
	// var info = null;
	// console.log("INFO", info)

	if (obj && obj.file && (obj.file.match(/musedata/))) {
		// console.log("Going to download", key);
		basketSession.require(...requires).then(function() {
			var infos = [];
			for (var j=0; j<keys.length; j++) {
				infos[j] = basketSession.get(keys[j]);
			}
			var data = "";
			var filenames = commaDuplicate(key);
			for (j=0; j<infos.length; j++) {
				// print file header
				data += "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n";
				//mm = key.match(/([^\/]+)\/([^\/]+)\s*$/);
				//if (mm) {
				//	// filename = mm[1] + "/" + base;
				//	filename = filenames[j];
				//} else {
				//	filename = "unknown";
				//}
				filename = infos[j].url;
				data += "@filename==" + filename + "\n";
				data += "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n";
				var oinfo = infos[j];
				data += oinfo.data;
				data += "/eof\n";
			}
			data += "//\n"; // end-of-transmission marker for MuseData stage2 multipart file.
			displayScoreTextInEditor(data, vrvWorker.page);

			if (infos.length > 1) {
				// console.log("GOING TO ADD MULTIPLE FILES TO EDITOR", infos);
			} else if (infos.length == 1) {
				info = basketSession.get(key);
				console.log("INFO = ", info);
				if (info) {
					try {
						jinfo = JSON.parse(info.data);
						if (force) {
							var textdata = atob(jinfo.content);
							if (textdata.match(/^\s*$/)) {
								textdata = "!!!ONB: No data content\n";
							}
							displayScoreTextInEditor(atob(jinfo.content), vrvWorker.page);
						}
						if (getnext) {
							processInfo(jinfo, obj, false, false);
						}
					} catch(err) {
						console.log("Error downloading", key, "Error:", err);
						displayScoreTextInEditor(info.data, vrvWorker.page);
						if (CGI.k.match(/c/)) {
							CGI.k = CGI.k.replace(/c/, "");
							showCompiledFilterData();
						}
					}
				} else {
					console.log("Error retrieving", key);
				}
				redrawInputArea();
			}
		}, function() {
			console.log("Error retrieving", key);
		});
	} else if (!info) {
		// console.log("Going to download", key);
		basketSession.require(
			{	url: url,
				key: key,
				expire: expire,
				execute: false
			}
		).then(function() {
				info = basketSession.get(key);
				if (info) {
					try {
						jinfo = JSON.parse(info.data);
						if (force) {
							var textdata = atob(jinfo.content);
							if (textdata.match(/^\s*$/)) {
								textdata = "!!!ONB: No data content\n";
							}
							displayScoreTextInEditor(atob(jinfo.content), vrvWorker.page);
						}
						if (getnext) {
							processInfo(jinfo, obj, false, false);
						}
					} catch(err) {
						console.log("Error downloading", key, "Error:", err);
						displayScoreTextInEditor(info.data, vrvWorker.page);
						if (CGI.k.match(/c/)) {
							CGI.k = CGI.k.replace(/c/, "");
							showCompiledFilterData();
						}
					}
				} else {
					console.log("Error retrieving", key);
				}
				redrawInputArea();
			}, function() {
				console.log("Error retrieving", key);
			});
	} else {
		try {
			jinfo = JSON.parse(info.data);
			if (getnext) {
				processInfo(jinfo, obj, false, false);
			}
		} catch(err) {
			displayScoreTextInEditor(info.data, vrvWorker.page);
			if (CGI.k && CGI.k.match(/c/)) {
				CGI.k = CGI.k.replace(/c/, "");
				showCompiledFilterData();
			}
			redrawInputArea();
		}
	}
}



//////////////////////////////
//
// getRequires -- Convert a comma-construct for URL into a list of files to download.
//

function getRequires(url, key) {
	var expire = 172;
	var listing;
	if (!key.match(/,/)) {
		listing = [{
			url: url,
			key: key,
			expire: expire,
			execute: false
		}];
		return listing;
	}

	// Input represents multiple files, such as
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03,04
	// should expand to two files:
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/04

	var urls = commaDuplicate(url);
	var keys = commaDuplicate(key);

	listing = [];
	for (var i=0; i<urls.length; i++) {
		listing.push({
			url: urls[i],
			key: keys[i],
			expire: expire,
			execute: false
		});
	}
	return listing;
}



//////////////////////////////
//
// commaDuplicate --
//

function commaDuplicate(value) {
	var pieces = value.split(/\s*,\s*/);
	var first = pieces[0];
	var matches = first.match(/^(.*\/)([^\/]+)/);
	if (!matches) {
		return value;
	}
	var base = matches[1];
	pieces[0] = matches[2];
	var output = [];
	for (var i=0; i<pieces.length; i++) {
		output.push(base + pieces[i]);
	}
	return output;;
}



//////////////////////////////
//
// getTassoUrl --
//

function getTassoUrl(file, measures) {
	var filename = file.replace(/\.krn$/, "");;

	var url = "https://josquin.stanford.edu/cgi-bin/tasso?&file=" + filename;
	url += "&a=humdrum";

	var key = filename;
	if (measures) {
		url += "&mm=" + measures;
		key += "&mm=" + measures;
	}

	return {url: url, key: key};
}



//////////////////////////////
//
// getBitbucketUrl --
//
// http://verovio.humdrum.org/?file=bitbucket:musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03
// https://bitbucket.org/musedata/beethoven/raw/master/bhl/qrtet/op18no5/stage2/01/03
//

function getBitbucketUrl(file, measures) {
	file = file.replace(/^(bb|bitbucket):/, "");

	var username = "";
	var repository = "";
	var pathandfile = "";
	var url = "";

	url = "https://bitbucket.org/";
	matches = file.match("^\/?([^\/]+)\/([^\/]+)\/(.*)");
	if (matches) {
		username    = matches[1];
		repository  = matches[2];
		pathandfile = matches[3];
	}
	url += username;
	url += "/";
	url += repository;
	url += "/raw/master/";
	url += pathandfile;

	var key = pathandfile;

	return {url: url, key: key};
}



//////////////////////////////
//
// kernScoresUrl -- convert kernscores location into URL.
//

function kernScoresUrl(file, measures) {
	var location;
	var filename;
	var user = "" ;
	var repository = "";
	var matches;
	var jrp = false;
	var github = false;

	if (matches = file.match(/^(j|jrp):\/?\/?(.*)/)) {
		jrp = true;
		file = matches[2];
	} else if (matches = file.match(/^(g|gh|github):\/?\/?([^\/]+)\/([^\/]+)\/(.+)/)) {
		github = true;
		user = matches[2];
		repository = matches[3];
		file = matches[4];
	}

	if (jrp) {
		filename = file;
		location = "";
	} else if (github) {
		filename = file;
	} else {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
	}

	if ((!filename) || !filename.match(/\.[a-z][a-z][a-z]$/)) {
		if (!jrp) {
			loadIndexFile(file);
			return;
		}
	}

	if (filename.match(/^\s*$/)) {
		if (!jrp) {
			loadIndexFile(file);
			return;
		}
	}

	var url;
	if (jrp) {
		url = "https://josquin.stanford.edu/cgi-bin/jrp?id=" + filename;
		url += "&a=humdrum";
	} else if (github) {
		url = "https://raw.githubusercontent.com/" + user + "/" + repository + "/master/" + filename;
	} else {
		url = "https://kern.humdrum.org/data?l=" + location + "&file=" + filename;
		url += "&format=info-json";
	}

	var key = "";
	if (!github) {
		key = location + "/" + filename;
		if (measures) {
			url += "&mm=" + measures;
			key += "&mm=" + measures;
		}
	}

	return {url: url, key: key};
}



//////////////////////////////
//
// processInfo --
//

function processInfo(info, obj, nextwork, prevwork) {
	var score;
	if (info) {
		FILEINFO = info;
		// score = atob(info.content);
		score = Base64.decode(info.content);
		// console.log("Score unpacked");
	} else {
		console.log("Impossible error for", infojson);
		return;
	}

	var matches;
	if (obj && obj.file && (matches = obj.file.match(/([^\/]+)$/))) {
		SAVEFILENAME = matches[1];
	}

	// var inputarea = document.querySelector("#input");
	// inputarea.value = score;
	displayScoreTextInEditor(score, vrvWorker.page);

	obj.next = false;
	obj.previous = false;

	if (!obj) {
		return;
	}

	if (info["next-work"]) {
		obj.file = info["next-work"];
		loadKernScoresFile(obj)
	}
	if (info["previous-work"]) {
		obj.file = info["previous-work"];
		loadKernScoresFile(obj)
	}
}



//////////////////////////////
//
// downloadKernScoresFile --
//

function downloadKernScoresFile(file, measures, page) {
	var location;
	var filename;
	var matches;
	var jrp = false;
	var bitbucket = false;
	var github = false;

	matches = file.match(/^jrp:(.*)/);
	if (matches) {
		jrp = true;
		file = matches[1];
	}
	else {
		matches = file.match(/^(bitbucket|bb):(.*)/);
		if (matches) {
			bitbucket = true;
			file = matches[1];
		} else {
			matches = file.match(/^(github|gh):(.*)/);
			if (matches) {
				bitbucket = true;
				file = matches[1];
			}
		}
	}


	var url;
	if (jrp) {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
		url = "https://josquin.stanford.edu/data?id=" + location;
		url += "&a=humdrum";
	} else {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
		url = "https://kern.humdrum.org/data?l=" + location + "&file=" + filename;
		if (measures) {
			url += "&mm=" + measures;
		}
	}

	if (filename) {
		SAVEFILENAME = filename;
		console.log("SAVEFILENAME - ", SAVEFILENAME);
	}

	if (bitbucket && url.match(/,/)) {
		downloadMultipleFiles(url);
		return;
	}

	console.log("DATA URL", url);
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			// console.log("DATA", request.responseText);
			//var inputarea = document.querySelector("#input");
			//console.log("Current file:", file);
			//inputarea.value = request.response;

			// https://ace.c9.io/#nav=api&api=editor
			replaceEditorContentWithHumdrumFile(request.response, page);
			if (CGI.k.match(/c/)) {
				CGI.k = CGI.k.replace(/c/, "");
				showCompiledFilterData();
			}
		}

	});
	request.send();
}



/////////////////////////////
//
// downloadMultipleFiles -- Currently assumes to be MuseData.
//

function downloadMultipleFiles(url) {
	console.log("DOWNLOADING MULTIPLE FILES", url);

}




//////////////////////////////
//
// replaceEditorContentWithHumdrumFile -- If the editor contents is
//    MusicXML, then convert to Humdrum and display in the editor.
//

function replaceEditorContentWithHumdrumFile(text, page) {
	vrvWorker.page = 1;
	page = page || vrvWorker.page;
	var options;
	var humdrumQ = false;

	var mode = getMode(text);

	if (text.slice(0, 1000).match(/<score-partwise/)) {
		// this is MusicXML data, so first convert into Humdrum
		// before displaying in the editor.
		if (mode == "xml") {
			options = musicxmlToHumdrumOptions();
			// Incorrect identification of xml editor mode when loading a
			// large Sibelius MusicXML file for some reason.
			// options = musicxmlToMeiOptions();
		} else {
			options = musicxmlToHumdrumOptions();
		}
	} else if (text.slice(0, 2000).match(/Group memberships:/)) {
		// this is MuseData data, so first convert into Humdrum
		// before displaying in the editor.
		if (mode == "xml") {
			options = musedataToHumdrumOptions();
		} else {
			options = musedataToHumdrumOptions();
		}
	} else if (text.slice(0, 1000).match(/<mei/)) {
		// this is MEI data, so first convert into Humdrum
		// before displaying in the editor.
		if (mode == "xml") {
			options = meiToMeiOptions();
		} else {
			options = meiToHumdrumOptions();
		}
	} else if (text.slice(0, 1000).match(/CUT[[]/)) {
		// this is EsAC data, so first convert into Humdrum
		// before displaying in the editor.
		options = esacToHumdrumOptions();
	} else {
		humdrumQ = true;
	}

	if (options && !humdrumQ) {
		if ((options.from == "musedata") || (options.from == "musedata-hum")) {
			vrvWorker.filterData(options, text, "humdrum")
			.then(showMei);
		} else if ((options.from == "musicxml") || (options.from == "musicxml-hum")) {
			vrvWorker.filterData(options, text, "humdrum")
			.then(showMei);
		} else {
			vrvWorker.filterData(options, text, "humdrum")
			.then(function(newtext) {
				var freezeBackup = FreezeRendering;
				if (FreezeRendering == false) {
					FreezeRendering = true;
				}
				if (CGI.filter) {
					if (mode == "musedata") {
						EDITOR.setValue("@@@filter: " + CGI.filter + "\n" + newtext, -1);
					} else {
						// fix following for XML formats (maybe embed filter in comment for MusicXML).
						EDITOR.setValue("!!!filter: " + CGI.filter + "\n" + newtext, -1);
					}
				} else {
					EDITOR.setValue(newtext, -1);
				}
				FreezeRendering = freezeBackup;
				displayNotation(page);
			});

		}
	} else {
		// -1 is to unselect the inserted text and move cursor to
		// start of inserted text.
		var freezeBackup = FreezeRendering;
		if (FreezeRendering == false) {
			FreezeRendering = true;
		}
		if (CGI.filter) {
			if (mode == "musedata") {
				EDITOR.setValue("@@@filter: " + CGI.filter + "\n" + text, -1);
			} else {
				// fix following for XML formats (maybe embed filter in comment for MusicXML).
				EDITOR.setValue("!!!filter: " + CGI.filter + "\n" + newtext, -1);
			}
		} else {
			EDITOR.setValue(text, -1);
		}
		FreezeRendering = freezeBackup;
		// display the notation for the data:
		displayNotation(page);
	}
}



///////////////////////////////
//
// applyZoom --
//

function applyZoom() {
	var measure = 0;

	var testing = document.querySelector("#output svg");
	if (!testing) {
		return;
	}

	if (vrvWorker.page !== 1) {
		measure = $("#output .measure").attr("id");
	}

	var options = humdrumToSvgOptions(),
	redo = (vrvWorker.HEIGHT != options.pageHeight) || (vrvWorker.WIDTH != options.pageWidth);

	if (redo) {
		stop();
		vrvWorker.HEIGHT = options.pageHeight;
		vrvWorker.WIDTH = options.pageWidth;
	};

	OPTIONS = options;

	vrvWorker.redoLayout(options, redo, measure)
	.then(function() {
		loadPage(vrvWorker.page);
	});
}



//////////////////////////////
//
// loadPage --
//

function loadPage(page) {
	page = page || vrvWorker.page;
	$("#overlay").hide().css("cursor", "auto");
	$("#jump_text").val(page);
	vrvWorker.renderPage(page)
	.then(function(svg) {
		$("#output").html(svg);
		// adjustPageHeight();
		resizeImage();
	});
}



//////////////////////////////
//
// resizeImage -- Make all SVG images match the width of the new
//     width of the window.
//

function resizeImage(image) {
return; /* not needed anymore */
/*
	var ww = window.innerWidth;
	var tw = $("#input").outerWidth();

	// var newheight = (window.innerHeight - $("#navbar").outerHeight()) / ZOOM - 100;
	// var newwidth = (ww - tw) / ZOOM - 100;
	var newheight = (window.innerHeight - $("#navbar").outerHeight());
	var newwidth = (ww - tw);

	var image = document.querySelector("#output svg");
	//console.log("OLD IMAGE HEIGHT", $(image).height());
	console.log("OLD IMAGE WIDTH", $(image).width());
	if (!image) {
		return;
	}
	console.log("ZOOM", ZOOM);

console.log("++++++++", "NEWHEIGHT=", newheight, "NEWWIDTH=", newwidth);
return;

	$(image).width(newwidth);
	$(image).height(newheight);
	$(image.parentNode).height(newheight);
	$(image.parentNode).width(newwidth);
*/
}



//////////////////////////////
//
// gotoPreviousPage --
//

function gotoPreviousPage() {
	vrvWorker.gotoPage(vrvWorker.page - 1)
	.then(function() {
		loadPage(vrvWorker.page);
	});
}



//////////////////////////////
//
// gotoNextPage --
//

function gotoNextPage() {
	vrvWorker.gotoPage(vrvWorker.page + 1)
	.then(function() {
		loadPage(vrvWorker.page);
	});
}



//////////////////////////////
//
// gotoLastPage --
//

function gotoLastPage() {
	vrvWorker.gotoPage(0)
	.then(function() {
		loadPage(vrvWorker.page);
	});
}



//////////////////////////////
//
// gotoFirstPage --
//

function gotoFirstPage() {
	vrvWorker.gotoPage(1)
	.then(function() {
		loadPage(vrvWorker.page);
	});
}



//////////////////////////////
//
// showBufferedHumdrumData --
//

function showBufferedHumdrumData() {
	var oldmode = EditorMode;
	if (oldmode == "musedata") {
		EditorMode = "humdrum";
		displayHumdrum();
	} else {
		EditorMode = "humdrum";
		if (!BufferedHumdrumFile.match(/^\s*$/)) {
			var page = vrvWorker.page;
			displayScoreTextInEditor(BufferedHumdrumFile, vrvWorker.page);
			BufferedHumdrumFile = "";
		}
	}
}



//////////////////////////////
//
// displayHumdrum --
//

function displayHumdrum() {
	var options = humdrumToSvgOptions();
	var data = EDITOR.getValue().replace(/^\s+/, "");
	vrvWorker.filterData(options, data, "humdrum")
	.then(showHumdrum);
}



//////////////////////////////
//
// showHumdrum --
//

var MuseDataBuffer = "";
function showHumdrum(humdrumdata) {
	if (EditorMode == "musedata") {
		// could implement a key to return to MuseData contents
		MuseDataBuffer = EDITOR.getValue();
	}
	EDITOR.setValue(humdrumdata, -1);
}



//////////////////////////////
//
// displayMeiNoType --
//

function displayMeiNoType() {
	var options = humdrumToSvgOptions();
	options.humType = 0;
	var data = EDITOR.getValue().replace(/^\s+/, "");
	vrvWorker.filterData(options, data, "mei")
	.then(showMei);
}



//////////////////////////////
//
// showMei --
//

function showMei(meidata) {
	setEditorModeAndKeyboard();
	if (ShowingIndex) {
		return;
	}
	if (BufferedHumdrumFile.match(/^\s*$/)) {
		BufferedHumdrumFile = EDITOR.getValue();
	}
	displayScoreTextInEditor(meidata, vrvWorker.page);
}



//////////////////////////////
//
// displayMei --
//

function displayMei() {
	vrvWorker.getMEI()
	.then(showMei);
}



//////////////////////////////
//
// displaySvg --
//

function displaySvg() {
	if (ShowingIndex) {
		return;
	}
	vrvWorker.renderPage(vrvWorker.page)
	.then(function(data) {
		var prefix = "<textarea style='spellcheck=false; width:100%; height:100%;'>";
		var postfix = "</textarea>";
		var w = window.open("about:blank", "SVG transcoding",
				'width=600,height=800,resizeable,scrollabars,location=false');
		w.document.write(prefix + data + postfix);
		w.document.close();

		// Set the title of the window.  It cannot be set immediately and must wait
		// until the content has been loaded.
		function checkTitle() {
			if (w.document) {
				w.document.title = "SVG transcoding";
			} else {
				setTimeout(checkTitle, 40);
			}
		}
		checkTitle();
	});
}



//////////////////////////////
//
// displayPdf --
//

function displayPdf() {
	if (!FILEINFO["has-pdf"]) {
		return;
	}
	if (FILEINFO["has-pdf"] != "true") {
		return;
	}

	var url = "https://kern.humdrum.org/data?l=" + FILEINFO["location"];
	url += "&file=" + FILEINFO["file"];
	url += "&format=pdf";

	var wpdf = window.open(url, "Scanned score",
			'width=600,height=800,resizeable,scrollabars,location=false');
}



//////////////////////////////
//
// reloadData -- Expand later to work with other input URIs.
//

function reloadData() {
	if (!CGI || !CGI.file) {
		return;
	}

	var basket = "basket-" + CGI.file;
	if (CGI.mm) {
		basket += "&mm=" + CGI.mm;
	}
	sessionStorage.removeItem(basket);
	loadKernScoresFile({
			file: CGI.file,
			measures: CGI.mm,
			previous: false,
			next: false
		}, true);
}



//////////////////////////////
//
// downloadVerovioToolkit --
//

function downloadVerovioToolkit(use_worker) {
	vrvWorker = new vrvInterface(use_worker, initializeVerovioToolkit);
};



//////////////////////////////
//
// initializeVerovioToolkit --
//

function initializeVerovioToolkit() {
	// console.log("Verovio toolkit being initialized.");

	var inputarea = document.querySelector("#input");

	// now done with Ace editor callback:
	// inputarea.addEventListener("keyup", function() {
	//		displayNotation();
	//});
	if (EDITOR) {
		EDITOR.session.on("change", function() {
			// console.log("EDITOR content changed");
			monitorNotationUpdating();
		});
	} else {
		console.log("Warning: Editor not setup yet");
	}

	$(window).resize(function() { applyZoom(); });

	$("#input").mouseup(function () {
		var $this = $(this);
		if ($this.outerWidth() != $this.data('x') || $this.outerHeight() != $this.data('y')) {
			applyZoom();
		}
		$this.data('x', $this.outerWidth());
		$this.data('y', $this.outerHeight());
	});

	if (!ShowingIndex) {
		console.log("Score will be displayed after verovio has finished loading");
		displayNotation();
	}

	downloadWildWebMidi('scripts/midiplayer/wildwebmidi.js');
}



//////////////////////////////
//
// monitorNotationUpdating --
//

function	monitorNotationUpdating() {
	updateEditorMode();
	displayNotation();
}



//////////////////////////////
//
// downloadWildWebMidi --
//

function downloadWildWebMidi(url) {
	var url3 = "scripts/midiplayer/midiplayer.js";

	basket.require(
		{url: url, expire: 26, unique: BasketVersion},
 		{url: url3, expire: 17, unique: BasketVersion}
	).then(function() { initializeWildWebMidi(); },
		function() { console.log("There was an error loading script", url)
	});
}



//////////////////////////////
//
// initializeWildWebMidi --
//

function initializeWildWebMidi() {
	$("#player").midiPlayer({
		color: null,
		// color: "#c00",
		onUnpdate: midiUpdate,
		onStop: midiStop,
		width: 250
	});

	$("#input").keydown(function() {
			stop();
	});

	// window blur event listener -- Stop MIDI playback.  It is very computaionally
	//    expensive, and is not useful if the window is not in focus.
	window.addEventListener("blur", function() {
		pause();
	});
}



//////////////////////////////
//
// dataIntoView -- When clicking on a note (or other itmes in SVG images later),
//      go to the corresponding line in the editor.
//

function	dataIntoView(event) {
	if (EditorMode == "xml") {
		xmlDataIntoView(event);
	} else {
		humdrumDataIntoView(event);
	}
}



//////////////////////////////
//
// xmlDataIntoView -- When clicking on a note (or other itmes in SVG
//      images later), make the text line in the MEI data visible in
//      the text area.
//
// https://github.com/ajaxorg/ace/wiki/Embedding-API
//

function xmlDataIntoView(event) {
	var target = event.target;
	var matches;
	while (target) {
		if (!target.id) {
			target = target.parentNode;
			continue;
		}
		var id = target.id;
		if (!id.match(/-L\d+F\d+/)) {
			target = target.parentNode;
			continue;
		}

		// still need to verify if inside of svg element in the first place.
		var searchstring = 'xml:id="' + target.id + '"';
		var regex = new RegExp(searchstring);
		var range = EDITOR.find(regex, {
			wrap: true,
			caseSensitive: true,
			wholeWord: true
		});

		console.log("FOUND ID AT", range);
		break; // assume that the first id found is valid.
	}
}



//////////////////////////////
//
// humdrumDataIntoView -- When clicking on a note (or other items in
//      SVG images later), make the text line in the Humdrum data visible
//      in the text area.
//

function humdrumDataIntoView(event) {
	var target;
	if (typeof event === "string") {
		target = document.querySelector("#" + event);
	} else {
		target = event.target;
	}
	var matches;
	while (target) {
		if (!target.id) {
			target = target.parentNode;
			continue;
		}
		matches = target.id.match(/-[^-]*L(\d+)F(\d+)/);
		if (!matches) {
			target = target.parentNode;
			continue;
		}
		HIGHLIGHTQUERY = target.id
		highlightIdInEditor(target.id, "humdrumDataIntoView");
		break;
	}
}



//////////////////////////////
//
// highlightIdInEditor --
//

function highlightIdInEditor(id, source) {
	if (!id) {
		// no element (off of page or outside of musical range
		console.log("NO ID so not changing to another element");
		return;
	}
	matches = id.match(/^([^-]+)-[^-]*L(\d+)F(\d+)/);
	if (!matches) {
		return;
	}

	var etype = matches[1];
	var row   = matches[2];
	var field = matches[3];
	var subtoken = 0;
	if (matches = id.match(/-.*L\d+F\d+S(\d+)/)) {
		subtoken = matches[1];
	}

	var linecontent = EDITOR.session.getLine(row-1);

	var col = 0;
	if (field > 1) {
		var tabcount = 0;
		for (i=0; i<linecontent.length; i++) {
			col++;
			if (linecontent[i] == '\t') {
				if ((i > 0) && (linecontent[i-1] != '\t')) {
					tabcount++;
				}
			}
			if (tabcount == field - 1) {
				break;
			}
		}
	}

	if (subtoken >= 1) {
		var scount = 1;
		while ((col < linecontent.length) && (scount < subtoken)) {
			col++;
			if (linecontent[col] == " ") {
				scount++;
				if (scount == subtoken) {
					col++;
					break;
				}
			}
		}
	}

	col2 = col;
	var searchstring = linecontent[col2];
	while (col2 < linecontent.length) {
		col2++;
		if (linecontent[col2] == " ") {
			break;
		} else if (linecontent[col2] == "\t") {
			break;
		} else {
			searchstring += linecontent[col2];
		}
	}

	CursorNote = document.querySelector("#" + id);
	MENU.showCursorNoteMenu(CursorNote);
	EDITOR.gotoLine(row, col);
}



//////////////////////////////
//
// setupAceEditor --
//  see: https://github.com/ajaxorg/ace/wiki/Embedding-API
//
// Folding:
//   https://cloud9-sdk.readme.io/docs/code-folding
//
// console.log("NUMBER OF LINES IN FILE", EDITOR.session.getLength());
//
// Keyboard Shortcuts:
//   https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts
//
// ACE Grammar editor:
// https://foo123.github.io/examples/ace-grammar
//

function setupAceEditor(idtag) {
	EDITOR = ace.edit(idtag);
	ace.config.set('modePath', "/scripts/ace");
	ace.config.set('workerPath', "/scripts/ace");
	ace.config.set('themePath', "/scripts/ace");
	EDITOR.getSession().setUseWorker(true);
	EDITOR.$blockScrolling = Infinity;
	EDITOR.setAutoScrollEditorIntoView(true);
	EDITOR.setBehavioursEnabled(false); // no auto-close of parentheses, quotes, etc.

	// See this webpage to turn of certain ace editor shortcuts:
   // https:github.com//ajaxorg/ace/blob/master/lib/ace/commands/default_commands.js

	// These are eating alt-l and alt-shift-l in VHV on linux:
	EDITOR.commands.removeCommand("fold", true);
	EDITOR.commands.removeCommand("unfold", true);

	// best themes:
	// kr_theme == black background, gray highlight, muted colorizing
	// solarized_dark == blue background, light blue hilight, relaxing colorizing
	// vibrant_ink == black background, gray highlight, nice colorizing
	// solarized_light == yellowish background, gray highlight, nice colorizing

	// EDITOR.setKeyboardHandler("ace/keyboard/vim");

	// keybinding = ace | vim | emacs | custom
	// fontsize   = 10px, etc
	// theme = "ace/theme/solarize_light"

	// EDITOR.getSession().setMode("ace/mode/javascript");

	setEditorModeAndKeyboard();

	EDITOR.getSession().setTabSize(TABSIZE);
	EDITOR.getSession().setUseSoftTabs(false);

	// don't show line at 80 columns:
	EDITOR.setShowPrintMargin(false);

	Range = require("ace/range").Range;

	EDITOR.getSession().selection.on("changeCursor", function(event)
		{ highlightNoteInScore(event)});

	//EDITOR.commands.addCommand({
	//	name: 'saveFile',
	//	bindKey: {
	//			win: 'Alt-G',
	//			mac: 'Alt-G',
	//			sender: 'editor|cli'
	//		},
	//	exec: function(env, argc, request) {
	//		alert("HI!", env, argc, request);
	//	}
	//});


}



//////////////////////////////
//
// highlightNoteInScore -- Called when the cursor has changed position
//     int the editor.
//

function highlightNoteInScore(event) {
	if (EditorMode == "xml") {
		xmlDataNoteIntoView(event);
	} else {
		humdrumDataNoteIntoView(event);
	}
}



///////////////////////////////////
//
// restoreSelectedSvgElement -- Need to generalize to multiple pages.
//

function restoreSelectedSvgElement(id) {
	if (!id) {
		return;
	}
	var item = document.querySelector("#" + id);
	if (!item) {
		return;
	}
	var line;
	var matches = id.match(/L(\d+)/);
	if (matches) {
		line = parseInt(line);0
	} else {
		return;
	}
	markItem(item, line);

/* Does not work: desired note is not in the list...
	if (RestoreCursorNote) {
		var svg = document.querySelector("svg");
		var glist = svg.getElementsByTagName("g");
		GGG = glist;
		for (var i=0; i<glist.length; i++) {
			if (!glist[i].id.match("note")) {
				continue;
			}
			console.log("GOT HERE ", glist[i].id);
			if (RestoreCursorNote === glist[i].id) {
				console.log("RESTORING ID", id);
			}
		}
		RestoreCursorNote = "";
	}
*/
}



//////////////////////////////
//
// xmlDataNoteIntoView --
//

function xmlDataNoteIntoView(event) {
	var location = EDITOR.selection.getCursor();
	var line = location.row;
	if (EditorLine == line) {
		// already highlighted (or close enough)
		return;
	}
	// var column = location.column;
	var text = EDITOR.session.getLine(line);
	var matches = text.match(/xml:id="([^"]+)"/);
	if (!matches) {
		markItem(null, line);
		return;
	}
	var id = matches[1];
	var item;
	if (Splitter.rightContent) {
		// see: https://www.w3.org/TR/selectors
		var item = Splitter.rightContent.querySelector("#" + id);
		// console.log("ITEM", item);
	}
	markItem(item, line);
}



//////////////////////////////
//
// humdrumDataNoteIntoView --
//

function humdrumDataNoteIntoView(event) {
	var location = EDITOR.selection.getCursor();
	var line = location.row;
	var column = location.column;
	var text = EDITOR.session.getLine(line);
	var fys = getFieldAndSubtoken(text, column);
	var field = fys.field;
	var subspine = fys.subspine;
	var query = HIGHLIGHTQUERY;
	HIGHLIGHTQUERY = "";
	// the following code causes problems with note highlighting
	// after another note was edited.
	//	if (!query) {
	//		query = EDITINGID;
	//		HIGHLLIGHTQUERY = EDITINGID;
	//		// EDITINGID = null;
	//	}
	if (!query) {
		var query = "L" + (line+1) + "F" + field;
		if (subspine > 0) {
			query += "S" + subspine;
		}
	}
	var item = 0;
	if (Splitter.rightContent) {
		// see: https://www.w3.org/TR/selectors
		var items = Splitter.rightContent.querySelectorAll("g[id$='" +
			query + "']");
		if (items.length == 0) {
			// cannot find (hidden rest for example)
			return;
		}
		// give priority to items that possess qon/qoff classes.
		for (var i=0; i<items.length; i++) {
			if (items[i].className.baseVal.match(/qon/)) {
				item = items[i];
				break;
			}
		}
		if (!item) {
			item = items[items.length-1];
		}
		if (item.id.match(/^accid/)) {
			item = items[items.length-2];
		}
	}
	markItem(item);
}



//////////////////////////////
//
// markItem -- Used by highlightNoteInScore.
//

function markItem(item, line) {
	if (!item) {
		item = CursorNote;
	}
	if (!item) {
		return;
	}
	EditorLine = line;
	// This case is not good for editing a note:
	//if (CursorNote && item && (CursorNote.id == item.id)) {
	//	console.log("THE SAME NOTE");
	//	return;
	//}
	if (CursorNote) {
		// console.log("TURNING OFF OLD NOTE", CursorNote);
		/// CursorNote.setAttribute("fill", "#000");
		// CursorNote.removeAttribute("fill");

		var classes = CursorNote.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		outclass = outclass.replace(/^\s+/, "");
		CursorNote.setAttribute("class", outclass);

	}
	if (item) {
		setCursorNote(item, "markItem");
	}
	if (CursorNote) {
		// console.log("TURNING ON NEW NOTE", CursorNote);
		// CursorNote.setAttribute("fill", "#c00");

		var classes = CursorNote.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		outclass += " highlight";
		CursorNote.setAttribute("class", outclass);
	}
}



//////////////////////////////
//
// getFieldAndSubtoken -- Return the data token and subtoken position
//    of the item at the given column on the line (column is index from 0),
//    but token and subtoken are indexed from 1.
//

function getFieldAndSubtoken(text, column) {
	// column++; // needed for some reason?
	var output = {field: -1, subspine: -1};
	if (text.match(/^[*!=]/)) {
		return output;
	}
	if (text == "") {
		return output;
	}

	var field = 0;
	var subspine = 0;
	var i;
	for (i=0; i<column; i++) {
		// deal with tab at start of line?
		if ((i > 0) && (text[i] == '\t') && (text[i-1] != '\t')) {
			field++;
			subspine = 0;
		} else if (text[i] == ' ') {
			subspine++;
		}
	}

	var subtok = false;
	// check if the field contains subtokens.  If so, set the
	if (subspine > 0) {
		subtok = true;
	} else {
		for (i=column; i<text.length; i++) {
			if (text[i] == " ") {
				subtok = true;
				break;
			} else if (text[i] == '\t') {
				break;
			}
		}
	}
	if (subtok) {
		subspine++;
	}
	field++;

	output.field = field;
	output.subspine = subspine;
	return output;
}



//////////////////////////////
//
// setupSplitter --
//

function setupSplitter() {
	var splitter = document.querySelector("#splitter");
	if (!splitter) {
		return;
	}

	if (!Splitter.leftContent) {
		Splitter.leftContent = document.querySelector('#input');
	}
	if (!Splitter.splitContent) {
		Splitter.splitContent = document.querySelector('#splitter');
	}
	if (!this.rightContent) {
		Splitter.rightContent = document.querySelector('#output');
	}

	splitter.addEventListener('mousedown', function(event) {
		Splitter.mouseState    = 1;
		if (!Splitter.leftContent) {
			Splitter.leftContent   = document.querySelector('#input');
		}
		if (!Splitter.splitContent) {
			Splitter.splitContent  = document.querySelector('#splitter');
		}
		if (!Splitter.rightContent) {
			Splitter.rightContent  = document.querySelector('#output');
		}
		Splitter.setPositionX(event.pageX);
	});

	window.addEventListener('mouseup', function(event) {
		if (Splitter.mouseState != 0) {
			Splitter.mouseState = 0;
			EDITOR.resize();
			displayNotation();
		}
	});

	window.addEventListener('mousemove', function(event) {
		if (Splitter.mouseState) {
			var minXPos = Splitter.minXPos;
			if (event.pageX < minXPos){
				if (event.pageX < minXPos - 70){ //Adjust closing snap tolerance here
					Splitter.setPositionX(0);
					InputVisible = false;
				}
				return;
			}
			Splitter.setPositionX(event.pageX);
			InputVisible = true;
		}
	});

}


////////////////////////////////////////////////////////////////////////////
//
//  Base64 encode/decode: Fixs problems with atob and btoa with UTF-8 encoded text.
//
//  https://www.webtoolkit.info
//

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}



//////////////////////////////
//
// displayScoreTextInEditor --
//

function displayScoreTextInEditor(text, page) {
	var mode = getMode(text);
	if (CGI.filter) {
		if (mode == "musedata") {
			text = "@@@filter: " + CGI.filter + "\n" + text;
		} else {
			text = "!!!filter: " + CGI.filter + "\n" + text;
		}
	}

	if (mode != EditorMode) {
		EditorMode = mode;
		setEditorModeAndKeyboard();
	};

	// -1 is to unselect added text, and move cursor to start
	EDITOR.setValue(text, -1);

	// update the notation display
	displayNotation(page);
}



//////////////////////////////
//
// getMode -- return the Ace editor mode to display the data in:
//    ace/mode/humdrum  == for Humdrum
//    ace/mode/xml   == for XML data (i.e., MEI, or SVG)
//

function getMode(text) {
	if (!text) {
		return "humdrum";
	}
	if (text.match(/^\s*</)) {
		return "xml";
	} else if (text.substring(0, 2000).match(/Group memberships:/)) {
		return "musedata";
	} else {
		return "humdrum";
	}
}



//////////////////////////////
//
// showIdInEditor -- Highlight the current line of data being played,
//     and center it.  But only do this if Humdrum data is being shown
//     in the editor (MEI data is not time-ordered by notes, only by
//     measure).
//

function showIdInEditor(id) {
	if (EditorMode == "xml") {
		return;
	}
	var matches = id.match(/-[^-]*L(\d+)/);
	if (!matches) {
		return;
	}
	var row = parseInt(matches[1]);
	EDITOR.gotoLine(row, 0);
	EDITOR.centerSelection();
	// console.log("PLAYING ROW", row);
}



//////////////////////////////
//
// toggleEditorMode --
//

function toggleEditorMode() {
//	if (KeyboardMode == "ace/keyboard/ace") {
//		KeyboardMode  = "ace/keyboard/vim";
//		EditorTheme   = "ace/theme/solarized_dark";
	if (KeyboardMode == "ace") {
		KeyboardMode  = "vim";
	} else {
		KeyboardMode  = "ace";
	};
	setEditorModeAndKeyboard();
};



//////////////////////////////
//
// setEditorModeAndKeyboard --
//

function setEditorModeAndKeyboard() {
	if (EDITOR) {
		EDITOR.setTheme(EditorModes[EditorMode][KeyboardMode].theme);
		EDITOR.getSession().setMode("ace/mode/" + EditorMode);
		// null to reset to default (ace) mode
		EDITOR.setKeyboardHandler(KeyboardMode === "ace" ? null : "ace/keyboard/" + KeyboardMode);
	};
};



//////////////////////////////
//
// toggleHumdrumCsvTsv --
//

function toggleHumdrumCsvTsv() {
	if (EditorMode == "xml") {
		// not editing Humdrum data
		return;
	}
	var data = EDITOR.getValue().replace(/^\s+/, "");
	var lines = data.split("\n");
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/^\*\*/)) {
			if (lines[i].match(/,/)) {
				console.log("CONVERTING TO TSV");
				EDITOR.setValue(convertDataToTsv(lines), -1);
			} else {
				console.log("CONVERTING TO CSV");
				EDITOR.setValue(convertDataToCsv(lines), -1);
			}
			break;
		}
	}
}



//////////////////////////////
//
// decreaseTab --
//

function decreaseTab() {
	TABSIZE--;
	if (TABSIZE < 1) {
		TABSIZE = 1;
	}
	EDITOR.getSession().setTabSize(TABSIZE);
}



//////////////////////////////
//
// increaseTab --
//

function increaseTab() {
	TABSIZE++;
	if (TABSIZE > 100) {
		TABSIZE = 100;
	}
	EDITOR.getSession().setTabSize(TABSIZE);
}



//////////////////////////////
//
// convertDataToCsv --
//

function convertDataToCsv(lines) {
	var output = "";
	for (var i=0; i<lines.length; i++) {
		output += convertLineToCsv(lines[i]) + "\n";
	}
	return output;
}



//////////////////////////////
//
// convertDataToTsv --
//

function convertDataToTsv(lines) {
	var output = "";
	for (var i=0; i<lines.length; i++) {
		output += convertLineToTsv(lines[i]) + "\n";
	}
	return output;
}



//////////////////////////////
//
// convertLineToTsv --
//

function convertLineToTsv(line) {
	var chars = line.split("");
	var output = "";
	if (chars.length < 1) {
		return output;
	}
	var inquote = 0;

	if ((chars.length >= 2) && (chars[0] == '!') && (chars[1] == '!')) {
		// Global commands and reference records which do not start with a
		// quote are considered to be literal.
		return line;
	}

	var separator = ",";

	for (var i=0; i<chars.length; i++) {

		if ((chars[i] == '"') && !inquote) {
			inquote = 1;
			continue;
		}
		if (inquote && (chars[i] == '"') && (chars[i+1] == '"')
				&& (i < chars.length-1)) {
			output += '"';
			i++;
			continue;
		}
		if (chars[i] == '"') {
			inquote = 0;
			continue;
		}
		if ((!inquote) && (line.substr(i, separator.length) == separator)) {
			output += '\t';
			i += separator.length - 1;
			continue;
		}
		output += chars[i];
	}
	return output;
}



//////////////////////////////
//
// convertLineToCsv --
//

function convertLineToCsv(line) {
	if (line.match(/^!!/)) {
		return line;
	}
	// Using \t rather than \t to preserve tabs
	var tokens = line.split(/\t/);
	var output = "";
	for (var i=0; i<tokens.length; i++) {
		output += convertTokenToCsv(tokens[i]);
		if (i<tokens.length-1) {
			output += ",";
		}
	}
	return output;
}



//////////////////////////////
//
// convertTokenToCsv --
//

function convertTokenToCsv(token) {
	var output = "";
	if (token.match(/,/) || token.match(/"/)) {
		output += '"';
		output += token.replace(/"/g, '""');
		output += '"';
		return output;
	} else {
		return token;
	}
}



//////////////////////////////
//
// showCompiledFilterData -- Run the Humdrum data through the vrvToolkit
//      to extract the output from tool filtering.
//

function showCompiledFilterData() {
	var options = humdrumToSvgOptions();
	var data = EDITOR.getValue().replace(/^\s+/, "");
	vrvWorker.filterData(options, data, "humdrum")
	.then(function(newdata) {
		newdata = newdata.replace(/\s+$/m, "");
		EDITOR.setValue(newdata, -1);
	});
}



//////////////////////////////
//
// insertDirectionRdfs -- If not present, insert above/below RDF markers
//     in data; otherwise returns what chatacters should represent "above"
//     and "below".  Typically ">" means "above" and "<" means "below".
//     also can be used to check if "<" or ">" are already used for
//     something else.
//

function insertDirectionRdfs() {
	var limit = 20; // search only first and last 20 lines of data for RDF entries.
	var abovechar = "";
	var belowchar = "";
	var matches;
	var i;
	var size = EDITOR.session.getLength();
	for (i=size-1; i>=0; i--) {
		if (size - i > limit) {
			break;
		}
		var line = EDITOR.session.getLine(i);
		if (matches = line.match(/^!!!RDF\*\*kern:\s+([^\s])\s*=.*above/)) {
			abovechar = matches[1];
		} else if (matches = line.match(/^!!!RDF\*\*kern:\s+([^\s])\s*=.*below/)) {
			belowchar = matches[1];
		}
		if ((abovechar !== "") && (belowchar !== "")) {
			break;
		}
	}

	if ((abovechar === "") || (belowchar === "")) {
		for (i=0; i<size; i++) {
			if (i > limit) {
				break;
			}
			var line = EDITOR.session.getLine(i);
			if (matches = line.match(/^\!\!\!RDF\*\*kern:\s+([^\s])\s*=.*above/)) {
				abovechar = matches[1];
			} else if (matches = line.match(/^\!\!\!RDF\*\*kern:\s+([^\s])\s*=.*below/)) {
				belowchar = matches[1];
			}
			if ((abovechar !== "") && (belowchar !== "")) {
				break;
			}
		}
	}

	if ((abovechar !== "") && (belowchar !== "")) {
		return [abovechar, belowchar];
	}

	var text  = "";

	if (abovechar === "") {
		text     +=  "!!!RDF**kern: > = above\n";
		abovechar = ">";
	} else {
		text     +=  "!!!RDF**kern: " + abovechar + " = above\n";
	}

	if (belowchar === "") {
		text     +=  "!!!RDF**kern: < = below";
		belowchar = "<";
	} else {
		text     +=  "!!!RDF**kern: " + belowchar + " = below";
	}

	// append markers to end of file.
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}
	EDITOR.session.insert({
			row: EDITOR.session.getLength(),
			column: 0
		},
		"\n" + text);
	FreezeRendering = freezeBackup;

	return [abovechar, belowchar];
}


//////////////////////////////
//
// saveSvgData --
//

function saveSvgData() {
	if (ShowingIndex) {
		return;
	}
	vrvWorker.renderPage(vrvWorker.page)
	.then(function(data) {
		var filename = SAVEFILENAME;
		var size = EDITOR.session.getLength();
		var matches;
		var line;
		for (var i=0; i<size; i++) {
			line = EDITOR.session.getLine(i);
			if (matches = line.match(/^!!!!SEGMENT:\s*([^\s].*)\s*$/)) {
				filename = matches[1];
			}
		}
		filename = filename.replace(/\.[^.]+/, ".svg");
		if (!filename.match(/svg$/)) {
			filename += ".svg";
		}

		var blob = new Blob([data], {type: 'text/plain'});
		saveAs(blob, filename);

	});
}



//////////////////////////////
//
// downloadEditorContentsInHtml --
//

function downloadEditorContentsInHtml() {
	var filename = SAVEFILENAME;
	var size = EDITOR.session.getLength();
	var matches;
	var line;
	for (var i=0; i<size; i++) {
		line = EDITOR.session.getLine(i);
		if (matches = line.match(/^!!!!SEGMENT:\s*([^\s].*)\s*$/)) {
			filename = matches[1];
		}
	}
	filename = filename.replace(/\.[^.]+/, ".html");
	if (!filename.match(/html$/)) {
		filename += ".html";
	}

	var text = EDITOR.session.getValue();
	var output = '<html>\n';
	output += '<head>\n';
	output += '<title>My Score</title>\n';
	output += '<script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin-worker.js"></script>\n';
	output += '</head>\n';
	output += '<body>\n';
	output += '<script>\n';
	output += '   displayHumdrum({\n';
	output += '      source: "my-score",\n';
	output += '      autoResize: "true",\n';
	output += '      header: "true"\n';
	output += '   });\n';
	output += '<!-- See https://plugin.humdrum.org/#options for more display options -->\n';
	output += '</script>\n';
	output += '\n';
	output += '<script type="text/x-humdrum" id="my-score">\n';
	output += text;
	output += '</script>\n';
	output += '\n';
	output += '</body>\n';
	output += '</html>\n';
	// var blob = new Blob([output], {type: 'text/plain;charset=utf-8'});
	var blob = new Blob([output], {type: 'text/plain'});
	saveAs(blob, filename);
}



//////////////////////////////
//
// saveEditorContents -- Save the editor contents to a file on the local disk.
//   Saves in UTF-8 format.
//

function saveEditorContents() {

	var filename = SAVEFILENAME;
	var size = EDITOR.session.getLength();
	var matches;
	var line;
	for (var i=0; i<size; i++) {
		line = EDITOR.session.getLine(i);
		if (matches = line.match(/^!!!!SEGMENT:\s*([^\s].*)\s*$/)) {
			filename = matches[1];
		}

	}

	var text = EDITOR.session.getValue();
	// var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
	var blob = new Blob([text], {type: 'text/plain'});
	saveAs(blob, filename);

}



//////////////////////////////
//
// saveEditorContentsLocally -- Save the editor contents to localStorage.
//

function saveEditorContentsLocally() {
	key = "SAVE" + InterfaceSingleNumber;
	localStorage.setItem(key, EDITOR.getValue());
	InterfaceSingleNumber = 1;
}



//////////////////////////////
//
// restoreEditorContentsLocally -- Restore the editor contents from localStorage.
//

function restoreEditorContentsLocally() {
	// save current contents to 0th buffer
	localStorage.setItem("SAVE0", EDITOR.getValue());
	// reset interval timer of buffer 0 autosave here...

	key = "SAVE" + InterfaceSingleNumber;
	EDITOR.setValue(localStorage.getItem(key), -1);
	InterfaceSingleNumber = 1;
}



//////////////////////////////
//
// insertEditorialAccidentalRdf -- If not present, insert editorial accidental
//     RDF marker in data; otherwise returns what chatacters should represent
//     an editorial accidental.
//

function insertEditorialAccidentalRdf() {
	var limit = 20; // search only first and last 20 lines of data for RDF entries.
	var editchar = "";
	var matches;
	var i;
	var size = EDITOR.session.getLength();
	for (i=size-1; i>=0; i--) {
		if (size - i > limit) {
			break;
		}
		var line = EDITOR.session.getLine(i);
		if (matches = line.match(/^!!!RDF\*\*kern:\s+([^\s])\s*=.*edit.*\s+acc/)) {
			editchar = matches[1];
		}
		if (editchar !== "") {
			break;
		}
	}

	if (editchar === "") {
		for (i=0; i<size; i++) {
			if (i > limit) {
				break;
			}
			var line = EDITOR.session.getLine(i);
			if (matches = line.match(/^\!\!\!RDF\*\*kern:\s+([^\s])\s*=.*edit.*\s+acc/)) {
				editchar = matches[1];
			}
			if (editchar !== "") {
				break;
			}
		}
	}

	if (editchar !== "") {
		return editchar;
	}

	var text  = "";

	if (editchar === "") {
		text     +=  "!!!RDF**kern: i = editorial accidental\n";
		editchar = "i";
	} else {
		text     +=  "!!!RDF**kern: " + editchar + " = editorial accidental\n";
	}

	// append markers to end of file.
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}
	EDITOR.session.insert({
			row: EDITOR.session.getLength(),
			column: 0
		},
		"\n" + text);
	FreezeRendering = freezeBackup;

	return editchar;
}



//////////////////////////////
//
// insertMarkedNoteRdf -- If not present, insert marked note
//     RDF marker in data; otherwise returns what chatacters should represent
//     a marked note.
//

function insertMarkedNoteRdf() {
	var limit = 20; // search only first and last 20 lines of data for RDF entries.
	var editchar = "";
	var matches;
	var i;
	var size = EDITOR.session.getLength();
	for (i=size-1; i>=0; i--) {
		if (size - i > limit) {
			break;
		}
		var line = EDITOR.session.getLine(i);
		if (matches = line.match(/^!!!RDF\*\*kern:\s+([^\s])\s*=.*mark.*\s+note/)) {
			editchar = matches[1];
		}
		if (editchar !== "") {
			break;
		}
	}

	if (editchar === "") {
		for (i=0; i<size; i++) {
			if (i > limit) {
				break;
			}
			var line = EDITOR.session.getLine(i);
			if (matches = line.match(/^\!\!\!RDF\*\*kern:\s+([^\s])\s*=.*mark.*\s+note/)) {
				editchar = matches[1];
			}
			if (editchar !== "") {
				break;
			}
		}
	}

	if (editchar !== "") {
		return editchar;
	}

	var text  = "";

	if (editchar === "") {
		text     +=  "!!!RDF**kern: @ = marked note";
		editchar = "@";
	} else {
		text     +=  "!!!RDF**kern: " + editchar + " = marked note";
	}

	// append markers to end of file.
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}
	EDITOR.session.insert({
			row: EDITOR.session.getLength(),
			column: 0
		},
		"\n" + text);
	FreezeRendering = freezeBackup;

	return editchar;
}



//////////////////////////////
//
// transposeDiatonic --
//

function transposeDiatonic(pitch, amount) {
	var len = pitch.length;
	amount = parseInt(amount);
	if (len == 0) {
		return "";
	}
	var pitchnum = humdrumToDiatonic(pitch);
	pitchnum += amount;

	if (pitchnum < 1) {
		// to low to process or mean anything
		return pitch;
	}
	if (pitchnum >= 70) {
		// to high to process or mean anything
		return pitch;
	}
	return diatonicToHumdrum(pitchnum);
}



//////////////////////////////
//
// humdrumToDiatonic -- Does not like rests, null tokens.
//

function humdrumToDiatonic(pitch) {
	var len = pitch.length;
	var octave = 0;
	var firstchar = pitch.charAt(0);
	var firstlow = firstchar.toLowerCase();
	if (firstchar === firstlow) {
		octave = 3 + len;
	} else {
		octave = 4 - len;
	}
	var diatonic = 0;
	if      (firstlow === "d") { diatonic = 1; }
	else if (firstlow === "e") { diatonic = 2; }
	else if (firstlow === "f") { diatonic = 3; }
	else if (firstlow === "g") { diatonic = 4; }
	else if (firstlow === "a") { diatonic = 5; }
	else if (firstlow === "b") { diatonic = 6; }
	return 7 * octave + diatonic;
}



//////////////////////////////
//
// diatonicToHumdrum --
//

function diatonicToHumdrum(pitch) {
	pitch = parseInt(pitch);
	var octave = parseInt(pitch / 7);
	var pc = pitch % 7;
	var pchar = "x";
	if      (pc == 0) { pchar = "c"; }
	else if (pc == 1) { pchar = "d"; }
	else if (pc == 2) { pchar = "e"; }
	else if (pc == 3) { pchar = "f"; }
	else if (pc == 4) { pchar = "g"; }
	else if (pc == 5) { pchar = "a"; }
	else if (pc == 6) { pchar = "b"; }

	var i;
	var count;
	var output = "";
	if (octave < 4) {
		pchar = pchar.toUpperCase();
		count = 4 - octave;
		for (i=0; i<count; i++) {
			output += pchar;
		}
	} else {
		count = octave - 3;
		for (i=0; i<count; i++) {
			output += pchar;
		}
	}

	return output;
}



//////////////////////////////
//
// toggleLayerColoring -- turn layer color highlighting on/off.
//

function toggleLayerColoring() {
	var sylesheet;
	stylesheet = document.querySelector("#layer-color-stylesheet");
	if (stylesheet) {
		var parentElement = stylesheet.parentNode;
		parentElement.removeChild(stylesheet);
		return;
	}
	stylesheet = document.createElement('style');
	var text = "";
	text += "g[id^='layer-'][id*='N2'] { fill: #00cc00; }";
	text += "g[id^='layer-'][id*='N3'] { fill: #cc00aa; }";
	text += "g[id^='layer-'][id*='N4'] { fill: #0088cc; }";
	text += "g[id^='layer-'][id*='N5'] { fill: #0000cc; }";
	text += "g[id^='layer-'][id*='N6'] { fill: #cc0000; }";
	text += "g[id^='layer-'][id*='N7'] { fill: #00cc00; }";
	stylesheet.innerHTML = text;
	stylesheet.id = "layer-color-stylesheet";
	document.body.appendChild(stylesheet);
}



//////////////////////////////
//
// clearContent --
//

var ERASED_DATA = "";
function clearContent() {
	var data = EDITOR.getValue();
	if (data.match(/^\s*$/)) {
		EDITOR.setValue(ERASED_DATA, -1);
	} else {
		ERASED_DATA = data;
		EDITOR.setValue("", -1);
		var output = document.querySelector("#output");
		if (output) {
			output.innerHTML = "";
		}
	}
}



//////////////////////////////
//
// playCurrentMidi -- If a note is selected start playing from that note;
//     otherwise, start from the start of the music.
//

function playCurrentMidi() {
	if (CursorNote && CursorNote.id) {
		var id = CursorNote.id;
		vrvWorker.getTimeForElement(id)
		.then(function(time) {
			play_midi(time);
		});
	} else {
		play_midi();
	}
}




//////////////////////////////
//
// goToPreviousNoteOrRest --
//

function goToPreviousNoteOrRest(currentid) {
	var current = document.querySelector("#" + currentid);
	if (!current) {
		console.log("CANNOT FIND ITEM ", currentid);
		return;
	}
	var location = getStaffAndLayerNumbers(current.id);
	var matches = current.className.baseVal.match(/qon-([^\s]+)/);
	if (!matches) {
		console.log("CANNOT FIND QON IN", current.className);
		return;
	}
	var qon = matches[1];
	if (qon == 0) {
		// cannot go before start of work
		return;
	}
	offclass = "qoff-" + qon;
	var alist = getOffClassElements(offclass);
	var nextid;
	if (!alist) {
		return;
	}
	unhighlightCurrentNote(current);
	if (alist.length == 1) {
		highlightIdInEditor(alist[0].id, "goToPreviousNoteOrRest");
	} else if (alist.length == 0) {
		// gotoNextPage();
		if (vrvWorker.page == 1) {
			// at first page, so don't do anything.
			console.log("AT FIRST PAGE, so not continuing further");
			return;
		}
		vrvWorker.gotoPage(vrvWorker.page - 1)
		.then(function(obj) {
			// loadPage(vrvWorker.page);
			var page = obj.page || vrvWorker.page;
			$("#overlay").hide().css("cursor", "auto");
			$("#jump_text").val(page);
			vrvWorker.renderPage(page)
			.then(function(svg) {
				$("#output").html(svg);
				// adjustPageHeight();
				resizeImage();
			})
			.then(function() {
				alist = getOnClassElements(offclass);
				if (alist.length == 1) {
					highlightIdInEditor(alist[0].id, "goToPreviousNoteOrRest2");
				} else {
					nextid = chooseBestId(alist, location.staff, location.layer);
					if (nextid) {
						EDITINGID = nextid;
						highlightIdInEditor(nextid, "goToPreviousNoteOrRest3");
					}
				}
			});
		});
	} else {
		nextid = chooseBestId(alist, location.staff, location.layer);
		if (nextid) {
			EDITINGID = nextid;
			highlightIdInEditor(nextid, "goToPreviousNoteOrRest4");
		}
	}
}



//////////////////////////////
//
// goToNextNoteOrRest -- current is the value of global variable CursorNote.
//    This function moves the cursor to the next note or rest in the spine
//    or subspine.  This is accomplished by examing the timestamps of the
//    notes and rests in the currently viewed SVG image generated by verovio.
//

function goToNextNoteOrRest(currentid) {
	var current = document.querySelector("#" + currentid);
	if (!current) {
		return;
	}
	var location = getStaffAndLayerNumbers(current.id);
	var matches = current.className.baseVal.match(/qoff-([^\s]+)/);
	if (!matches) {
		return;
	}
	var qoff = matches[1];
	var onclass = "qon-" + qoff;
	var alist = getOnClassElements(onclass);
	var nextid;
	if (!alist) {
		return;
	}
	unhighlightCurrentNote(current);

	if (alist.length == 1) {
		highlightIdInEditor(alist[0].id, "goToNextNoteOrRest");
	} else if (alist.length == 0) {
		// console.log("NO ELEMENT FOUND (ON NEXT PAGE?)");
		// gotoNextPage();
		if ((vrvWorker.pageCount > 0) && (vrvWorker.pageCount == vrvWorker.page)) {
			// at last page, so don't do anything.
			// console.log("AT LAST PAGE, so not continuing further");
			return;
		}
		vrvWorker.gotoPage(vrvWorker.page + 1)
		.then(function(obj) {
			// loadPage(vrvWorker.page);
			var page = obj.page || vrvWorker.page;
			$("#overlay").hide().css("cursor", "auto");
			$("#jump_text").val(page);
			vrvWorker.renderPage(page)
			.then(function(svg) {
				$("#output").html(svg);
				// adjustPageHeight();
				resizeImage();
			})
			.then(function() {
				alist = getOnClassElements(onclass);
				if (alist.length == 1) {
					highlightIdInEditor(alist[0].id, "goToNextNoteOrRest2");
				} else {
					nextid = chooseBestId(alist, location.staff, location.layer);
					if (nextid) {
						EDITINGID = nextid;
						highlightIdInEditor(nextid, "goToNextNoteOrRest3");
					}
				}
			});
		});
	} else {
		nextid = chooseBestId(alist, location.staff, location.layer);
		if (nextid) {
			EDITINGID = nextid;
			highlightIdInEditor(nextid, "goToNextNoteOrRest4");
		}
	}
}



//////////////////////////////
//
// getOnClassElements --
//

function getOnClassElements(onclass) {
	var nlist = document.querySelectorAll("." + onclass);
	var rlist = document.querySelectorAll(".r" + onclass);
	var alist = [];
	var match;
	var qon;
	var qoff;
	for (var i=0; i<nlist.length; i++) {

		match = nlist[i].className.baseVal.match(/qon-([^\s]+)/);
		if (match) {
			qon = match[1];
		} else {
			qon = "xyz";
		}

		match = nlist[i].className.baseVal.match(/qoff-([^\s]+)/);
		if (match) {
			qoff = match[1];
		} else {
			qoff = "xyz";
		}
		if (qon === qoff) {
			// no grace notes
			continue;
		}

		alist.push(nlist[i]);
	}
	for (var i=0; i<rlist.length; i++) {
		alist.push(rlist[i]);
	}
	return alist;
}



//////////////////////////////
//
// getOffClassElements --
//

function getOffClassElements(offclass) {
	var nlist = document.querySelectorAll("." + offclass);
	var rlist = document.querySelectorAll(".r" + offclass);
	var alist = [];
	for (var i=0; i<nlist.length; i++) {

		match = nlist[i].className.baseVal.match(/qon-([^\s]+)/);
		if (match) {
			qon = match[1];
		} else {
			qon = "xyz";
		}

		match = nlist[i].className.baseVal.match(/qoff-([^\s]+)/);
		if (match) {
			qoff = match[1];
		} else {
			qoff = "xyz";
		}
		if (qon === qoff) {
			// no grace notes
			continue;
		}

		alist.push(nlist[i]);
	}
	for (var i=0; i<rlist.length; i++) {
		alist.push(rlist[i]);
	}
	return alist;
}



//////////////////////////////
//
// getStaffAndLayerNumbers -- Return the staff and layer number of the
//   location of the given id's element.  The layer and staff numbers
//   are zero indexed to match MEI's enumeration (but this is not
//   necessary).
//

function getStaffAndLayerNumbers(id) {
	var element = document.querySelector("#" + id);
	return getStaffAndLayerNumbersByElement(element);
}


function getStaffAndLayerNumbersByElement(element) {
	if (!element) {
		return {};
	}
	var id = element.id;
	var staff = 0;
	var layer = 0;
	var current = element;

	current = current.parentNode;
	while (current && current.className.baseVal) {
		// console.log("CURRENT", current.className.baseVal);
		if (current.className.baseVal.match(/layer/)) {
			layer = getLayerPosition(current);
		} else if (current.className.baseVal.match(/staff/)) {
			staff = getStaffPosition(current);
		}
		current = current.parentNode;
	}
	return {
		layer: layer,
		staff: staff
	}

}



//////////////////////////////
//
// getLayerPosition -- Return the nth position of a <layer> elemnet within a
//   staff.
//

function getLayerPosition(element) {
	var count = 0;
	var current = element;
	while (current) {
		if (current.className.baseVal.match(/layer/)) {
			count++;
		}
		current = current.previousElementSibling;
	}
	return count;
}



//////////////////////////////
//
// getStaffPosition -- Return the nth position of a <staff> elemnet within a
//   measure.
//

function getStaffPosition(element) {
	var count = 0;
	var current = element;
	while (current) {
		if (current.className.baseVal.match(/staff/)) {
			count++;
		}
		current = current.previousElementSibling;
	}
	return count;
}



//////////////////////////////
//
// chooseBestId -- Match to the staff number and the layer number of the
//    original element.  The original element could be unattached from the
//    current SVG image, so its id is passed to this
//

function chooseBestId(elist, targetstaff, targetlayer) {
	var staffelements = [0,0,0,0,0,0,0,0,0,0,0,0];
	for (var i=0; i<elist.length; i++) {
		var location = getStaffAndLayerNumbers(elist[i].id);
		if (location.staff == targetstaff) {
			staffelements[location.layer] = elist[i];
			if ((location.layer == targetlayer) && (!elist[i].id.match(/space/))) {
				return elist[i].id;
			}
		}
	}
	// no exact match, so try a different layer on the same staff.
	if (staffelements.length == 1) {
		// only one choice so use it
		return staffelements[0].id;
	}

	// find a note/rest in a lower layer
	for (i=targetlayer; i>0; i--) {
		if (!staffelements[i]) {
			continue;
		}
		if (staffelements[i].id) {
			if (staffelements[i].id.match(/space/)) {
				continue;
			}
		}
		return staffelements[i].id;
	}

	// find a note/rest in a higher layer
	for (i=targetlayer; i<staffelements.length; i++) {
		if (!staffelements[i]) {
			continue;
		}
		if (staffelements[i].id) {
			if (staffelements[i].id.match(/space/)) {
				continue;
			}
		}
		return staffelements[i].id;
	}

	// go back and allow matching to invisible rests

	// find a note/rest in a lower layer
	for (i=targetlayer; i>0; i--) {
		if (!staffelements[i]) {
			continue;
		}
		return staffelements[i].id;
	}

	// find a note/rest in a higher layer
	for (i=targetlayer; i<staffelements.length; i++) {
		if (!staffelements[i]) {
			continue;
		}
		return staffelements[i].id;
	}

	// found nothing suitable
	return undefined;
}


//////////////////////////////
//
// setCursorNote --
//

function setCursorNote(item, location) {
	CursorNote = item;
	MENU.showCursorNoteMenu(CursorNote);
}



//////////////////////////////
//
// goDownHarmonically --
//

function goDownHarmonically(current) {
	moveHarmonically(current, -1);
}



//////////////////////////////
//
// goUpHarmonically --
//

function goUpHarmonically(current) {
	moveHarmonically(current, +1);
}



//////////////////////////////
//
// moveHarmonically --
//

function moveHarmonically(current, direction) {
	if (!current) {
		return;
	}
	var startid = current.id;
	unhighlightCurrentNote(current);
	var nextid = getNextHarmonicNote(startid, direction)
	if (!nextid) {
		return;
	}
	highlightIdInEditor(nextid, "moveHarmonically");
}



//////////////////////////////
//
// unhighlightCurrentNote --
//

function unhighlightCurrentNote(element) {
	if (element) {
		var classes = element.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		element.setAttribute("class", outclass);
	}
}



//////////////////////////////
//
// getNextHarmonicNote --
//

function getNextHarmonicNote(startid, direction) {
	var match = startid.match(/^[^-]+-[^-]*L(\d+)/);
	var startline = -1;
	if (match) {
		startline = parseInt(match[1]);
	} else {
		return undefined;
	}
	if (startline == -1) {
		return undefined;
	}
	// Assuming one svg on the page, which is currently correct.
	var svg = document.querySelector('svg');
	var allids = svg.querySelectorAll('*[id]:not([id=""])');
	var regex = new RegExp("^[^-]+-[^-]*L" + startline + "(?!\d)");
	var harmonic = [];
	var x;
	var i;
	for (i=0; i<allids.length; i++) {
		if (allids[i].id.match(regex)) {
			x = allids[i].id.replace(/-.*/, "");
			if (!((x == "note") || (x == "rest") || (x == "mrest"))) {
				// only keep track of certain types of elements
				// should chords be included or not? currently not.
				continue;
			}
			harmonic.push(allids[i]);
		}
	}
	harmonic.sort(function(a, b) {
		var aloc = getStaffAndLayerNumbersByElement(a);
		var bloc = getStaffAndLayerNumbersByElement(b);
		var astaff = aloc.staff | 0;
		var bstaff = bloc.staff | 0;
		var alayer = aloc.layer | 0;
		var blayer = bloc.layer | 0;

		if (astaff > bstaff) { return -1; }
		if (astaff < bstaff) { return +1; }
		if (alayer > blayer) { return -1; }
		if (alayer < blayer) { return +1; }

		// notes are in a chord so sort by pitch from low to high
		var match;
		var aoct = 0;
		var boct = 0;
		var ab40 = 0;
		var bb40 = 0;
		if (match = a.className.baseVal.match(/oct-(-?\d+)/)) {
			aoct = parseInt(match[1]);
		}
		if (match = b.className.baseVal.match(/oct-(-?\d+)/)) {
			boct = parseInt(match[1]);
		}
		if (match = a.className.baseVal.match(/b40c-(\d+)/)) {
			ab40 = aoct * 40 + parseInt(match[1]);
		}
		if (match = b.className.baseVal.match(/b40c-(\d+)/)) {
			bb40 = boct * 40 + parseInt(match[1]);
		}
		if (ab40 < bb40) { return -1; }
		if (ab40 > bb40) { return +1; }
		return 0;
	});
	if (harmonic.length == 1) {
		// nothing to do
		return undefined;
	}
	for (var j=0; j<harmonic.length; j++) {
		var oc = getStaffAndLayerNumbersByElement(harmonic[j]);
	}
	var startingindex = -1;
	for (i=0; i<harmonic.length; i++) {
		if (harmonic[i].id === startid) {
			startingindex = i;
			break;
		}
	}
	if (startingindex < 0) {
		return undefined;
	}
	var index = startingindex + direction;
	if (index < 0) {
		index = harmonic.length - 1;
	} else if (index >= harmonic.length) {
		index = 0;
	}
	return harmonic[index].id;
}



//////////////////////////////
//
// turnOffAllHighlights -- Remove highlights from all svg elements.
//

function turnOffAllHighlights() {
	var svg = document.querySelector("svg");
	var highlights = svg.querySelectorAll(".highlight");
	for (var i=0; i<highlights.length; i++) {
		var cname = highlights[i].className.baseVal;
		cname = cname.replace(/\bhighlight\b/, "");
		highlights[i].className.className = cname;
		highlights[i].className.baseVal = cname;
		highlights[i].className.animVal = cname;
	}
}



//////////////////////////////
//
// hideRepertoryIndex --
//

function hideRepertoryIndex() {
	var element = document.querySelector("#index");
	if (element && (element.style.display != "none")) {
		element.style.display = "none";
		// element.style.visibility = "hidden";
		var output = document.querySelector("#output");
		if (output) {
			console.log("FOCUSING ON OUTPUT");
			output.focus();
		}
		ShowingIndex = 0;
	}
}



//////////////////////////////
//
// observeSVGContent --
//

function observeSvgContent() {
	var content = document.querySelector("#output");
	var i;
	var s;
	var callback = function(mList, observer) {
		var svg = content.querySelector("svg");
		if (svg) {

			// Mark encoding problem messages with red caution symbol.
			spans = svg.querySelectorAll("g.dir.problem tspan.rend tspan.text tspan.text");
			for (i=0; i<spans.length; i++) {
				s = spans[i];
				if (s.innerHTML === "P") {
					s.innerHTML = "&#xf071;";
					s.classList.add("p");
				}
			}

			// Mark encoding problem messages with green caution symbol.
			spans = svg.querySelectorAll("g.dir.sic tspan.rend tspan.text tspan.text");
			for (i=0; i<spans.length; i++) {
				s = spans[i];
				if (s.innerHTML === "S") {
					s.innerHTML = "&#xf071;";
					s.classList.add("s");
				}
			}

		}

		for (var mu in mList) {
			if (svg && svg.isSameNode(mList[mu].target)) {
				//remove busy class if svg changed
				document.body.classList.remove("busy");
			}
		}
	}
	var observer = new MutationObserver(callback);

	observer.observe(content, { childList: true, subtree: true });
}



//////////////////////////////
//
// updateEditorMode -- Automatically detect the type of data and change edit mode:
//

function updateEditorMode() {
	var xmod = getMode(EDITOR.getValue().substring(0, 2000));
	if (xmod !== EditorMode) {
		EditorMode = xmod;
		setEditorModeAndKeyboard();
		console.log("Changing to", xmod, "mode.");
	}
}
