{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Jul  2 21:02:53 CEST 2024
// Last Modified: Tue Jul  2 21:02:56 CEST 2024
// Filename:      _includes/vhv-scripts/html/getChecksum.js
// Included in:   _includes/vhv-scripts/html/main.js
// Syntax:        HTML; ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Prevent re-processing PREHTML and POSTHEML content
//                if the data has not changed. Avoid redoing if only
//                a layout change in the graphical score.
//
{% endcomment %}

function getChecksum(text) {
	if (typeof text === "undefined") {
		return 0;
	}

	let checksum = 0;
	for (let i=0; i<text.length; i++) {
		checksum += text.charCodeAt(i);
	}
	return checksum;
}



