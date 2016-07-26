//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Sun Apr 17 18:05:09 PDT 2016
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
	displayNotation();
	allowTabs();
	setupDropArea();

	var inputarea = document.querySelector("#input");
	inputarea.addEventListener("keyup", function() {
		displayNotation();
	});

	var cgi = GetCgiParameters();
	if (cgi.file) {
		loadKernScoresFile(cgi.file, cgi.mm);
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

	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	if (!event.altKey && (event.target.nodeName == "TEXTAREA")) {
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
			gotoPreviousPage();
			console.log("PAGE", PAGE);
			break;

		case RightKey:
			gotoNextPage();
			console.log("PAGE", PAGE);
			break;

		case MKey:
			displayMei();
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



