{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Mar 18 01:04:42 PDT 2025
// Last Modified: Tue Mar 18 01:04:45 PDT 2025
// Filename:      _includes/vhv-scripts/listeners/verovioCallback.js
// Included in:   _includes/vhv-scripts/listeners/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Function that is run after SVG data is calculated by
//                verovio.
//
{% endcomment %}

function verovioCallback(data) {
	// console.log("SVG updated");
	if (GOTOTOPOFNOTATION) {
		GOTOTOPOFNOTATION = false;
		let scroller = document.querySelector("#output-container");
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

	displayPrePostHtml();
}



