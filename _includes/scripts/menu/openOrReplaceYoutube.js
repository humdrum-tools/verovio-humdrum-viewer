{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Wed Mar 27 17:53:30 PDT 2024
// Last Modified: Wed Mar 27 17:53:33 PDT 2024
// Filename:      _includes/vhv-scripts/main/openOrReplaceYoutube.js
// Included in:   _includes/vhv-scripts/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Open a window for youtube, but try to replace the youtube
//                content if a "youtube" window is already open.
//                Does not replace the old youtube window's content,
//                probably due to browse security feature.
//
{% endcomment %}

// Reference to the opened youtube window, if any:
var youtubeWindow = null; 

function openOrReplaceYoutube(url) {
	// If the window is already open and hasn't been closed
	if (youtubeWindow && !youtubeWindow.closed) {
		youtubeWindow.location.href = url;
		youtubeWindow.focus();
	} else {
		youtubeWindow = window.open(url, 'youtube');
		youtubeWindow.focus();
	}
}



