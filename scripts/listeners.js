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


   if (!event.altKey) {
		return;
	}

	switch (event.keyCode) {

		case HKey:
			toggleInputArea();
			break;

	}
}



