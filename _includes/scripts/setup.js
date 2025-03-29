

//////////////////////////////
//
// downloadVerovioToolkit --
//

function downloadVerovioToolkit(use_worker) {
	vrvWorker = new vrvInterface(use_worker, initializeVerovioToolkit);
};



//////////////////////////////
//
// setupAceEditor --
//       https://en.wikipedia.org/wiki/Ace_(editor)
//
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

	// EDITOR.cursorStyle: 'ace', // "ace"|"slim"|"smooth"|"wide"

	// See this webpage to turn of certain ace editor shortcuts:
	// https:github.com//ajaxorg/ace/blob/master/lib/ace/commands/default_commands.js

	// These eat alt-l and alt-shift-l keyboard shortcuts on linux:
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

	// Don't show line at 80 columns:
	EDITOR.setShowPrintMargin(false);

	Range = require("ace/range").Range;

	EDITOR.getSession().selection.on("changeCursor", function(event) {
		if (EditorMode == "esac") {
			var cursorPosition = EDITOR.getCursorPosition();
			if (cursorPosition.row != EditorCursorLine) {
				EditorCursorLine = cursorPosition.row;
				if (!FreezeRendering) {
					displayNotation();
				}
				updateMelodyStartLineForEsac();
			}
		} else {
			highlightNoteInScore(event)
		}
	});

	// Force the cursor to blink when blurred (unfocused):
	// EDITOR.renderer.$cursorLayer.showCursor();
	EDITOR.renderer.$cursorLayer.smoothBlinking = true;
	EDITOR.renderer.$cursorLayer.setBlinking(true);

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

	var cursor = document.querySelector(".ace_content .ace_cursor-layer");
	if (cursor) {
		CURSOR_OBSERVER = new MutationObserver(customCursor);
		CURSOR_OBSERVER.observe(cursor, {attributes: true});
	}

	insertSplashMusic();
}



//////////////////////////////
//
// updateMelodyStartLineForEsac
//

function updateMelodyStartLineForEsac() {
	if (EditorMode !== "esac") {
		clearAllAceMarkers();
	}

	let cursorPosition = EDITOR.getCursorPosition();
	let currentLine = cursorPosition.row;
	let startLine = Math.max(0, currentLine - 50);
	let endLine = Math.min(EDITOR.session.getLength() - 1, currentLine + 50);
	let lines = EDITOR.session.getLines(startLine, endLine + 1);
	let regex = /^[A-Z0-9_-]+\s*$/;

	function findRange(lines, startLine, currentLine, regex) {
		let start = -1;
		let end = -1;

		// Check if the current line matches the regex
		if (regex.test(lines[currentLine - startLine])) {
			start = currentLine; // Set the start line to the current line
		} else {
			// Search backward from current line to find first line matching regex
			for (let i = currentLine - startLine; i >= 0; i--) {
				if (regex.test(lines[i])) {
					start = i + startLine; // Set start to first matching line above cursor
					break;
				}
			}
		}

		// If no start line is found, return early
		//if (start === -1) {
		//	return { start: start, end: end };
		//}

		// Search forward from the line after the start line to find the next line matching the regex
		let startj = 0;
		if (start < 0) {
			for (let j = 0; j < lines.length; j++) {
				if (regex.test(lines[j])) {
					startj = j + 1;
					start = j; // Set to the next
					break;
				}
			}
		}

		for (let j = startj; j < lines.length; j++) {
			if (regex.test(lines[j])) {
				end = (j + startLine) - 1; // Set end to the line before the next matching line
				break;
			}
		}

		// If no next matching line is found, set the end to the last line in the window
		if (end < 0) {
			end = endLine; // Set end to the last line in the window (inclusive)
		}
		if (start < 0) {
			start = 0;
		} 

		return { start: start, end: end };
	}

	clearAllAceMarkers();

	// Find the range of lines to extract within the 50-line window
	let range = findRange(lines, startLine, currentLine, regex);
	// console.log("RANGE START = ", range.start, "RANGE END = ", range.end);

	if (range.start !== -1) {
		addAceEditorMarker(range.start);
	} else {
		console.warn("Cannot find starting line of EsAC data.");
	}
}



//////////////////////////////
//
// addAceEditorMarker --
//

function addAceEditorMarker(line) {
	console.warn("ADDING MARKER TO LINE", line);
	let range = ace.require('ace/range').Range;
	let value = EDITOR.session.addMarker(new range(line, 0, line, 1), "esac-highlight", "fullLine", true);
	EDITOR.renderer.updateFull(); // Forces the editor to refresh/render
	console.error("MARKER RETURN", value);
}



//////////////////////////////
//
// clearAllAceMarks --
//

function clearAllAceMarkers() {
	let markers = EDITOR.session.getMarkers(true);
	for (let markerId in markers) {
		if (markers.hasOwnProperty(markerId)) {
			if (markers[markerId].type === "fullLine") {
				EDITOR.session.removeMarker(markerId);
			}
		}
	}
}



//////////////////////////////
//
// insertSplashMusic --
//

function insertSplashMusic() {
	var splashElement = document.querySelector("#input-splash");
	if (!splashElement) {
		return;
	}
	text = EDITOR.getValue();
	if (!text.match(/^\s*$/)) {
		return;
	}
	var splash = splashElement.textContent;
	setTextInEditor(splash);
}



//////////////////////////////
//
// Setup styling of blurred ace-editor cursor:
//

var CURSOR_OBSERVER;
var CURSOR_DISPLAY;

function customCursor() {
	activeElement = document.activeElement.nodeName;
	let cursor = EDITOR.renderer.$cursorLayer.cursor;
	let cursorstate = null;

	for (let i=0; i<cursor.classList.length; i++) {
		if (cursor.classList[i] == "blurred") {
			cursorstate = "blurred";
			break;
		}
		if (cursor.classList[i] == "focused") {
			cursorstate = "focused";
			break;
		}
	}
	if (activeElement === "TEXTAREA") {
		if (cursorstate != "focused") {
			if (!CURSOR_DISPLAY) {
				CURSOR_DISPLAY = true;
			}
			// console.log("FOCUSING CURSOR");
			cursor.classList.add("focused");
			cursor.classList.remove("blurred");
			EDITOR.renderer.$cursorLayer.setBlinking(true);
			EDITOR.renderer.$cursorLayer.showCursor();
		}
	} else if (CURSOR_DISPLAY) {
		if (cursorstate != "blurred") {
			// console.log("BLURRING CURSOR");
			cursor.classList.add("blurred");
			cursor.classList.remove("focused");
			EDITOR.renderer.$cursorLayer.showCursor();
			EDITOR.renderer.$cursorLayer.setBlinking(true);
		}

	}
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
		Splitter.rightContent = document.querySelector('#output-container');
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
			Splitter.rightContent  = document.querySelector('#output-container');
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

	// process aliases:

	if (!output.k && output.keys) {
		output.k = output.keys;
	} else if (output.k && !output.keys) {
		output.keys = output.k;
	}

	if (!output.t && output.text) {
		output.t = output.text;
	} else if (output.t && !output.text) {
		output.text = output.t;
	}

	if (!output.f && output.file) {
		output.f = output.file;
	} else if (output.f && !output.file) {
		output.file = output.f;
	}

	if (!output.F && output.filter) {
		output.F = output.filter;
	} else if (output.F && !output.filter) {
		output.filter = output.F;
	}

	if (!output.p && output.pitch) {
		output.p = output.pitch;
	} else if (output.p && !output.pitch) {
		output.pitch = output.p;
	}

	if (!output.r && output.rhythm) {
		outpuoutput.r = output.rhythm;
	} else if (output.r && !output.rhythm) {
		output.rhythm = output.r;
	}

	if (!output.i && output.interval) {
		output.i = output.interval;
	} else if (output.i && !output.interval) {
		output.interval = output.i;
	}

	// store the URL anchor as a output parameter
	let hash = location.hash.replace(/^#/, "");
	let matches;

	// store #m parameter
	matches = hash.match(/m(?![a-z])(\d+.*)/);
	if (matches) {
		output.hash_m = matches[1];
	}

	// store #mm parameter
	matches = hash.match(/mm(?![a-z])(\d+.*)/);
	if (matches) {
		output.hash_mm = matches[1];
	}

	// store #mh parameter
	matches = hash.match(/mh(?![a-z])(\d+.*)/);
	if (matches) {
		output.hash_mh = matches[1];
	}

	// store #mmh parameter
	matches = hash.match(/mmh(?![a-z])(\d+.*)/);
	if (matches) {
		output.hash_mmh = matches[1];
	}

	return output;
}



