{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Jun  4 11:45:16 PDT 2024
// Last Modified: Tue Jun  4 11:45:20 PDT 2024
// Filename:      _includes/vhv-scripts/main/openOrReplaceWikipedia.js
// Included in:   _includes/vhv-scripts/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Open a window for wikipedia, but try to replace the wikipedia
//                content if a "wikipedia" window is already open.
//                Does not replace the old wikipedia window's content,
//                probably due to browse security feature.
//
{% endcomment %}

// Reference to the opened wikipedia window, if any:
var wikipediaWindow = null; 

function openOrReplaceWikipedia(url) {
	// If the window is already open and hasn't been closed
	if (wikipediaWindow && !wikipediaWindow.closed) {
		wikipediaWindow.location.href = url;
		wikipediaWindow.focus();
	} else {
		wikipediaWindow = window.open(url, 'wikipedia');
		wikipediaWindow.focus();
	}
}



