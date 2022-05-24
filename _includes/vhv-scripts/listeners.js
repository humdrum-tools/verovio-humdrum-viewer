//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Wed May  4 00:27:30 PDT 2022
// Filename:       listeners.js
// Web Address:    https://verovio.humdrum.org/listeners.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Event listeners and related code for index.html.
//

var PDFLISTINTERVAL = null;
var EVENNOTESPACING = false;
var HIDEINITIALTOOLBAR = false;
var HIDEMENUANDTOOLBAR = false;
var HIDEMENU = false;
var TOOLBAR = null;  // used to select the toolbar from URL toolbar parameter.
var LASTTOOLBAR = 1;
if (localStorage.LASTTOOLBAR) {
	LASTTOOLBAR = parseInt(localStorage.LASTTOOLBAR);
}
if (localStorage.FONT) {
	FONT = cleanFont(localStorage.FONT);

}
var INITIALMEI = false;  // used to show MEI conversion on load
var PQUERY = "";
var IQUERY = "";
var RQUERY = "";
// The search toolbar is currently the 4th one.  This variable
// will need to be updated if that changes...
var SEARCHTOOLBAR = 4;

//////////////////////////////
//
// highlighting options --
//

MARKUP = new HnpMarkup();


//////////////////////////////
//
// DomContentLoaded event listener -- Display the sample data.
//

document.addEventListener("DOMContentLoaded", function() {
	loadEditorFontSizes();
	var inputElement = document.querySelector("#input");
	if (inputElement) {
			inputElement.style.fontSize = INPUT_FONT_SIZE + "rem";
	}

	// EditorMode = "humdrum";
	EditorMode = "humdrum";
	setEditorModeAndKeyboard();

	CGI = GetCgiParameters();

	// Set up any music searching parameters from CGI.
	// If there are any, then set the search toolbar to be visible,
	// overriding any previous toolbar state from the previous session.
	if (CGI.p) {
		PQUERY = CGI.p || "";
		LASTTOOLBAR = SEARCHTOOLBAR;
	}
	if (CGI.i) {
		IQUERY = CGI.i || "";
		LASTTOOLBAR = SEARCHTOOLBAR;
	}
	if (CGI.r) {
		RQUERY = CGI.r || "";
		LASTTOOLBAR = SEARCHTOOLBAR;
	}

	if (!PQUERY.match(/^\s*$/) || !IQUERY.match(/^\s*$/) || !RQUERY.match(/^\s*$/)) {
		// Set up the search for initial display of music.  The searches will be
		// loaded into the search toolbar as well.
		SEARCHFILTER = buildSearchQueryFilter({
			pitch:    PQUERY,
			interval: IQUERY,
			rhythm:   RQUERY
		});
	}
	if (CGI.t) {
		if (!CGI.k) {
			CGI.k = "e";
		} else {
			CGI.k += "e";
		}
	}
	if (CGI.k) {
		if (CGI.k.match(/e/)) {
			var input = document.querySelector("#input");
			if (input) {
				input.innerHTML = "";
			}
			localStorage.setItem("AUTOSAVE", "");
			localStorage.setItem("AUTOSAVE_DATE", 0);
		}
	}
	if (CGI.font) {
		FONT = cleanFont(CGI.font);
	}

	var ctime = (new Date).getTime();
	var otime = localStorage.getItem("AUTOSAVE_DATE");
	var dur = ctime - otime;
	var encodedcontents = localStorage.getItem("AUTOSAVE");
	var autosave = decodeURIComponent(encodedcontents);
	if (!autosave) {
		autosave = "";
	}
	if ((!autosave.match(/^\s*$/)) && (dur < 60000)) {
		var input = document.querySelector("#input");
		if (input) {
			input.textContent = autosave;
		}
	}

	setupAceEditor("input");
	setupDropArea();

	if (CGI.toolbar) {
		TOOLBAR = CGI.toolbar;
	} else if (CGI.tb) {
		TOOLBAR = CGI.tb;
	}

	if (CGI.size) {
		SCALE = getScaleFromPercentSize(CGI.size);
	} else if (CGI.sz) {
		SCALE = getScaleFromPercentSize(CGI.sz);
	}

	if (CGI.k) {
		if (CGI.k.match(/y/)) {
			toggleTextVisibility(true);
		}
		if (CGI.k.match(/b/)) {
			toggleVhvTitle();
		}
		if (CGI.k.match(/B/)) {
			HIDEINITIALTOOLBAR = true;
		}
		if (CGI.k.match(/m/)) {
				toggleTextVisibility(true);
				INITIALMEI = true;
				// displayMeiNoType();
		}
		if (CGI.k.match(/E/)) {
			HIDEMENUANDTOOLBAR = true;
		}
		if (CGI.k.match(/d/)) {
			HIDEMENU = true;
		}
		if (CGI.k.match(/l/)) {
			// Presumed to be off at initialization of the page.
			toggleLayerColoring();
		}
		if (CGI.k.match(/p/)) {
			PAGED = true;
		}

		var wcount = 0;
		for (var i=0; i<CGI.k.length; i++) {
			if (CGI.k.charAt(i) === "w") {
				SPACINGADJUSTMENT += 0.05;
			} else if (CGI.k.charAt(i) === "W") {
				SPACINGADJUSTMENT -= 0.05;
			}
		}

		if (CGI.k.match(/m/)) {
			// start in MEI mode
			EditorMode = "xml";
			setEditorModeAndKeyboard();
			if (!CGI.k.match(/e/)) {
				displayMeiNoType();
			}
		}
	}

	if (CGI.filter) {
		GLOBALFILTER = CGI.filter;
	}

	if (CGI.file || CGI.tasso || CGI.jrp || CGI.bb || CGI.bitbucket || CGI.gh || CGI.github || CGI.poly) {
		loadKernScoresFile(
			{
				file: CGI.file,
				tasso: CGI.tasso,
				poly: CGI.poly,
				jrp: CGI.jrp,
				bitbucket: CGI.bitbucket,
				bb: CGI.bb,
				github: CGI.github,
				gh: CGI.gh,
				measures: CGI.mm,
				next: true,
				previous: true
			}
		);
	} else {
		if (CGI.t) {
			var text = CGI.t;
			if (text.match(/\*kern/)) {
				// do nothing
			} else if (text.match(/\*mens/)) {
				// do nothing
			} else if (text.match(/<xml/)) {
				// do nothing
			} else {
				// presumably MIME data, so decode
				// will have to deal with embedded UTF-8 probably.
				try {
					// text = atob(text);
					text = Base64.decode(text);
				} catch (err) {
					// text is not MIME encoded
					console.error("INPUT TEXT IS NOT MIME ENCODED");
				}
			}
			setTextInEditor(text);
		}
		displayNotation();
	}

	setupSplitter();

	// set init (default) state
	$("#input").data('x', $("#input").outerWidth());
	$("#input").data('y', $("#input").outerHeight());

{% if site.local != "true" %}
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-82554203-1', 'auto');
  ga('send', 'pageview');
{% endif %}

	var body = document.querySelector("body");
	body.addEventListener("click", function(event) {
		// console.log("SINGLE CLICK", event);
		// turnOffAllHighlights();
		var insvg = inSvgImage(event.target);
		if (inSvgImage(event.target)) {
		   dataIntoView(event);
		}
	});
	body.addEventListener("dblclick", function(event) {
		// console.log("DOUBLE CLICK");
		processClickForIiif(event);
	});

	window.addEventListener("keydown", processNotationKeyCommand, true);
	window.addEventListener("keydown", processInterfaceKeyCommand);

	observeSvgContent();

	PDFLISTINTERVAL = setInterval(function() {
		buildPdfIconListInMenu();
		buildScanIconListInMenu();
	}, 3000);

});



//////////////////////////////
//
// keydown event listener -- Notation editor listener.
//

function processNotationKeyCommand(event) {
	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	// only works outside of the editor.
	if (event.altKey || event.target.nodeName == "TEXTAREA") {
		return;
	}
	if (document.activeElement.nodeName == "INPUT") {
		// needed to suppress key commands when running vim command
		return;
	}

	//undo doesn't need CursorNote
	if (event.code === KEYS.ZKey && (event.ctrlKey || event.metaKey)) {
		EDITOR.undo();
		return;
	};

	if (!CursorNote) {
		return;
	}
	if (!CursorNote.id) {
		return;
	}

	let inputKey = GetKey(event);

	switch (inputKey) {
		case KEYS.AKey:
			processNotationKey("a", CursorNote);
			break;

		case KEYS.BKey:
			processNotationKey("b", CursorNote);
			break;

		case KEYS.CKey:
			processNotationKey("c", CursorNote);
			break;

		case KEYS.DKey:
			if (event.shiftKey) {
				processNotationKey("D", CursorNote);
			}
			break;

		// case KEYS.EKey:

		case KEYS.FKey:
			processNotationKey("f", CursorNote);
			break;

		// case KEYS.GKey:
		// case KEYS.HKey:

		case KEYS.IKey:
			processNotationKey("i", CursorNote);
			break;

		case KEYS.JKey:
			if (event.shiftKey) {
				processNotationKey("J", CursorNote);
			}
			break;

		// case KEYS.KKey:

		case KEYS.LKey:
			if (event.shiftKey) {
				processNotationKey("L", CursorNote);
			}
			break;

		case KEYS.MKey:
			if (event.shiftKey) {
				processNotationKey("M", CursorNote);
			} else {
				processNotationKey("m", CursorNote);
			}
			break;

		case KEYS.NKey:
			processNotationKey("n", CursorNote);
			break;

		// case KEYS.OKey:

		case KEYS.PKey:
			if (event.shiftKey) {
				processNotationKey("P", CursorNote);
			} else {
				processNotationKey("p", CursorNote);
			}
			break;

		case KEYS.QKey:
			processNotationKey("q", CursorNote);
			break;

		// case KEYS.RKey:

		case KEYS.SKey:
			processNotationKey("s", CursorNote);
			break;

		case KEYS.TKey:
			if (event.shiftKey) {
				processNotationKey("T", CursorNote);
			} else {
				processNotationKey("t", CursorNote);
			}
			break;

		// case KEYS.UKey:

		case KEYS.VKey:
			if (CursorNote.id.match("note-")) {
				processNotationKey("^", CursorNote);
			}
			break;

		case KEYS.WKey:
			if (event.shiftKey) {
				processNotationKey("W", CursorNote);
			} else {
				processNotationKey("w", CursorNote);
			}
			break;

		case KEYS.XKey:
			processNotationKey("X", CursorNote);
			break;

		case KEYS.YKey:
			processNotationKey("y", CursorNote);
			break;

		// case KEYS.ZKey:

		case KEYS.OneKey:
			processNotationKey("1", CursorNote);
			break;

		case KEYS.TwoKey:
			if (event.shiftKey) {
				processNotationKey("@", CursorNote);
			} else {
				processNotationKey("2", CursorNote);
			}
			break;

		case KEYS.ThreeKey:
			if (event.shiftKey) {
				processNotationKey("#", CursorNote);
			} else {
				processNotationKey("3", CursorNote);
			}
			break;

		case KEYS.FourKey:
			processNotationKey("4", CursorNote);
			break;

		case KEYS.FiveKey:
			processNotationKey("5", CursorNote);
			break;

		case KEYS.SixKey:
			if (CursorNote.id.match("note-")) {
				if (event.shiftKey) {
					processNotationKey("^^", CursorNote);
				} else {
					processNotationKey("6", CursorNote);
				}
			} else {
				processNotationKey("6", CursorNote);
			}
			break;

		case KEYS.SevenKey:
			processNotationKey("7", CursorNote);
			break;

		case KEYS.EightKey:
			processNotationKey("8", CursorNote);
			break;

		case KEYS.NineKey:
			processNotationKey("9", CursorNote);
			break;

		case KEYS.MinusKey:
			processNotationKey("-", CursorNote);
			break;

		case KEYS.SingleQuoteKey:
			processNotationKey("'", CursorNote);
			break;

		case KEYS.SemiColonKey:
			if (event.shiftKey) {
				processNotationKey(":", CursorNote);
			} else {
				processNotationKey(";", CursorNote);
			}
			break;

		case KEYS.BackQuoteKey:
			if (event.shiftKey) {
				processNotationKey("~", CursorNote);
			} else {
				processNotationKey("`", CursorNote);
			}
			break;

		case KEYS.UpKey:
			if (event.shiftKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-up-step", CursorNote);
				}
			} else if (event.ctrlKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-up-octave", CursorNote);
				}
			} else {
				event.preventDefault();
				event.stopPropagation();
				goUpHarmonically(CursorNote);
			}
			break;

		case KEYS.DownKey:
			if (event.shiftKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-down-step", CursorNote);
				}
			} else if (event.ctrlKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-down-octave", CursorNote);
				}
			} else {
				event.preventDefault();
				event.stopPropagation();
				goDownHarmonically(CursorNote);
			}
			break;

		case KEYS.DeleteKey:
		case KEYS.BackKey:
			processNotationKey("delete", CursorNote);
			event.stopPropagation();
			break;

		case KEYS.LeftKey:
			if (CursorNote.id.match("slur-")) {
				event.preventDefault();
				event.stopPropagation();
				if (event.shiftKey) {
					processNotationKey("rightEndMoveBack", CursorNote);
				} else {
					processNotationKey("leftEndMoveBack", CursorNote);
				}
			} else {
				// move one note to the left
				event.preventDefault();
				event.stopPropagation();
				goToPreviousNoteOrRest(CursorNote.id);
			}
			break;

		case KEYS.RightKey:
			if (CursorNote.id.match("slur-")) {
				event.preventDefault();
				event.stopPropagation();
				if (event.shiftKey) {
					processNotationKey("rightEndMoveForward", CursorNote);
				} else {
					processNotationKey("leftEndMoveForward", CursorNote);
				}
			} else {
				// move one note to the right
				event.preventDefault();
				event.stopPropagation();
				goToNextNoteOrRest(CursorNote.id);
			}
			break;

		case KEYS.EscKey:
			event.preventDefault();
			event.stopPropagation();
			processNotationKey("esc", CursorNote);
			break;

	}
}



//////////////////////////////
//
// keydown event listener -- Interface control listener.
//

function processInterfaceKeyCommand(event) {

	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	if ((!event.altKey) && (event.target.nodeName == "TEXTAREA")) {
		// needed to prevent key commands when editing text
		return;
	}
	if ((!event.altKey) && (document.activeElement.nodeName == "INPUT")) {
		// needed to prevent key commands when running vim command
		return;
	}

	if (event.metaKey) {
		// usually ignore metaKey unless 0:
		if (event.code == KEYS.ZeroKey) {
			MENU.resetTextFontSize();
			SCALE = 40;
			localStorage.SCALE = SCALE;
			displayNotation();
			// not preventingDefault so that web browser can reset size as well.
		}
		return;
	}

	let inputKey = GetKey(event);

	switch (inputKey) {
		case KEYS.AKey:          // UNUSED
			if (event.altKey) {
				if (event.shiftKey) {
					// toggle display of toolbar
					toggleNavigationToolbar();
				} else {
					// toggle display of banner
					toggleVhvTitle();
				}
				event.preventDefault();
			}
			break;

		case KEYS.BKey:
			if (event.altKey) {
				if (event.shiftKey) {
					if (event.ctrlKey) {
						addInvisibleBarlineAboveCurrentPosition();
					} else {
						addBarlineAboveCurrentPosition();
					}
					event.preventDefault();
				} else {
					toggleVhvTitle();
				}
			}
			break;

		case KEYS.CKey:
			if (event.altKey) {
				if (event.shiftKey) {
					togglePlaceColoring();
				} else {
					// compile filtered contents & display in text editor
					compileFilters();
				}
				event.preventDefault();
			}
			break;

		case KEYS.DKey:          // Add null data line
			if (event.altKey) {
				if (event.shiftKey) {
					addDataLineAboveCurrentPosition();
				} else {
					toggleMenuDisplay();
				}
				event.preventDefault();
			}
			break;

		case KEYS.EKey:          // erase text editor contents or Tooggle display of menu with shift key.
			if (event.altKey) {
				if (event.shiftKey) {
					toggleMenuAndToolbarDisplay();
				} else {
					clearContent();
				}
				event.preventDefault();
			}
			break;

		case KEYS.FKey:          // toogle notation update freezing
			if (event.altKey) {
				if (event.shiftKey) {
					displayNotation(false, true);
				} else {
					toggleFreeze();
				}
				event.preventDefault();
			}
			break;

		case KEYS.GKey:          // save current view to SVG image
			if (event.altKey) {
				// displaySvg();
				saveSvgData();
				event.preventDefault();
			}
			break;

		case KEYS.HKey:          // show Humdrum data in text editor
			if (event.altKey) {
				if (!ShowingIndex) {
					showBufferedHumdrumData();
					event.preventDefault();
				}
			}
			break;

		case KEYS.IKey:          // Add null interpretation line
			if (event.altKey) {
				if (event.shiftKey) {
					addInterpretationLineAboveCurrentPosition();
					event.preventDefault();
				}
			}
			break;

		case KEYS.JKey:          // UNUSED
			break;

		case KEYS.KKey:          // UNUSED
			break;

		case KEYS.LKey:          // toggle color of staff layers
			if (event.altKey) {
				if (event.shiftKey) {
					addLocalCommentLineAboveCurrentPosition();
				} else {
					toggleLayerColoring();
				}
				event.preventDefault();
			}
			break;

	 	case KEYS.MKey:          // show MEI data in text editor
			if (event.altKey) {
				EditorMode = "xml";
				if (event.shiftKey) {
					// display with @type data
					displayMei();
				} else {
					// display without @type data
					displayMeiNoType();
				}
				event.preventDefault();
			}
			break;

	 	case KEYS.NKey:          // toggle display of navigation toolbar
			if (event.altKey) {
				if (event.ctrlKey) {
					toggleNavigationToolbar();
				} else if (event.shiftKey) {
					gotoPrevToolbarDelta();
				} else {
					chooseToolbarMenu();
				}
				event.preventDefault();
			}
			break;

		case KEYS.OKey:          // toggle display of *oclef data
			if (event.altKey) {
				OriginalClef = !OriginalClef;
				console.log("Original clef changed to:", OriginalClef);
				if (!ShowingIndex) {
					displayNotation();
				}
				event.preventDefault();
			}
			break;

		case KEYS.PKey:          // show PDF in separate window
			if (event.altKey) {
				displayPdf();
				event.preventDefault();
			}
			break;

		case KEYS.QKey:          // toggle coloring of appoggiaturas
			if (event.altKey) {
				if (event.shiftKey) {
					// do nothing
				} else {
					toggleAppoggiaturaColoring();
				}
				event.preventDefault();
			}
			break;

		case KEYS.RKey:          // reload Humdrum data from server
			if (event.altKey) {
				if (event.shiftKey) {
					restoreEditorContentsLocally();
					event.preventDefault();
				} else {
					reloadData();
					event.preventDefault();
				}
			}
			break;

		case KEYS.SKey:          // save contents of text editor to file
			if (event.altKey) {
				if (event.shiftKey) {
					saveEditorContentsLocally();
					event.preventDefault();
				} else {
					saveEditorContents();
					event.preventDefault();
				}
			}
			break;

		case KEYS.TKey:          // save PDF file
			// Needed functions are defined in _includes/pdfkit.html
			if (event.altKey) {
				if (event.shiftKey) {
					generatePdfSnapshot();
				} else {
					generatePdfFull();
				}
				event.preventDefault();
			}
			break;

		case KEYS.UKey:              // toggle TSV/CSV display of Humdrum data
			if (event.shiftKey) {
				decreaseTab();
				event.preventDefault();
			} else {
				toggleHumdrumCsvTsv();
				event.preventDefault();
			}
			break;

		case KEYS.VKey:          // toggle vi mode in text editor
			if (event.altKey) {
				toggleEditorMode();
				event.preventDefault();
			}
			break;

	 	case KEYS.WKey:          // adjust notation width parameter
			if (event.altKey) {
				if (event.shiftKey) {
					SPACINGADJUSTMENT -= 0.02;
				} else if (event.ctrlKey) {
					EVENNOTESPACING = !EVENNOTESPACING;
				} else {
					SPACINGADJUSTMENT += 0.02;
				}
				if (SPACINGADJUSTMENT <= 0.0) {
					SPACINGADJUSTMENT = 0.0;
				}
				event.preventDefault();
				displayNotation();
			}
			break;

		case KEYS.XKey:          // UNUSED
			break;

		case KEYS.YKey:          // show/hide text editor
			if (event.altKey) {
				if (!ShowingIndex) {
					toggleTextVisibility();
				}
				event.preventDefault();
			}
			break;

/*		case KEYS.ZKey:  // use undo key from OS/browser
			if (event.ctrlKey || event.metaKey) {
				EDITOR.undo();
			};
			break;
*/

		case KEYS.ZeroKey:  InterfaceSingleNumber = 0; break;
		case KEYS.OneKey:   InterfaceSingleNumber = 1; break;
		case KEYS.TwoKey:   InterfaceSingleNumber = 2; break;
		case KEYS.ThreeKey: InterfaceSingleNumber = 3; break;
		case KEYS.FourKey:  InterfaceSingleNumber = 4; break;
		case KEYS.FiveKey:  InterfaceSingleNumber = 5; break;
		case KEYS.SixKey:   InterfaceSingleNumber = 6; break;
		case KEYS.SevenKey: InterfaceSingleNumber = 7; break;
		case KEYS.EightKey: InterfaceSingleNumber = 8; break;
		case KEYS.NineKey:  InterfaceSingleNumber = 9; break;

		case KEYS.SpaceKey:          // start/pause MIDI playback
			if (!PLAY) {
				if (PAUSE) {
					play();
					PLAY = true;
					PAUSE = false;
				} else {
					playCurrentMidi();
					PLAY = true;
					PAUSE = false;
				}
			} else {
				PLAY = false;
				PAUSE = true;
				pause();
			}
			event.preventDefault();
			break;

		case KEYS.CommaKey:     // toggle TSV/CSV display of Humdrum data
		                        // decrease tab size in editor
			// See UKey for relocation of comma-command for
			// (related to non-US keyboard layout)
			if (event.shiftKey) {
				decreaseTab();
				event.preventDefault();
			} else {
				//toggleHumdrumCsvTsv();
				//event.preventDefault();
			}
			break;

		case KEYS.DotKey:          // increase tab size in editor
			if (event.shiftKey) {
				increaseTab();
				event.preventDefault();
			}
			break;

		case KEYS.UpKey:          // return to repertory index
			if (event.shiftKey) {
				if (FILEINFO["has-index"] == "true") {
					displayIndex(FILEINFO["location"]);
				}
			}
			event.preventDefault();
			break;

		case KEYS.PgUpKey:          // shift: go to previous repertory work/movement
		case KEYS.LeftKey:          // go to previous page
			if (event.shiftKey) {
				displayWork(FILEINFO["previous-work"]);
			} else {
				gotoPreviousPage();
			}
			event.preventDefault();
			break;

		case KEYS.PgDnKey:          // shift: go to next repertory work/movement
		case KEYS.RightKey:         // go to next page
			if (event.shiftKey) {
				displayWork(FILEINFO["next-work"]);
			} else {
				gotoNextPage();
			}
			event.preventDefault();
			break;

		case KEYS.HomeKey:          // go to the first page
			gotoFirstPage();
			event.preventDefault();
			break;

		case KEYS.EndKey:          // go to the last page
			gotoLastPage();
			event.preventDefault();
			break;

		case KEYS.SlashKey:          // toggle menu display (to be implemented)
			if (event.shiftKey) {
				event.preventDefault();
			}
			break;

		case KEYS.EscKey:
			hideRepertoryIndex();
			event.preventDefault();
			break;

	}
}



//////////////////////////////
//
// beforeunload event -- save the text editor's content when exiting the window.
//     This is useful if the window is left by accident, and allows the user
//     to recover their data by loading VHV again within 24 hours.
//

window.addEventListener("beforeunload", function (event) {
	var encodedcontents = encodeURIComponent(getTextFromEditorRaw());
	localStorage.setItem("AUTOSAVE", encodedcontents);
	localStorage.setItem("AUTOSAVE_DATE", (new Date).getTime());
	localStorage.setItem("FONT", FONT);
});



//////////////////////////////
//
// Autosave feature:  Save the contents of the editor every 60 seconds to
//   local storage ("SAVE0")  Which can be recalled by typing 0 shift-R
//   within one minute after reloading the VHV website.
//

setInterval(function() { 
	localStorage.setItem("SAVE0", encodeURIComponent(getTextFromEditorRaw())); 
}, 60000);


// needed for startup, but not afterwards, so adjust later:
setInterval(function() { updateEditorMode(); }, 1000);



//////////////////////////////
//
// verovioCallback -- Function that is run after SVG data is calcualted
//     by verovio.
//

function verovioCallback(data) {
	console.log("SVG updated");
	if (GOTOTOPOFNOTATION) {
		GOTOTOPOFNOTATION = false;
		let scroller = document.querySelector("#output");
		if (scroller) {
			scroller.scrollTo(0, 0);
		}
	}
	MARKUP.loadSvg("svg");
	processMesaureHash();

	// When first loading VHV, if the "m" keyboard shortcut
	// is given in CGI.k, then convert the score in the text
	// editor to MEI:
	if (INITIALMEI) {
		EditorMode = "xml";
		displayMeiNoType();
		toggleTextVisibility(true);
		INITIALMEI = false;
	}

}



