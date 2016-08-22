//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Thu Aug 18 21:03:35 CEST 2016
// Filename:       listeners.js
// Web Address:    http://flashcards.sapp.org/listeners.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Event listeners and related code for index.html.
//

var CGI = {};

// verovio variables for a movement:
var vrvToolkit;
var PAGE     = 1;
var FILEINFO = {};
var HEIGHT   = 0;
var WIDTH    = 0;
var EDITOR;
var EditorMode = "ace/mode/text";
var KeyboardMode = "ace/keyboard/ace";
var EditorTheme = "ace/theme/solarized_light";

var Actiontime = 0;

// see https://github.com/ajaxorg/ace/wiki/Embedding-API
// Use EditSession instead of BufferedHumdrumFile:
var BufferedHumdrumFile = "";
var Range = function() { console.log("Range is undefined"); }

var ids   = [];
var PAGED = true;
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
var OneKey    = 49;
var TwoKey    = 50;
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
// displayNotation -- Convert Humdum data in textarea to notation.
//

function displayNotation(page) {
	if (!vrvToolkit) {
		console.log("Verovio toolkit not (yet) loaded");
		return;
	}

	if (FreezeRendering) {
		return;
	}
   // if input area is a <textarea>, then use .value to access contnets:
	// var inputarea = document.querySelector("#input");
	// var data = inputarea.value;
	var data = EDITOR.getValue().replace(/^\s+/, "");
	var options = humdrumToSvgOptions();
	var svg = vrvToolkit.renderData(data, JSON.stringify(options));
	if (page) {
		svg = vrvToolkit.renderPage(page, "");
	}
	var output = document.querySelector("#output");
	var indexelement = document.querySelector("#index");
	indexelement.style.visibility = "invisibile";
	indexelement.style.display = "none";

	document.querySelector("#output").innerHTML = svg;

	displayFileTitle(data);

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
// format S           == input format (darms, mei, pae, xml)
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
//

function humdrumToSvgOptions() {
	var output = {
		inputFormat       : "auto",
		adjustPageHeight  : 1,
		pageHeight        : 60000,
		border            : 20,
		pageWidth         : 2500,
		scale             : 40,
		type              : "midi",
		font              : "Leipzig"
	}
	if (OriginalClef) {
		output.appXPathQuery = "./rdg[contains(@label, 'original-clef')]";
	} else {
		// the xpath query may need to be cleared
		// out of the persistent object:
		output.appXPathQuery = "./rdg[contains(@label, 'asiuahetlkj')]";
	}
	if (PAGED) {
		var tw = $("#input").outerWidth();
		if ($("#input").css("display") == "none") {
			tw = 0;
		}
		// output.pageHeight = ($(window).innerHeight() - $("#navbar").outerHeight()) / ZOOM - 100;
		// output.pageWidth = ($(window).innerWidth() - tw) / ZOOM - 100;
		// jQuery $winow.innerHeight() not working properly (in Chrome).
		output.pageHeight = (window.innerHeight - $("#navbar").outerHeight()) / ZOOM - 100;
		output.pageWidth = (window.innerWidth - tw) / ZOOM - 100;
	}

	return output;
}

function humdrumToMeiOptions() {
	return {
		inputFormat       : "humdrum",
		adjustPageHeight  : 1,
		pageHeight        : 8000,
		border            : 20,
		pageWidth         : 2500,
		scale             : 40,
		type              : "mei",
		font              : "Leipzig"
	}
}



//////////////////////////////
//
// allowTabs -- Allow tab characters in textarea content.
//

function allowTabs() {
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
}



//////////////////////////////
//
// toggleFreeze --
//

function toggleFreeze() {
	FreezeRendering = !FreezeRendering;
	console.log("FreezeRendering =,", FreezeRendering);
	if (!FreezeRendering) {
		console.log("Updating notation");
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
	}
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
	if (FILEINFO["previous-work"]) {
		pretitle += "<span style=\"cursor:pointer\" onclick=\"displayWork('"
		pretitle += FILEINFO["previous-work"];
		pretitle += "');\"";
		pretitle += " title='previous work/movement (&#8679;+&#8592;)'";
		pretitle += ">";
		pretitle += "&#9664;";
		pretitle += "</span>";
	}

	if (FILEINFO["previous-work"] &&
		FILEINFO["next-work"] &&
		(FILEINFO["has-index"] == "true")) {
		pretitle += "&nbsp;";
	}

	if (FILEINFO["has-index"] == "true") {
		pretitle += "<span style=\"cursor:pointer\" onclick=\"displayIndex('"
		pretitle += FILEINFO["location"];
		pretitle += "');\"";
		pretitle += " title='index (&#8679;+&#8593;)'";
		pretitle += ">";
		pretitle += "&#9650;";
		pretitle += "</span>";
	}

	if (FILEINFO["previous-work"] &&
			FILEINFO["next-work"] &&
			(FILEINFO["has-index"] == "true")) {
		pretitle += "&nbsp;";
	}

	if (FILEINFO["previous-work"] &&
			FILEINFO["next-work"] &&
			(FILEINFO["has-index"] != "true")) {
		pretitle += "&nbsp;";
	}

	if (FILEINFO["next-work"]) {
		pretitle += "<span style=\"cursor:pointer\" onclick=\"displayWork('"
		pretitle += FILEINFO["next-work"];
		pretitle += "');\"";
		pretitle += " title='next work/movement (&#8679;+&#8594;)'";
		pretitle += ">";
		pretitle += "&#9658;";
		pretitle += "</span>";
	}

	if (FILEINFO["previous-work"] ||
		FILEINFO["next-work"]) {
		pretitle += "&nbsp;&nbsp;";
	}

	if (tarea && !composer.match(/^\s*$/)) {
		pretitle += composer + ", ";
	}
	tarea.innerHTML = pretitle;

}



//////////////////////////////
//
// displayWork --
//

function displayWork(file) {
	if (!file) {
		return;
	}
	PAGE = 1;
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
	var url = "http://kern.humdrum.org/data?l=" + location;
	url += "&format=index";

	console.log("Loading index", url);

	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			var INDEX = request.responseText;
			console.log("INDEX= ", INDEX);
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
		hideInputArea(true);
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

function loadKernScoresFile(obj) {
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
   if (COUNTER > 1000) {
		console.log("TOO LARGE", file);
		return;
	}

	var location;
	var filename;
	var matches;
	if (matches = file.match(/(.*)\/([^\/]+)/)) {
		location = matches[1];
		filename = matches[2];
	}

	if ((!filename) || !filename.match(/\.[a-z][a-z][a-z]$/)) {
		loadIndexFile(file);
		return;
	}

	if (filename.match(/^\s*$/)) {
		loadIndexFile(file);
		return;
	}

	var url = "http://kern.humdrum.org/data?l=" + location + "&file=" + filename;
	url += "&format=info-json";

	var key = location + "/" + filename;
	if (measures) {
		url += "&mm=" + measures;
		key += "&mm=" + measures;
	}

	var info = basketSession.get(key);
	var jinfo;
	if (!info) {
		console.log("Going to download", key);
		basketSession.require(
			{	url: url,
				key: key,
				expire: 172,
				execute: false
			}
		).then(function() {
				console.log("Downloaded", key);
				info = basketSession.get(key);
				if (info) {
					jinfo = JSON.parse(info.data);
					if (getnext) {
						console.log("processing AAA");
						processInfo(jinfo, obj, false, false);
						console.log("processing BBB");
					}
				} else {
					console.log("Error retrieving", key);
				}
			}, function() {
				console.log("Error retrieving", key);
			});
	} else {
		console.log("Already have", key);
		jinfo = JSON.parse(info.data);
		if (getnext) {
			processInfo(jinfo, obj, false, false);
		}
	}
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

	// var inputarea = document.querySelector("#input");
	// inputarea.value = score;
	displayScoreTextInEditor(score, PAGE);

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
	if (matches = file.match(/(.*)\/([^\/]+)/)) {
		location = matches[1];
		filename = matches[2];
	}
	var url = "http://kern.humdrum.org/data?l=" + location + "&file=" + filename;
	if (measures) {
		url += "&mm=" + measures;
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
			EDITOR.setValue(request.response, -1);
			displayNotation(page);
		}
	});
	request.send();
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

	if (PAGE != 1) {
		measure = $("#output .measure").attr("id");
	}

	var options = humdrumToSvgOptions();
	if ((HEIGHT != options.pageHeight) || (WIDTH != options.pageWidth)) {
		stop();
		HEIGHT = options.pageHeight;
		WIDTH = options.pageWidth;
		vrvToolkit.setOptions(JSON.stringify(options));
		vrvToolkit.redoLayout();
	}

	PAGE = 1;
	if (measure != 0) {
		PAGE = vrvToolkit.getPageWithElement(measure);
	}
	loadPage(PAGE);
}



//////////////////////////////
//
// loadPage --
//

function loadPage(page) {
	if (!page) {
		page = PAGE;
	}
	PAGE = page;
	$("#overlay").hide().css("cursor", "auto");
	$("#jump_text").val(page);
	svg = vrvToolkit.renderPage(page, "");
	$("#output").html(svg);
	// adjustPageHeight();
	resizeImage();
}



//////////////////////////////
//
// resizeImage -- Make all SVG images match the width of the new
//     width of the window.
//

function resizeImage(image) {
	var ww = $("window").innerWidth;
	var tw = $("#input").outerWidth;
	var newwidth = ww - tw;

	var newheight = $(window).innerWidth

	var image = document.querySelector("#output svg");
	if (!image) {
		return;
	}

	$(image).width(newwidth);
	$(image).height(newheight);
	$(image.parentNode).height(newheight);
	$(image.parentNode).width(newwidth);
}


//////////////////////////////
//
// gotoPreviousPage --
//

function gotoPreviousPage() {
	var page = PAGE;
	if (page <= 1) {
		page = vrvToolkit.getPageCount();
	} else {
		page--;
	}
	PAGE = page;
	loadPage(page);
}



//////////////////////////////
//
// gotoNextPage --
//

function gotoNextPage() {
	var page = PAGE;
	page++;
	if (page > vrvToolkit.getPageCount()) {
		page = 1;
	}
	PAGE = page;
	loadPage(page);
}



//////////////////////////////
//
// gotoLastPage --
//

function gotoLastPage() {
	var page = vrvToolkit.getPageCount();
	PAGE = page;
	loadPage(page);
}



//////////////////////////////
//
// gotoFirstPage --
//

function gotoFirstPage() {
	var page = 1;
	PAGE = page;
	loadPage(page);
}



//////////////////////////////
//
// showBufferedHumdrumData --
//

function showBufferedHumdrumData() {
	if (!BufferedHumdrumFile.match(/^\s*$/)) {
		var page = PAGE;
		displayScoreTextInEditor(BufferedHumdrumFile, PAGE);
		BufferedHumdrumFile = "";
	}
}



//////////////////////////////
//
// displayMei --
//

function displayMei() {
	if (ShowingIndex) {
		return;
	}
	var meidata = vrvToolkit.getMEI(0, 1);
	if (BufferedHumdrumFile.match(/^\s*$/)) {
		BufferedHumdrumFile = EDITOR.getValue();
	}
	var page = PAGE;
	displayScoreTextInEditor(meidata, page);
	
	// var prefix = "<textarea style='spellcheck=false; width:100%; height:100%;'>";
	// var postfix = "</textarea>";
	// var w = window.open("about:blank", "MEI transcoding", 'width=600,height=800,resizeable,scrollabars,location=false');
	// w.document.write(prefix + data + postfix);
	// w.document.close();
	// function checkTitle() {
	// 	if (w.document) {
	// 		w.document.title = "MEI transcoding";
	// 	} else {
	// 		setTimeout(checkTitle, 40);
	// 	}
	// }
	// checkTitle();
}




//////////////////////////////
//
// displaySvg --
//

function displaySvg() {
	if (ShowingIndex) {
		return;
	}
	var data = vrvToolkit.renderPage(PAGE, "");
	var prefix = "<textarea style='spellcheck=false; width:100%; height:100%;'>";
	var postfix = "</textarea>";
	var w = window.open("about:blank", "SVG transcoding", 'width=600,height=800,resizeable,scrollabars,location=false');
	w.document.write(prefix + data + postfix);
	w.document.close();
	function checkTitle() {
		if (w.document) {
			w.document.title = "SVG transcoding";
		} else {
			setTimeout(checkTitle, 40);
		}
	}
	checkTitle();
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

	var url = "http://kern.humdrum.org/data?l=" + FILEINFO["location"];
	url += "&file=" + FILEINFO["file"];
	url += "&format=pdf";

	var wpdf = window.open(url, "Scanned score",
			'width=600,height=800,resizeable,scrollabars,location=false');
}



//////////////////////////////
//
// reloadData --
//

function reloadData() {
	console.log("CGI", CGI);
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
		});
}



//////////////////////////////
//
// downloadVerovioToolkit --
//

function downloadVerovioToolkit(url) {
	basket.require({url: url, expire: 500, unique: 1})
		.then(function() { initializeVerovioToolkit(); },
				function() { console.log("There was an error loading script", url)
		});
}



//////////////////////////////
//
// initializeVerovioToolkit --
//

function initializeVerovioToolkit() {
	console.log("Verovio toolkit being initialize.");

	vrvToolkit = new verovio.toolkit();

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
		console.log("Display current score after verovio initialized");
		displayNotation();
	}

	downloadWildWebMidi('scripts/midiplayer/wildwebmidi.js');
}



//////////////////////////////
//
// monitorNotationUpdating --
//

function	monitorNotationUpdating() {

   if (EDITOR.session.getLength() < 500) {
			displayNotation();
			return;
	}

	var delay = 3000;  // 3000 milliseconds = 3 seconds

	if (EDITOR.session.getLength() < 1000) {
		delay = 500;
	} else if (EDITOR.session.getLength() < 2000) {
		delay = 1000;
	} else if (EDITOR.session.getLength() < 3000) {
		delay = 1500;
	} else if (EDITOR.session.getLength() < 4000) {
		delay = 2000;
	}

	var actiontime = new Date().getTime() + delay;
	ActionTime = actiontime;

	setTimeout(function() {
		if (actiontime <= ActionTime) {
			console.log("Updating notation in setTimeout");
			displayNotation();
		}
	}, delay);
}




//////////////////////////////
//
// downloadWildWebMidi --
//

function downloadWildWebMidi(url) {
	var url2 = "scripts/midiplayer.js";
	var url3 = "scripts/midiplayer/midiplayer.js";

	basket.require(
		{url: url, expire: 26},
		{url: url2, expire: 11},
		{url: url3, expire: 17}
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
		color: "#c00",
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
	if (EditorMode == "ace/mode/xml") {
		xmlDataIntoView(event);
	} else {
		humdrumDataIntoView(event);
   }
}



//////////////////////////////
//
// xmlDataIntoView -- When clicking on a note (or other itmes in SVG images later),
//      make the text line in the MEI data visible in the text area.
//
// https://github.com/ajaxorg/ace/wiki/Embedding-API
//

function xmlDataIntoView(event) {
	var path = event.path;
	var matches;
	var i;
	for (i=0; i<path.length; i++) {
		if (!path[i].id) {
			continue;
		}
		// still need to verify if inside of svg element in the first place.
console.log("SEARHCING FOR ID", path[i].id);
		EDITOR.find(path[i].id, {
			wrap: true,
			caseSensitive: true,
			wholeWord: true
		});
		break; // assume that the first id found is valid.
	}
}



//////////////////////////////
//
// humdrumDataIntoView -- When clicking on a note (or other itmes in SVG images later),
//      make the text line in the Humdum data visible in the text area.
//

function humdrumDataIntoView(event) {
	var path = event.path;
	var matches;
	var i;
	var row;
   var col;
   var col2;

	for (i=0; i<path.length; i++) {
		if (!path[i].id) {
			continue;
		}
		matches = path[i].id.match(/-.*L(\d+)F(\d+)/);
		if (!matches) {
			continue;
		}

		highlightIdInEditor(path[i].id);
		break;
	}
}


//////////////////////////////
//
// highlightIdInEditor --
//

function highlightIdInEditor(id) {
	matches = path[i].id.match(/-.*L(\d+)F(\d+)/);
	if (!matches) {
		return;
	}

	var row = matches[1];
	var field = matches[2];
	var subtoken = 0;
	if (matches = path[i].id.match(/-.*L\d+F\d+S(\d+)/)) {
		subtoken = matches[1];
	}

	var linecontent = EDITOR.session.getLine(row-1);
	console.log("LINE CONTENT", linecontent);
	console.log("FIELD", field);

	var col = 0;
	if (field > 1) {
		var tabcount = 0;
		for (i=0; i<linecontent.length; i++) {
			col += 1
			if (linecontent[i] == '\t') {
				console.log("Found tab at ", i);
				tabcount++;
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

	EDITOR.gotoLine(row, col);
	// interesting: http://stackoverflow.com/questions/26573429/highlighting-a-single-character-in-ace
	// var range = new Range (row-1, col, row-1, col2);
	// console.log("SEARCH RANGE", range);
	// var r = EDITOR.find(searchstring, {
	// 	wrap: false,
	// 	caseSensitive: true,
	// 	wholeWord: true,
	// 	range: range
	// });
     //  this does not work well because same text at other locations
	// are also highlighted in a black box:
	// EDITOR.selection.setRange(r);
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
// http://foo123.github.io/examples/ace-grammar
//

function setupAceEditor(idtag) {
	EDITOR = ace.edit(idtag);
	EDITOR.$blockScrolling = Infinity;
	EDITOR.setAutoScrollEditorIntoView(true);

	EDITOR.setTheme("ace/theme/solarized_light");
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

	EDITOR.getSession().setTabSize(15);

	// don't show line at 80 columns:
	EDITOR.setShowPrintMargin(false);

	Range = require("ace/range").Range;
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
//  http://www.webtoolkit.info
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
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
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
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
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
	// -1 is to unselect added text, and move cursor to start
	var mode = getMode(text);
	if (mode != EditorMode) {
		EDITOR.session.setMode(mode);
		EditorMode = mode;
	}
	EDITOR.setValue(text, -1);
	// unpdate the notation display
	displayNotation(page);
	PAGE = page;
}



//////////////////////////////
//
// getMode -- return the Ace editor mode to display the data in:
//    ace/mode/text  == for Humdrum (until a mode is added for Humdrum)
//    ace/mode/xml   == for XML data (i.e., MEI, or SVG)
//

function getMode(text) {
	if (text.match(/^\s*</)) {
		return "ace/mode/xml";
	} else {
		return "ace/mode/text";
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
	if (EditorMode == "ace/mode/xml") {
		return;
	}
	var matches = id.match(/-.*L(\d+)/);
	if (!matches) {
		return;
	}
	var row = parseInt(matches[1]);
	EDITOR.gotoLine(row, 0);
	EDITOR.centerSelection();
	console.log("PLAYING ROW", row);
}



//////////////////////////////
//
// toggleEditorMode --
//

function toggleEditorMode() {
	if (KeyboardMode == "ace/keyboard/ace") {
		KeyboardMode  = "ace/keyboard/vim";
		EditorTheme   = "ace/theme/solarized_dark";
	} else {
		KeyboardMode  = "ace/keyboard/ace";
		EditorTheme   = "ace/theme/solarized_light";
	}
	if (EDITOR) {
		EDITOR.setTheme(EditorTheme);
		EDITOR.setKeyboardHandler(KeyboardMode);
	}
}


