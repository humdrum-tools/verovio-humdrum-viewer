//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Wed Jul 27 23:10:04 PDT 2016
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

	allowTabs();
	setupDropArea();

	CGI = GetCgiParameters();

	if (CGI.k && CGI.k.match(/h/)) {
		toggleInputArea(true);
	}

	if (CGI.file) {
		loadKernScoresFile(
			{
				file: CGI.file, 
				measures: CGI.mm,
				next: true,
				previous: true
			}
		);
	} else {
		displayNotation();
	}

	// set init (default) state
	$("#input").data('x', $("#input").outerWidth());
	$("#input").data('y', $("#input").outerHeight());

});



//////////////////////////////
//
// keydown event listener --
//

window.addEventListener("keydown", processKeyCommand);

function processKeyCommand(event) {
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

		case FKey:
			toggleFreeze();
			event.preventDefault();
			break;

		case HKey:
			if (!ShowingIndex) {
				toggleInputArea();
			}
			event.preventDefault();
			break;

		case MKey:
			displayMei();
			event.preventDefault();
			break;

		case OKey:
			OriginalClef = !OriginalClef;
			console.log("Original clef changed to:", OriginalClef);
			if (!ShowingIndex) {
				displayNotation();
			}
			event.preventDefault();
			break;

		case PKey:
			displayPdf();
			event.preventDefault();
			break;

		case RKey:
			console.log("RELOADING DATA");
			reloadData();
			event.preventDefault();
			break;

		case SKey:
			displaySvg();
			event.preventDefault();
			break;

		case VKey:
			toggleVhvTitle();
			event.preventDefault();
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

		case UpKey:
			if (event.shiftKey) {
				if (FILEINFO["has-index"] == "true") {
					displayIndex(FILEINFO["location"]);
				}
			}
			event.preventDefault();
			break;

		case LeftKey:
			if (event.shiftKey) {
				displayWork(FILEINFO["previous-work"]);
			} else {
				gotoPreviousPage();
				console.log("PAGE", PAGE);
			}
			event.preventDefault();
			break;

		case RightKey:
			if (event.shiftKey) {
				displayWork(FILEINFO["next-work"]);
			} else {
				gotoNextPage();
				console.log("PAGE", PAGE);
			}
			event.preventDefault();
			break;

	}
}



