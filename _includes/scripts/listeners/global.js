{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Mar 18 01:18:46 PDT 2025
// Last Modified: Tue Mar 18 01:18:50 PDT 2025
// Filename:      _includes/scripts/listeners/global.js
// Included in:   _includes/scripts/listeners/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Global variables use in the VHV interface.
//
{% endcomment %}

var PDFLISTINTERVAL = null;

var EVENNOTESPACING = false;

var HIDEINITIALTOOLBAR = false;

var HIDEMENUANDTOOLBAR = false;

var HIDEMENU = false;

var TOOLBAR = null;  // used to select the toolbar from URL toolbar parameter.

var LASTTOOLBAR = 1;

if (localStorage.LASTTOOLBAR) {
	LASTTOOLBAR = parseInt(localStorage.LASTTOOLBAR);
}
if (localStorage.FONT) {
	FONT = cleanFont(localStorage.FONT);

}
var INITIALMEI = false;  // used to show MEI conversion on load

var PQUERY = "";

var IQUERY = "";

var RQUERY = "";

// SEARCHTOOLBAR: The search toolbar is currently the 4th one.
// This variable will need to be updated if that changes...
var SEARCHTOOLBAR = 4;

// MARKUP: highlighting options interface
MARKUP = new HnpMarkup();



