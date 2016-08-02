// vim: ts=3

var vrvToolkit;

var CGI = {};
var PAGE = 1;
var ids = [];
var FILEINFO = {};
var HEIGHT = 0;
var WIDTH = 0;
var PAGED = true;
var ZOOM = 0.4;
var PLAY = false;
var PAUSE = false;

var FirstInitialization = false;
var InputVisible = true;
var VrvTitle = "true";
var OriginalClef = false;
var UndoHide = false;
var ApplyZoom = false;
var ShowingIndex = false;
var FreezeRendering = false;

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
var LeftKey   = 37;
var UpKey     = 38;
var RightKey  = 39;
var DownKey   = 40;
var EnterKey  = 13;
var SpaceKey  = 32;
var SlashKey  = 191;
var EscKey    = 27;
var BackKey   = 8;


//////////////////////////////
//
// displayNotation -- Convert Humdum data in textarea to notation.
//

function displayNotation(page) {
	if (FreezeRendering) {
		return;
	}
	var inputarea = document.querySelector("#input");
	var data = inputarea.value;
	var options = humdrumToSvgOptions();
	var svg = vrvToolkit.renderData(data, JSON.stringify(options));
	if (page) {
		svg = vrvToolkit.renderPage(page, "");
	}
	document.querySelector("#output").innerHTML = svg;

	displayFileTitle(inputarea.value);

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
console.log("PAGEHEIGHT =", output.pageHeight);
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
	var area = document.querySelector("#input");
	if (InputVisible) {
		area.style.visibility = "visible";
		area.style.display = "inline";
	} else {
		area.style.visibility = "hidden";
		area.style.display = "none";
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
	var area = document.querySelector("#input");
	if (InputVisible) {
		area.style.visibility = "visible";
		area.style.display = "inline";
	} else {
		area.style.visibility = "hidden";
		area.style.display = "none";
	}
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
	var area = document.querySelector("#input");
	if (InputVisible) {
		area.style.visibility = "visible";
		area.style.display = "inline";
	} else {
		area.style.visibility = "hidden";
		area.style.display = "none";
	}
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
	CGI.file = file;
	delete CGI.mm;
	delete CGI.kInitialized;
	$('html').css('cursor', 'wait');
	stop();
	loadKernScoresFile(CGI.file, CGI.mm);
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

	var output = document.querySelector("#output");
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
	output.innerHTML = final;
}



//////////////////////////////
//
// loadKernScoresFile --
//

function loadKernScoresFile(file, measures, page) {
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

	console.log("Loading JSON INFO", url);

	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			FILEINFO = JSON.parse(request.responseText);
			console.log("FILEINFO= ", FILEINFO);
			downloadKernScoresFile(file, measures, page);
		}
	});
	request.send();
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
			var inputarea = document.querySelector("#input");
			console.log("Current file:", file);
			inputarea.value = request.response;
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
// displayMei --
//

function displayMei() {
	if (ShowingIndex) {
		return;
	}
	var data = vrvToolkit.getMEI(0, 1);
	var prefix = "<textarea style='spellcheck=false; width:100%; height:100%;'>";
	var postfix = "</textarea>";
	var w = window.open("about:blank", "MEI transcoding", 'width=600,height=800,resizeable,scrollabars,location=false');
	w.document.write(prefix + data + postfix);
	w.document.close();
	function checkTitle() {
		if (w.document) {
			w.document.title = "MEI transcoding";
		} else {
			setTimeout(checkTitle, 40);
		}
	}
	checkTitle();
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

	console.log("Loading PDF", url);

	var wpdf = window.open(url, "Scanned score", 
			'width=600,height=800,resizeable,scrollabars,location=false');

}



//////////////////////////////
//
// reloadData --
//

function reloadData() {
	loadKernScoresFile(CGI.file, CGI.mm, PAGE);
}


