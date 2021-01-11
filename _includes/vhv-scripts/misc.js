

//////////////////////////////
//
// displayNotation -- Convert Humdrum data in textarea to notation.
//  This function seems to be called twice in certain cases (editing).
//

function displayNotation(page, force, restoreid) {
	if (!vrvWorker.initialized || (FreezeRendering && !force)) {
		// console.log("Ignoring displayNotation request: not initialized or frozen");
		return;
	};
	if (COMPILEFILTERAUTOMATIC) {
		COMPILEFILTERAUTOMATIC = false;
		compileFilters();
		return;
	}

	// if input area is a <textarea>, then use .value to access contnets:
	// var inputarea = document.querySelector("#input");
	// var data = inputarea.value;

	var data = getTextFromEditor();
	if (!data) {
		// This could be a transient state of the text editor before
		// new contents is added.
		// console.log("Editor contents is empty");
		return;
	}
	if (data.match(/^\s*$/)) {
		console.log("Editor contents is empty (2)");
		return;
	};
	var options = humdrumToSvgOptions();
	if (data.match(/CUT[[]/)) {
		options.from = "esac";
	};
	if (data.match(/Group memberships:/)) {
		options.from = "musedata";
	};
	if (GLOBALFILTER) {
		data += "\n!!!filter: " + GLOBALFILTER + "\n";
	}
	if (SEARCHFILTER) {
		data += "\n!!!filter: ";
		if (SEARCHCHORDDIRECTION) {
			data += SEARCHCHORDDIRECTION + " | ";
		}
		data += SEARCHFILTER;
		if (BRIEFSEARCHVIEW) {
			data += " | " + BRIEFSEARCHVIEW;
		}
		data += "\n";
	}

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
		verovioCallback(svg);
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

		if (SEARCHFILTER) {
			// extract the filtered Humdrum data from verovio, and
			// pull out the match count from the data and report
			// search toolbar
			vrvWorker.getHumdrum()
			.then(function(humdrumdata) {
				var data = humdrumdata.match(/[^\r\n]+/g);
				var count = 0;
				var matches;
				for (var i=data.length - 1; i > 0; i--) {
					matches = data[i].match(/^!!@MATCHES:\s*(\d+)/);
					if (matches) {
						count = parseInt(matches[1]);
						break;
					}
				}
				console.log("COUNT", count);
				var eresults = document.querySelector("#search-results");
				if (eresults) {
					var output = "";
					if (count == 0) {
						output = "0 matches";
					} else if (count == 1) {
						output = "1 match";
					} else {
						output = count + " matches";
					}
					eresults.innerHTML = output;
					showSearchLinkIcon();
				}
			});
		}
	});
}



//////////////////////////////
//
// processOptions -- Can only handle alphabetic key commands.
//   Also only lower case, but that is easier to fix when there
//   is an uppercase command.  Not needed  anymore?
//

function processOptions() {
	CGI.kInitialized = true;
	if (!CGI.k) {
		return;
	}
// do something here?
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

	var felement = document.querySelector("#text-freeze-icon");
	var output = "";
	if (felement) {
		if (FreezeRendering) {
			// display is frozen so show lock icon
			output = "<div title='Click to unfreeze notation (alt-f)' class='nav-icon fas fa-lock'></div>";
		} else {
			// display is not frozen so show unlock icon
			output = "<div title='Click to freeze notation (alt-f)' class='nav-icon fas fa-unlock'></div>";
		}
		felement.innerHTML = output;
	}

}



//////////////////////////////
//
// toggleTextVisibility --
//

function toggleTextVisibility(suppressZoom) {
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
		displayNotation();
		// applyZoom();
	}
	EDITOR.resize();
	matchToolbarVisibilityIconToState();
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
// hideWorkNavigator --
//

function restoreWorkNavigator(selector) {
	if (!selector) {
		selector = "#work-navigator";
	}
	if (ERASED_WORK_NAVIGATOR.match(/^\s*$/)) {
		return;
	}
	FILEINFO = ERASED_FILEINFO;
	var element = document.querySelector(selector);
	element.innerHTML = ERASED_WORK_NAVIGATOR;
	ERASED_WORK_NAVIGATOR = "";
}



//////////////////////////////
//
// removeWorkNavigator --
//

function removeWorkNavigator(selector) {
	if (!selector) {
		selector = "#work-navigator";
	}
	var element = document.querySelector(selector);
	ERASED_WORK_NAVIGATOR = element.innerHTML;
	ERASED_FILEINFO = FILEINFO;
	element.innerHTML = "";
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
		contents += "<span class='nav-icon fas fa-arrow-circle-left'></span>";
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
		contents += "<span class='nav-icon fas fa-arrow-circle-up'></span>";
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
		contents += "<span class='nav-icon fas fa-arrow-circle-right'></span>";
		contents += "</span>";
	}

	if (FILEINFO["has-index"] == "true") {
		contents += '<span style="padding-left:3px; cursor:pointer" onclick="copyRepertoryUrl(\'';
		contents += FILEINFO['location'];
		contents += "/";
		contents += FILEINFO['file'];
		contents += '\')"';
		contents += " title='copy link for work'";
		contents += ">";
		contents += "<span class='nav-icon fas fa-link'></span>";
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
// copyRepertoryUrl --
//

function copyRepertoryUrl(file) {
	if (!file) {
		if (FILEINFO) {
			file = FILEINFO.location;
			file += "/";
			file += FILEINFO.file;
		}
	}

	var url = "https://verovio.humdrum.org";
	var initialized = 0;

	if (file) {
		url += "/?file=";
		url += file;
		initialized = 1;
	}

	var kstring = "";
	if (!InputVisible) {
		kstring += "ey";
	}

	if (kstring.length > 0) {
		if (!initialized) {
			url += "/?";
			initialized = 1;
		} else {
			url += "&";
		}
		url += "k=" + kstring;
	}
	if (GLOBALFILTER && (GLOBALFILTER.length > 0)) {
		if (!initialized) {
			url += "/?";
			initialized = 1;
		} else {
			url += "&";
		}
		url += "filter=";
		url += encodeURIComponent(GLOBALFILTER);
	}
	if (PQUERY && (PQUERY.length > 0)) {
		if (!initialized) {
			url += "/?";
			initialized = 1;
		} else {
			url += "&";
		}
		url += "p=";
		url += encodeURIComponent(PQUERY);
	}
	if (RQUERY && (RQUERY.length > 0)) {
		if (!initialized) {
			url += "/?";
			initialized = 1;
		} else {
			url += "&";
		}
		url += "r=";
		url += encodeURIComponent(RQUERY);
	}
	if (IQUERY && (IQUERY.length > 0)) {
		if (!initialized) {
			url += "/?";
			initialized = 1;
		} else {
			url += "&";
		}
		url += "i=";
		url += encodeURIComponent(IQUERY);
	}
	copyToClipboard(url);
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
// replaceEditorContentWithHumdrumFile -- If the editor contents is
//    MusicXML, then convert to Humdrum and display in the editor.
//

function replaceEditorContentWithHumdrumFile(text, page) {
	if (!text) {
		text = getTextFromEditor();
	}
	if (!text) {
		console.log("No content to convert to Humdrum");
		return;
	}

	vrvWorker.page = 1;
	page = page || vrvWorker.page;
	var options = null;
	var humdrumQ = false;

	var mode = getMode(text);

	if (text.slice(0, 1000).match(/<score-partwise/)) {
		// MusicXML data
		options = musicxmlToHumdrumOptions();
	} else if (text.slice(0, 2000).match(/Group memberships:/)) {
		// MuseData data
		options = musedataToHumdrumOptions();
	} else if (text.slice(0, 1000).match(/<mei/)) {
		// this is MEI data
		options = meiToHumdrumOptions();
	} else if (text.slice(0, 1000).match(/CUT[[]/)) {
		// EsAC data
		options = esacToHumdrumOptions();
	} else {
		// don't know what it is, but probably Humdrum
		alert("Cannot convert data to Humdrum");
		return;
	}

	if (options) {
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
						setTextInEditor("@@@filter: " + CGI.filter + "\n" + newtext);
					} else if (mode == "xml") {
						// This may cause problems since the "<?xml" processor directive
						// is now not at the start of the data.
						setTextInEditor("<!-- !!!filter: " + CGI.filter + "\n" + newtext);
					} else {
						setTextInEditor("!!!filter: " + CGI.filter + "\n" + newtext);
					}
				} else {
					setTextInEditor(newtext);
				}
				FreezeRendering = freezeBackup;
				displayNotation(page);
			});

		}
	}
}



///////////////////////////////
//
// applyZoom --
//

function applyZoom() {
	// var measure = 0;

	var testing = document.querySelector("#output svg");
	if (!testing) {
		// console.log("NO OUTPUT SVG LOCATION");
		return;
	}

	// if (vrvWorker.page !== 1) {
	// 	measure = $("#output .measure").attr("id");
	// }

	var options = humdrumToSvgOptions();
	OPTIONS = options;
	stop();
	vrvWorker.HEIGHT = options.pageHeight;
	vrvWorker.WIDTH = options.pageWidth;

	vrvWorker.redoLayout(options, 1, vrvWorker.page)
		.then(function() {
			loadPage(vrvWorker.page);
console.log("GOT HERE %%%%%%%%%%%%%%%%%%%%%%%%%%%XXX");
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
		verovioCallback(svg);
		// adjustPageHeight();
		// resizeImage();
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
		setEditorModeAndKeyboard();
		displayHumdrum();
	} else {
		EditorMode = "humdrum";
		setEditorModeAndKeyboard();
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
	vrvWorker.filterData(options, getTextFromEditor(), "humdrum")
	.then(showHumdrum);
}



//////////////////////////////
//
// showHumdrum --
//

function showHumdrum(humdrumdata) {
	if (EditorMode == "musedata") {
		// could implement a key to return to MuseData contents
		MuseDataBuffer = getTextFromEditor();
	}
	setTextInEditor(humdrumdata);
}



//////////////////////////////
//
// getTextFromEditor -- return the content of the text editor,
//    removing any leading space (which will cause confusion in
//    the verovio auto-format detection algorithm).  Trailing
//    space is not removed.
//
// Maybe use for UTF-8, but seems to be working without:
//     btoa(unescape(encodeURIComponent(str))))
//

function getTextFromEditor() {
	var text = EDITOR.getValue();
	if (!text) {
		return "";
	}
	if (text.length < 5) {
		// do not try to unmime if length less than 5 characters
		return text;
	}
	// if the first 100 charcters are only spaces or [A-Za-z0-9/+=], the assume
	// the text is MIME encoded, so decode before returning:
	var starting = text.substring(0, 100);
	if (starting.match(/^[\nA-Za-z0-9/+=]+$/)) {
		try {
			text = atob(text);
		} catch (err) {
			// console.log("text is not mime", text);
			// It is still possible that the text is not
			// MIME data, but it will still be decodeable
			// into junk.
		}
	}
	return text;
}



//////////////////////////////
//
// setTextInEditor -- Sets the text in the editor, remving the last
//   newline in the file to prevent an empty line in the ace editor
//   (the ace editor will add an empty line if the last line of
//   data ends with a newline).  The cursor is moved to the start
//   of the data, but the view is not moved to the start (this is needed
//   for keeping a used filter in view when compiling filters, in
//   particular).  Also the selection of the entire copied data
//   is deselected.
//

function setTextInEditor(text) {
	if (!text) {
		EDITOR.setValue("");
	} else if (text.charAt(text.length-1) === "\n") {
		// Get rid of #@%! empty line at end of text editor:
		EDITOR.setValue(text.slice(0, -1), -1);
	} else {
		EDITOR.setValue(text, -1);
	}
	EDITOR.getSession().selection.clearSelection();
}



//////////////////////////////
//
// getTextFromEditorWithGlobalFilter -- Same as getTextFromEditor(),
//    but with global filter added.
//

function getTextFromEditorWithGlobalFilter(data) {
	if (!data) {
		data = getTextFromEditor();
	}
	// remove leading/trailing spaces:
	data = data.replace(/^\s+/, "").replace(/\s+$/, "");

	// If there is contents in the GLOBALFILTER (handled by the
	// filter toolbar), then include it as the last filter in the file:
	if (GLOBALFILTER) {
		let mode = getMode(data);
		if (mode === "musedata") {
			data += "\n@@@filter: " + GLOBALFILTER + "\n";
		} else if (mode === "humdrum") {
			data += "\n!!!filter: " + GLOBALFILTER + "\n";
		} else {
			// This will not really be useful, however, since
			// MusicXML data get converted directly to MEI
			// when it is in the text editor.
			data += "\n<!-- !!!filter: " + GLOBALFILTER + " -->\n";
		}
		// also consider other data formats such as EsAC
	}

	return data;
}



//////////////////////////////
//
// showMei --
//

function showMei(meidata) {
	if (ShowingIndex) {
		return;
	}
	EditorMode = "xml";
	setEditorModeAndKeyboard();
	if (BufferedHumdrumFile.match(/^\s*$/)) {
		BufferedHumdrumFile = getTextFromEditor();
	}
	displayScoreTextInEditor(meidata, vrvWorker.page);
}



//////////////////////////////
//
// displayMeiNoType --
//

function displayMeiNoType() {
	var options = humdrumToSvgOptions();
	options.humType = 0;
	var text = getTextFromEditor();
	if (GLOBALFILTER) {
		text += "\n!!!filter: " + GLOBALFILTER + "\n";
		detachGlobalFilter();
	}
	vrvWorker.filterData(options, text, "mei")
	.then(function(meidata) {
		detachGlobalFilter();
		showMei(meidata);
	});
}


//////////////////////////////
//
// displayMei --
//

function displayMei() {
	vrvWorker.getMEI()
	.then(function(meidata) {
		detachGlobalFilter();
		showMei(meidata);
	});
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

		verovioCallback(data);
	});
}



//////////////////////////////
//
// displayPdf --
//

function displayPdf() {
	// If a humdrum file has a line starting with
	//     !!!URL-pdf: (https?://[^\s]*)
	// then load that file.
	var loaded = false;
	if (EditorMode === "humdrum") {
		var loaded = displayHumdrumPdf();
	}

	if (loaded) {
		return;
	}

	if (!FILEINFO["has-pdf"]) {
		return;
	}
	if (FILEINFO["has-pdf"] != "true") {
		return;
	}

	var url = "https://kern.humdrum.org/data?l=" + FILEINFO["location"];
	url += "&file=" + FILEINFO["file"];
	url += "&format=pdf&#view=FitH";

	openPdfAtBottomThirdOfScreen(url);
}



//////////////////////////////
//
// displayHumdrumPdf --
//
//         !!!URL-pdf: (https?://[^\s]*)
// If there is a number in the keyboard buffer:
//         !!!URL-pdf[1-9]: (https?://[^\s]*)
// Return value: false if not loaded from reference record
//
//

function displayHumdrumPdf() {
	var urllist = getPdfUrlList();

	var url = "";
	var i;
	if (InterfaceSingleNumber > 1) {
		for (i=0; i<urllist.length; i++) {
			if (urllist[i].number == InterfaceSingleNumber) {
				url = urllist[i].url;
				break;
			}
		}
	} else {
		for (i=0; i<urllist.length; i++) {
			if (urllist[i].number <= 1) {
				url = urllist[i].url;
				break;
			}
		}
	}

	// if the URL is empty but the urls array is not, then
	// select the last url (which is the first URL entry
	// in the file.
	// console.log("URLs:", urls);

	if (url) {
		openPdfAtBottomThirdOfScreen(url);
		return 1;
	} else{
		return 0;
	}
}


//////////////////////////////
//
// getPdfUrlList --
//

function getPdfUrlList() {
	if (EditorMode !== "humdrum") {
		// can't handle MEI mode yet
		return 0;
	}
	var predata = getTextFromEditor();
	if (!predata) {
		return [];
	}
	var data = predata.split(/\r?\n/);
	var refrecords = {};
	var output = [];
	var title = "";

	var query;
	query = '^!!!URL(\\d*)-pdf:\\s*((?:ftp|https?)://[^\\s]+)';
	query += "\\s+(.*)\\s*$";
	var rex = new RegExp(query);

	var references = [];

	var i;
	for (i=0; i<data.length; i++) {
		var line = data[i];
		var matches = line.match(rex);
		if (matches) {
			var obj = {};
			if (!matches[1]) {
				obj.number = -1;
			} else {
				obj.number = parseInt(matches[1]);
			}
			obj.url = matches[2];
			obj.title = matches[3];
			output.push(obj);
		}

		var matches = line.match(/^!!!([^:]+)\s*:\s*(.*)\s*$/);
		if (matches) {
			obj = {};
			obj.key = matches[1];
			obj.value = matches[2];
			if (!refrecords[obj.key]) {
				refrecords[obj.key] = [];
			}
			refrecords[obj.key].push(obj);
		}
	}

	for (var i=0; i<output.length; i++) {
		output[i].title = templateExpansion(output[i].title, refrecords);
	}

	return output;
}



//////////////////////////////
//
// templateExpansion --
//

function templateExpansion(title, records) {
	var matches = title.match(/@{(.*?)}/);
	if (!matches) {
		return title;
	}

	var replacement = getReferenceValue(matches[1], records);
	var rex = new RegExp("@{" + matches[1] + "}", "g");
	title = title.replace(rex, replacement);

	matches = title.match(/@{(.*?)}/);
	while (matches) {
		replacement = getReferenceValue(matches[1], records);
		rex = new RegExp("@{" + matches[1] + "}", "g");
		title = title.replace(rex, replacement);

		matches = title.match(/@{(.*?)}/);
	}

	return title;
}



//////////////////////////////
//
// getReferenceValue -- return the (first) reference record
//    value for the given key.
//

function getReferenceValue(key, records) {
	var entry  = records[key];
	if (!entry) {
		return "";
	}

	return entry[0].value;
}



//////////////////////////////
//
// openPdfAtBottomThirdOfScreen --
//
// Reference: https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf
//

function openPdfAtBottomThirdOfScreen(url, keepfocus) {
	if (!url) {
		return;
	}

	console.log("Loading URL", url);
	var features = "left=0";
	features += ",top=" + parseInt(screen.height * 2 / 3);
	features += ",width=" + screen.width;
	features += ",height=" + parseInt(screen.height / 3);
	features += ",resizeable";
	features += ",scrollbars";
	features += ",location=false";
	var wpdf = window.open(url, "", features);

	if (!keepfocus) {
		if (window.focus) {
			wpdf.focus();
		}
	}
}



//////////////////////////////
//
// reloadData -- Expand later to work with other input URIs.
//

function reloadData() {
	// delete all sessionStorage keys starting with "basket-"
	for (var key in sessionStorage) {
		if (sessionStorage.hasOwnProperty(key) && /^basket-/.test(key)) {
			console.log("DELETING", key);
			delete sessionStorage[key];
		}
	}

	if (CGI && CGI.file) {
		// Reload from URL file parameter if this method was used.
		// (Don't know if a different work was loaded differently, however).
		var basket = "basket-" + CGI.file;
		if (CGI.mm) {
			basket += "&mm=" + CGI.mm;
		}
		sessionStorage.removeItem(basket);
		loadKernScoresFile({
			file:     CGI.file,
			measures: CGI.mm,
			previous: false,
			next:     false
		}, true);
	} else {
		// (assume) reload a repertory score
		console.log("Don't know what to reload");
	}
}





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

	// $(window).resize(function() { applyZoom(); });
	$(window).resize(function() { displayNotation(); });

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
	var id = target.id;
	var matches;
	var regex;
	var range;
	var searchstring;

	while (target) {
		if (!target.id) {
			target = target.parentNode;
			continue;
		}
		var id = target.id;
		// if (!id.match(/-L\d+F\d+/)) {
		if (!id) {
			target = target.parentNode;
			continue;
		}
		if (!id.match(/-L\d+F\d+/)) {
			// find non-humdrum ID.
			searchstring = 'xml:id="' + target.id + '"';
			regex = new RegExp(searchstring);
			range = EDITOR.find(regex, {
				wrap: true,
				caseSensitive: true,
				wholeWord: true
			});
			break;
		}
		// still need to verify if inside of svg element in the first place.
		searchstring = 'xml:id="' + target.id + '"';
		regex = new RegExp(searchstring);
		range = EDITOR.find(regex, {
			wrap: true,
			caseSensitive: true,
			wholeWord: true
		});
		break; // assume that the first formatted id found is valid.
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
// displayScoreTextInEditor --
//

function displayScoreTextInEditor(text, page) {
	var mode = getMode(text);

	if (mode != EditorMode) {
		EditorMode = mode;
		setEditorModeAndKeyboard();
	};

	// -1 is to unselect added text, and move cursor to start
	setTextInEditor(text);

	// update the notation display
	displayNotation(page);
}



//////////////////////////////
//
// toggleHumdrumCsvTsv --
//

function toggleHumdrumCsvTsv() {
	if (EditorMode == "xml") {
		// not editing Humdrum data
		return;
	}
	var data = getTextFromEditor()
	var lines = data.split("\n");
	for (var i=0; i<lines.length; i++) {
		if (lines[i].match(/^\*\*/)) {
			if (lines[i].match(/,/)) {
				console.log("CONVERTING TO TSV");
				setTextInEditor(convertDataToTsv(lines));
			} else {
				console.log("CONVERTING TO CSV");
				setTextInEditor(convertDataToCsv(lines));
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
// clearContent -- Used by the alt-e option or the erase button
// in the main toolbar.
//

function clearContent() {
	var data = getTextFromEditor();
	if (data.match(/^\s*$/)) {
		// restore the text (which may have accidentally been erased)
		setTextInEditor(ERASED_DATA);
		displayFileTitle(ERASED_DATA);
		restoreWorkNavigator();
		// The left/right arrows are still active for navigating to
		// other works in the repertory.
	} else {
		// Erase the text, but store it in a buffer in case
		// the user wants to recall it if the editor is still empty.
		ERASED_DATA = data;
		var element
		setTextInEditor("");
		var output = document.querySelector("#output");
		if (output) {
			output.innerHTML = "";
		}
		displayFileTitle("");
		removeWorkNavigator();
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
// setCursorNote --
//

function setCursorNote(item, location) {
	CursorNote = item;
	MENU.showCursorNoteMenu(CursorNote);
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
// updateEditorMode -- Automatically detect the type of data and change edit mode:
//

function updateEditorMode() {
	if (!EDITOR) {
		return;
	}
	var text = getTextFromEditor();
	if (!text) {
		// This check is needed to prevent intermediate
		// states when the editor has been cleared in preparation
		// for new contents.
		// console.log("EDITOR IS EMPTY");
		return;
	}
	var shorttext = text.substring(0, 2000);
	var xmod = getMode(shorttext);
	if (xmod !== EditorMode) {
		EditorMode = xmod;
		setEditorModeAndKeyboard();
		console.log("Changing to", xmod, "mode.");
	}
}



//////////////////////////////
//
// nextPageClick -- this is a click event for the next page.  If the shift key is
//     pressed, go to the last page instead of the next page.
//

function nextPageClick(event) {
	if (!event) {
		MENU.goToNextPage(event)
	}
	if (event.shiftKey) {
		MENU.goToLastPage(event)
	} else {
		MENU.goToNextPage(event)
	}
}



//////////////////////////////
//
// previousPageClick -- this is a click event for the previous page.
//     If the shift key is pressed, go to the last page instead of
//     the next page.
//

function previousPageClick(event) {
	if (!event) {
		MENU.goToPreviousPage(event)
	}
	if (event.shiftKey) {
		MENU.goToFirstPage(event)
	} else {
		MENU.goToPreviousPage(event)
	}
}



//////////////////////////////
//
// copyToClipboard --
//

function copyToClipboard(string) {
	// console.log("Copying", string, "to clipboard");
	var element = document.createElement("textarea");
	element.value = string;
	document.body.appendChild(element);
	element.select();
	document.execCommand("copy");
	document.body.removeChild(element);
};



//////////////////////////////
//
// dataHasLineBreaks --
//

function dataHasLineBreaks(data) {
	if (!data) {
		data = getTextFromEditor();
	}
// do something here ggg
}




//////////////////////////////
//
// removeLastLineInTextEditorIfMatches -- Remove the last non-empty line
//    in the text editor if it matches the given input string.  This function
//    is used by compileFilters() to remove the used GLOBALFILTER.
//

function removeLastLineInTextEditorIfMatches(line) {
	if (!line) {
		return;
	}
	let text = getTextFromEditor();
	if (!text) {
		return;
	}
	let lines = text.replace(/^\s+/, "").replace(/\s+$/, "").split(/\r?\n/);

	let deleteindex = -1;
	for (let i=lines.length-1; i>=0; i--) {
		if (lines[i].match(/^\s*$/)) {
			continue;
		}
		if (lines[i] === line) {
			deleteindex = i;
			// also delete #@%! empty lines before the delete line
			for (let j=deleteindex-1; j<=0; j--) {
				if (lines[j].match(/^\s*$/)) {
					deleteindex--;
					continue;
				}
				break;
			}
			break;
		}
		break;
	}

	if (deleteindex < 0) {
		retrun;
	}

	let newtext = "";
	for (let i=0; i<deleteindex; i++) {
		newtext += lines[i] + "\n";
	}

	setTextInEditor(newtext);
}



