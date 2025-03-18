{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Mar 18 01:29:12 PDT 2025
// Last Modified: Tue Mar 18 01:29:17 PDT 2025
// Filename:      _includes/vhv-scripts/listeners/DOMContentLoaded.js
// Included in:   _includes/vhv-scripts/listeners/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Setup for VHV after the webpage has been loaded.
//
{% endcomment %}

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

		// b: hide VhvTitle:
		if (CGI.k.match(/b/)) {
			toggleVhvTitle();
		}

		// B: hide toolbar: (has changed key, so need to fix)
		if (CGI.k.match(/B/)) {
			HIDEINITIALTOOLBAR = true;
		}

		// E: hide menu and toolbar:
		if (CGI.k.match(/E/)) {
			HIDEMENUANDTOOLBAR = true;
		}

		// d: hide menu:
		if (CGI.k.match(/d/)) {
			HIDEMENU = true;
		}

		// m: display MEI data (conversion) initially:
		if (CGI.k.match(/m/)) {
				toggleTextVisibility(true);
				INITIALMEI = true;
				// displayMeiNoType();
		}
		if (CGI.k.match(/m/)) {
			// start in MEI mode
			EditorMode = "xml";
			setEditorModeAndKeyboard();
			if (!CGI.k.match(/e/)) {
				displayMeiNoType();
			}
		}

		// l: turn on layer coloring:
		if (CGI.k.match(/l/)) {
			// Presumed to be off at initialization of the page.
			toggleLayerColoring();
		}

		// p: start in paged mode:
		if (CGI.k.match(/p/)) {
			PAGED = true;
		}
		
		// y: initally hide text
		if (CGI.k.match(/y/)) {
			toggleTextVisibility(true);
		}

		// w: adjust spacing:
		for (var i=0; i<CGI.k.length; i++) {
			if (CGI.k.charAt(i) === "w") {
				SPACINGADJUSTMENT += 0.05;
			} else if (CGI.k.charAt(i) === "W") {
				SPACINGADJUSTMENT -= 0.05;
			}
		}

		// X: highlight courtesy accidentals:
		if (CGI.k.match(/X/)) {
			toggleCautionaryAccidentalColoring();
		}
	}

	if (CGI.filter) {
		GLOBALFILTER = CGI.filter;
	}
	if (CGI.v) {
		GLOBAL_VEROVIO_OPTIONS = CGI.v;
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
		if (insvg) {
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

