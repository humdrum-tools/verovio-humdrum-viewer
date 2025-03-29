{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       processNotationKey.js
// Web Address:    https://verovio.humdrum.org/scripts/processNotationKey.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Also consider whether MEI or Humdrum is currently being displayed, 
//                 but that would double the code...
//
{% endcomment %}


function processNotationKey(key, element) {
	var id    = element.id;
	var matches;

	if (matches = id.match(/L(\d+)/)) {
		var line = parseInt(matches[1]);
	} else {
		return; // required
	}

	if (matches = id.match(/F(\d+)/)) {
		var field = parseInt(matches[1]);
	} else {
		return; // required
	}

	if (matches = id.match(/S(\d+)/)) {
		var subfield = parseInt(matches[1]);
	} else {
		subfield = null;
	}

	if (matches = id.match(/N(\d+)/)) {
		var number = parseInt(matches[1]);
	} else {
		number = 1;
	}

	if (matches = id.match(/^([a-z]+)-/)) {
		var name = matches[1];
	} else {
		return; // required
	}

	if ((line < 1) || (field < 1)) {
		return;
	}

	var line2 = 0;
	var field2 = 0;
	var subfield2 = 0;
	var number2 = 1;

	if (matches = id.match(/^[^-]+-[^-]+-.*L(\d+)/)) {
		line2 = parseInt(matches[1]);
	}
	if (matches = id.match(/^[^-]+-[^-]+-.*F(\d+)/)) {
		field2 = parseInt(matches[1]);
	}
	if (matches = id.match(/^[^-]+-[^-]+-.*S(\d+)/)) {
		subfield2 = parseInt(matches[1]);
	}
	if (matches = id.match(/^[^-]+-[^-]+-.*N(\d+)/)) {
		number2 = parseInt(matches[1]);
	}


	if (key === "esc") {
		MENU.hideContextualMenus();
		HIGHLIGHTQUERY = "";
		if (!element) {
			return;
		}
		var classes = element.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		element.setAttribute("class", outclass);
		CursorNote = "";
		return;
	}

	if (name === "note") {
		if (key === "y")       { toggleVisibility(id, line, field); }
		else if (key === "a")  { setStemAboveMarker(id, line, field); }
		else if (key === "b")  { setStemBelowMarker(id, line, field); }
		else if (key === "c")  { deleteStemMarker(id, line, field); }
		else if (key === "#")  { toggleSharp(id, line, field, subfield); }
		else if (key === "-")  { toggleFlat(id, line, field, subfield); }
		else if (key === "i")  { toggleEditorialAccidental(id, line, field, subfield); }
		else if (key === "n")  { toggleNatural(id, line, field, subfield); }
		else if (key === "m")  { toggleMordent("m", id, line, field, subfield); }
		else if (key === "M")  { toggleMordent("M", id, line, field, subfield); }
		else if (key === "w")  { toggleMordent("w", id, line, field, subfield); }
		else if (key === "W")  { toggleMordent("W", id, line, field, subfield); }
		else if (key === "X")  { toggleExplicitAccidental(id, line, field, subfield); }
		else if (key === "L")  { startNewBeam(element, line, field); }
		else if (key === "J")  { endNewBeam(element, line, field); }
		else if (key === "transpose-up-step")  { transposeNote(id, line, field, subfield, +1); }
		else if (key === "transpose-down-step")  { transposeNote(id, line, field, subfield, -1); }
		else if (key === "transpose-up-octave")  { transposeNote(id, line, field, subfield, +7); }
		else if (key === "transpose-down-octave")  { transposeNote(id, line, field, subfield, -7); }
		else if (key === "'")  { toggleStaccato(id, line, field); }
		else if (key === "^")  { toggleAccent(id, line, field); }
		else if (key === "^^") { toggleMarcato(id, line, field); }
		else if (key === "~")  { toggleTenuto(id, line, field); }
		else if (key === "s")  { addSlur(id, line, field); }
		else if (key === "q")  { toggleGraceNoteType(id, line, field); }
		else if (key === "p")  { console.log("p pressed");  togglePedalStart(id, line, field); }
		else if (key === "P")  { togglePedalEnd(id, line, field); }
		else if (key === "t")  { toggleMinorTrill(id, line, field); }
		else if (key === "T")  { toggleMajorTrill(id, line, field); }
		else if (key === "`")  { toggleStaccatissimo(id, line, field); }
		else if (key === ";")  { toggleFermata(id, line, field); }
		else if (key === ":")  { toggleArpeggio(id, line, field); }
		else if (key === "1")  { InterfaceSingleNumber = 1; }
		else if (key === "2")  { InterfaceSingleNumber = 2; }
		else if (key === "3")  { InterfaceSingleNumber = 3; }
		else if (key === "4")  { InterfaceSingleNumber = 4; }
		else if (key === "5")  { InterfaceSingleNumber = 5; }
		else if (key === "6")  { InterfaceSingleNumber = 6; }
		else if (key === "7")  { InterfaceSingleNumber = 7; }
		else if (key === "8")  { InterfaceSingleNumber = 8; }
		else if (key === "9")  { InterfaceSingleNumber = 9; }
		else if (key === "@")  { toggleMarkedNote(id, line, field, subfield); }
	} else if (name === "rest") {
		if (key === "y")       { toggleVisibility(id, line, field); }
		else if (key === ";")  { toggleFermata(id, line, field); }
		else if (key === "L")  { startNewBeam(element, line, field); }
		else if (key === "J")  { endNewBeam(element, line, field); }
	} else if (name === "dynam") {
		if (key === "a")       { setDynamAboveMarker(id, line, field, number); }
		else if (key === "b")  { setDynamBelowMarker(id, line, field, number); }
		else if (key === "c")  { deleteDynamDirectionMarker(id, line, field, number); }
	} else if (name === "hairpin") {
		if (key === "a")       { setHairpinAboveMarker(id, line, field, number); }
		else if (key === "b")  { setHairpinBelowMarker(id, line, field, number); }
		else if (key === "c")  { deleteHairpinDirectionMarker(id, line, field, number); }
	} else if (name === "slur") {
		if (key === "a")       { setSlurAboveMarker(id, line, field, number); }
		else if (key === "b")  { setSlurBelowMarker(id, line, field, number); }
		else if (key === "c")  { deleteSlurDirectionMarker(id, line, field, number); }
		else if (key === "D")  { deleteSlur(id, line, field, number, line2, field2, number2); }
		else if (key === "delete") { deleteSlur(id, line, field, number, line2, field2, number2); }
		else if (key === "f")  { flipSlurDirection(id, line, field, number); }
		else if (key === "leftEndMoveBack")     { leftEndMoveBack(id, line, field, number, line2, field2, number2); }
		else if (key === "leftEndMoveForward")  { leftEndMoveForward(id, line, field, number, line2, field2, number2); }
		else if (key === "rightEndMoveForward") { rightEndMoveForward(id, line, field, number, line2, field2, number2); }
		else if (key === "rightEndMoveBack")    { rightEndMoveBack(id, line, field, number, line2, field2, number2); }
		else if (key === "1")  { InterfaceSingleNumber = 1; }
		else if (key === "2")  { InterfaceSingleNumber = 2; }
		else if (key === "3")  { InterfaceSingleNumber = 3; }
		else if (key === "4")  { InterfaceSingleNumber = 4; }
		else if (key === "5")  { InterfaceSingleNumber = 5; }
		else if (key === "6")  { InterfaceSingleNumber = 6; }
		else if (key === "7")  { InterfaceSingleNumber = 7; }
		else if (key === "8")  { InterfaceSingleNumber = 8; }
		else if (key === "9")  { InterfaceSingleNumber = 9; }
	} else if (name === "tie") {
		// need to fix tie functions to deal with chord notes (subfield values):
		if (key === "a") { setTieAboveMarker(id, line, field, subfield); }
		else if (key === "b")  { setTieBelowMarker(id, line, field, subfield); }
		else if (key === "c")  { deleteTieDirectionMarker(id, line, field, subfield); }
		else if (key === "f")  { flipTieDirection(id, line, field, subfield); }
	} else if (name === "beam") {
		if (key === "a")       { setBeamAboveMarker(id, line, field); }
		else if (key === "b")  { setBeamBelowMarker(id, line, field); }
		else if (key === "c")  { deleteBeamDirectionMarker(id, line, field); }
		else if (key === "f")  { flipBeamDirection(id, line, field); }
	}
}



