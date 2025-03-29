{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       endNewBeam.js
// Web Address:    https://verovio.humdrum.org/scripts/endNewBeam.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    J: Splitting a beam into two pieces, with the current note
//                 ending the old beam, and the current note starting a new beam.
//
{% endcomment %}


function endNewBeam(element, line, field) {
	var parent = getBeamParent(element);
	var newelement = getBeamChild(element);
	if (!parent) {
		return;
	}
	var pid = parent.id;
	if (!pid.match(/^beam/)) {
		return;
	}
	var selector = "#" + pid + " > g[id^='note']";
	selector += ", #" + pid + " > g[id^='rest']";
	selector += ", #" + pid + " > g[id^='chord']";
	var children = parent.querySelectorAll(selector);
	var targeti = -1;
	for (var i=0; i<children.length; i++) {
		if (children[i] === newelement) {
			targeti = i;
			break;
		}
	}
	if (targeti < 0) {
		return;
	}
	if (children.length == 1) {
		// strange: nothing to do
		return;
	}
	if (targeti == children.length - 1) {
		// already at the end of a beam, so nothing to do
		return;
	}

	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}

	if (targeti == 0) {
		// remove the beam info from the 0th element and add to 1st
		removeBeamInfo(children[0]);
		addBeamStart(children[targeti+1]);
	} else if (targeti == children.length - 2) {
		// end current beam, and make next note out of a beam
		removeBeamInfo(children[targeti+1]);
		addBeamEnd(children[targeti]);
	} else {
		addBeamEnd(children[targeti]);
		addBeamStart(children[targeti+1]);
	}
	EDITINGID = element.id;
	RestoreCursorNote = element.id;

	FreezeRendering = freezeBackup;
	if (!FreezeRendering) {
		displayNotation();
	}
	turnOffAllHighlights();
	highlightIdInEditor(EDITINGID);
}



