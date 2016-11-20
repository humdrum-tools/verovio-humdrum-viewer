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

//////////////////////////////
//
// DomContentLoaded event listener -- Display the sample data.
//

document.addEventListener("DOMContentLoaded", function() {
	downloadVerovioToolkit('http://verovio-script.humdrum.org/scripts/verovio-toolkit.js');
	setupAceEditor("input");

	allowTabs();
	setupDropArea();

   prepareHelpMenu('#help-container');

	CGI = GetCgiParameters();

	if (CGI.k && CGI.k.match(/h/)) {
		toggleInputArea(true);
	}

	if (CGI.file || CGI.tasso || CGI.jrp) {
		loadKernScoresFile(
			{
				file: CGI.file, 
				tasso: CGI.tasso,
				jrp: CGI.jrp,
				measures: CGI.mm,
				next: true,
				previous: true
			}
		);
	} else {
		displayNotation();
	}

	setupSplitter();

	// set init (default) state
	$("#input").data('x', $("#input").outerWidth());
	$("#input").data('y', $("#input").outerHeight());

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-82554203-1', 'auto');
  ga('send', 'pageview');

	var body = document.querySelector("body");
	body.addEventListener("click", function(event) {
		dataIntoView(event);
	});

});


//////////////////////////////
//
// keydown event listener -- Notation edition listener.
//

window.addEventListener("keydown", processNotationKeyCommand);

function processNotationKeyCommand(event) {
	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	// only works outside of the editor.
	if (event.altKey || event.target.nodeName == "TEXTAREA") {
		return;
	}

	switch (event.keyCode) {
		case IKey:
			processNotationKey("i", CursorNote);
			break;
		case SKey:
			processNotationKey("s", CursorNote);
			break;
		case FKey:
			processNotationKey("f", CursorNote);
			break;
		case NKey:
			processNotationKey("n", CursorNote);
			break;
	}
}


//////////////////////////////
//
// keydown event listener -- Interface control listener.
//

window.addEventListener("keydown", processInterfaceKeyCommand);

function processInterfaceKeyCommand(event) {
	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	if (!event.altKey && (event.target.nodeName == "TEXTAREA")) {
		return;
	}

	if (event.metaKey) {
		return;
	}

	switch (event.keyCode) {

		case BKey:
			if (event.altKey) {
				toggleVhvTitle();
				event.preventDefault();
			}
			break;

		case FKey:
			if (event.altKey) {
				toggleFreeze();
				event.preventDefault();
			}
			break;

		case IKey:
			if (event.altKey) {
				if (!ShowingIndex) {
					toggleInputArea();
				}
				event.preventDefault();
			}
			break;

		case HKey:
			if (event.altKey) {
				if (!ShowingIndex) {
					showBufferedHumdrumData();
				}
				event.preventDefault();
			}
			break;

		case MKey:
			if (event.altKey) {
				displayMei();
				event.preventDefault();
			}
			break;

		case OKey:
			if (event.altKey) {
				OriginalClef = !OriginalClef;
				console.log("Original clef changed to:", OriginalClef);
				if (!ShowingIndex) {
					displayNotation();
				}
				event.preventDefault();
			}
			break;

		case PKey:
			if (event.altKey) {
				displayPdf();
				event.preventDefault();
			}
			break;

		case RKey:
			if (event.altKey) {
				reloadData();
				event.preventDefault();
			}
			break;

		case SKey:
			if (event.altKey) {
				displaySvg();
				event.preventDefault();
			}
			break;

		case VKey:
			if (event.altKey) {
				toggleEditorMode();
				event.preventDefault();
			}
			break;

		case SpaceKey:
			if (!PLAY) {
				play_midi();
				PLAY = true;
				PAUSE = false;
			} else if (PAUSE) {
				play();
				PAUSE = !PAUSE;
			} else {
				pause();
				PAUSE = !PAUSE;
			}
			event.preventDefault();
			break;

		case CommaKey:
			if (event.shiftKey) {
				decreaseTab();
			} else {
				toggleHumdrumCsvTsv();
			}
			break;

		case DotKey:
			if (event.shiftKey) {
				increaseTab();
			} 
			break;

		case UpKey:
			if (event.shiftKey) {
				if (FILEINFO["has-index"] == "true") {
					displayIndex(FILEINFO["location"]);
				}
			}
			event.preventDefault();
			break;

		case PgUpKey:
		case LeftKey:
			if (event.shiftKey) {
				displayWork(FILEINFO["previous-work"]);
			} else {
				gotoPreviousPage();
				console.log("PAGE", PAGE);
			}
			event.preventDefault();
			break;

		case PgDnKey:
		case RightKey:
			if (event.shiftKey) {
				displayWork(FILEINFO["next-work"]);
			} else {
				gotoNextPage();
				console.log("PAGE", PAGE);
			}
			event.preventDefault();
			break;

		case HomeKey:
			gotoFirstPage();
			event.preventDefault();
			break;

		case EndKey:
			gotoLastPage();
			event.preventDefault();
			break;

		case SlashKey:
			toggleHelpMenu();

	}
}



