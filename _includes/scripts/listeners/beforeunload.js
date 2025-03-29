{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Mar 18 01:14:29 PDT 2025
// Last Modified: Tue Mar 18 01:14:33 PDT 2025
// Filename:      _includes/vhv-scripts/listeners/beforeunload.js
// Included in:   _includes/vhv-scripts/listeners/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Save the text editor's content when exiting the VHV page.
//                This is useful if the window is left by accident, allowing
//                the user to recover their data by loading VHV again within
//                24 hours.
//
{% endcomment %}


window.addEventListener("beforeunload", function (event) {
	var encodedcontents = encodeURIComponent(getTextFromEditorRaw());
	localStorage.setItem("AUTOSAVE", encodedcontents);
	localStorage.setItem("AUTOSAVE_DATE", (new Date).getTime());
	localStorage.setItem("FONT", FONT);
});



