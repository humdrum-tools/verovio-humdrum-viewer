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
	vrvToolkit = new verovio.toolkit();
	allowTabs();
	setupDropArea();

	var inputarea = document.querySelector("#input");
	inputarea.addEventListener("keyup", function() {
		displayNotation();
	});

	CGI = GetCgiParameters();

	if (CGI.k && CGI.k.match(/h/)) {
		toggleInputArea(true);
	}

	if (CGI.file) {
		loadKernScoresFile(CGI.file, CGI.mm);
	} else {
		displayNotation();
	}

	$("#player").midiPlayer({
		color: "#c00",
		onUnpdate: midiUpdate,
		onStop: midiStop,
		width: 250
	});

	$(window).resize(function() { applyZoom(); });

	// set init (default) state
	$("#input").data('x', $("#input").outerWidth());
	$("#input").data('y', $("#input").outerHeight());

	$("#input").mouseup(function () {
		var $this = $(this);
		if ($this.outerWidth() != $this.data('x') || $this.outerHeight() != $this.data('y')) {
			applyZoom();
		}
		$this.data('x', $this.outerWidth());
		$this.data('y', $this.outerHeight());
	});


	$("#input").keydown(function() {
			stop();
	});

});




//////////////////////////////
//
// window blur event listener -- Stop MIDI playback.  It is very computaionally
//    expensive, and is not useful if the window is not in focus.
//

window.addEventListener("blur", function() {
	pause();
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

		case HKey:
			toggleInputArea();
			break;

		case OKey:
			OriginalClef = !OriginalClef;
			console.log("Original clef changed to:", OriginalClef);
			displayNotation();
			break;

		case LeftKey:
			if (event.shiftKey) {
				displayWork(FILEINFO["previous-work"]);
			} else {
				gotoPreviousPage();
				console.log("PAGE", PAGE);
			}
			break;

		case RightKey:
			if (event.shiftKey) {
				displayWork(FILEINFO["next-work"]);
			} else {
				gotoNextPage();
				console.log("PAGE", PAGE);
			}
			break;

		case MKey:
			displayMei();
			break;

		case SKey:
			displaySvg();
			break;

		case VKey:
			toggleVhvTitle();
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
			break;

	}
}



