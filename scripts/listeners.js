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
// keydown event listener --
//

window.addEventListener("keydown", processKeyCommand);

function processKeyCommand(event) {
	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}
console.log("EVENT", event);

	if (!event.altKey && (event.target.nodeName == "TEXTAREA")) {
		return;
	}

	if (event.metaKey) {
		return;
	}

	switch (event.keyCode) {

		case BKey:
			toggleVhvTitle();
			event.preventDefault();
			break;

		case FKey:
			toggleFreeze();
			event.preventDefault();
			break;

		case IKey:
			if (!ShowingIndex) {
				toggleInputArea();
			}
			event.preventDefault();
			break;

		case HKey:
			if (!ShowingIndex) {
				showBufferedHumdrumData();
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
			toggleEditorMode();
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

		case CommaKey:
			toggleHumdrumCsvTsv();
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

	}
}



