// vim: ts=3

var vrvToolkit;

var PAGE = 1;
var ids = [];
var FILEINFO = {};
var HEIGHT = 0;
var WIDTH = 0;
var PAGED = true;
var ZOOM = 0.4;
var PLAY = false;
var PAUSE = false;

var InputVisible = "true";
var OriginalClef = false;


//////////////////////////////
//
// displayNotation -- Convert Humdum data in textarea to notation.
//

function displayNotation() {
	var inputarea = document.querySelector("#input");
	var data = inputarea.value;
	var options = humdrumToSvgOptions();
	document.querySelector("#output").innerHTML =
		vrvToolkit.renderData(data, JSON.stringify(options));
	displayFileTitle(inputarea.value);
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
		inputFormat       : "humdrum",
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
		output.pageHeight = ($(window).innerHeight() - $("#navbar").outerHeight()) / ZOOM - 100;
		output.pageWidth = ($(window).innerWidth() - tw) / ZOOM - 100;
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
// ToggleInputArea --
//

function toggleInputArea() {
	InputVisible = !InputVisible;
	var area = document.querySelector("#input");
	if (InputVisible) {
		area.style.visibility = "visible";
		area.style.display = "inline";
	} else {
		area.style.visibility = "hidden";
		area.style.display = "none";
	}
	applyZoom();
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
	if (tarea && !composer.match(/^\s*$/)) {
		tarea.innerHTML = composer + ", ";
	}

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



//////////////////////////////
//
// loadKernScoresFile --
//

function loadKernScoresFile(file, measures) {
	var location;
	var filename;
	var matches;
	if (matches = file.match(/(.*)\/([^\/]+)/)) {
		location = matches[1];
		filename = matches[2];
	}
	var url = "http://kern.humdrum.org/data?l=" + location + "&file=" + filename;
	url += "&format=info-json";

	console.log("Loading JSON INFO", url);

	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			FILEINFO = JSON.parse(request.responseText);
			console.log("JSON INFO = ", FILEINFO);
			downloadKernScoresFile(file, measures);
		}
	});
	request.send();
}



//////////////////////////////
//
// downloadKernScoresFile --
//

function downloadKernScoresFile(file, measures) {
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
			console.log("DATA", request.responseText);
			var inputarea = document.querySelector("#input");
			inputarea.value = request.response;
			displayNotation();
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
	var data = vrvToolkit.getMEI();
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




