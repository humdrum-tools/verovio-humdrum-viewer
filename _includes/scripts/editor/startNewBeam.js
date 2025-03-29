{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       startNewBeam.js
// Web Address:    https://verovio.humdrum.org/scripts/startNewBeam.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Splitting a beam into two pieces, with the current note
//                 starting a new beam, and the previous note ending the old beam.
//
{% endcomment %}


function startNewBeam(element, line, field) {
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
	if (targeti <= 0) {
		// no need to start a new beam
		return;
	}

	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}

	if (targeti == 1) {
		// remove the beam on the first note of the original beam group
		// and add a beam start on this note unless it is at the end
		// of the original beam group.
		removeBeamInfo(children[0]);
		if (children.length == 2) {
			removeBeamInfo(children[1]);
		} else {
			addBeamStart(children[targeti]);
		}
	} else if (targeti < children.length - 1) {
		addBeamStart(children[targeti]);
		addBeamEnd(children[targeti-1]);
	} else {
		// remove the last note from the beam group
		addBeamEnd(children[targeti-1]);
		removeBeamInfo(children[targeti]);
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



