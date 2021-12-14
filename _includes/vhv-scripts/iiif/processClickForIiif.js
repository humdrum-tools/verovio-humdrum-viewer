{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:31:16 CET 2021
// Last Modified: Sun Dec 12 08:13:27 CET 2021
// Filename:      _includes/iiif/processClickForIiif.js
// Used by:       
// Included in:   _includes/iiif/main.html
// Syntax:        ECMAScript 6
// vim:           ts=3:nowrap
//
// Description:   Check the element path for a mouse click and 
//                process any IIIF that is active on the current
//                click path.
//
{% endcomment %}

function processClickForIiif(event) {
	let path = buildPath(event.target);
	if (!path) {
		return;
	}
	
	let boxinfo = getIiifBoundingBoxInfo(path);
	if (!boxinfo) {
		return;
	}
	if (!boxinfo.xywh) {
		return;
	}
	if (!boxinfo.label) {
		return;
	}

	getIiifBase(boxinfo, event, iiifCallback);

}



