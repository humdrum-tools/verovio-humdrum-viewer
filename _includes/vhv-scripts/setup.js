

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

	EDITOR.getSession().selection.on("changeCursor", function(event)
		{ highlightNoteInScore(event)});

	// Force the cursor to blink when blurred (unfocused):
	EDITOR.renderer.$cursorLayer.showCursor()

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

	if (!CGI.k && CGI.keys) {
		CGI.k = CGI.keys;
	} else if (CGI.k && !CGI.keys) {
		CGI.keys = CGI.k;
	}

	if (!CGI.t && CGI.text) {
		CGI.t = CGI.text;
	} else if (CGI.t && !CGI.text) {
		CGI.text = CGI.t;
	}

	if (!CGI.f && CGI.file) {
		CGI.f = CGI.file;
	} else if (CGI.f && !CGI.file) {
		CGI.file = CGI.f;
	}

	if (!CGI.F && CGI.filter) {
		CGI.F = CGI.filter;
	} else if (CGI.F && !CGI.filter) {
		CGI.filter = CGI.F;
	}

	if (!CGI.p && CGI.pitch) {
		CGI.p = CGI.pitch;
	} else if (CGI.p && !CGI.pitch) {
		CGI.pitch = CGI.p;
	}

	if (!CGI.r && CGI.rhythm) {
		CGI.r = CGI.rhythm;
	} else if (CGI.r && !CGI.rhythm) {
		CGI.rhythm = CGI.r;
	}

	if (!CGI.i && CGI.interval) {
		CGI.i = CGI.interval;
	} else if (CGI.i && !CGI.interval) {
		CGI.interval = CGI.i;
	}

	return output;
}



