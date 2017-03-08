//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       editor.js
// Web Address:    http://verovio.humdrum.org/scripts/editor.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Processing key commands to edit music.
//

// InterfaceSingleNumber: digit typed on the keyboard before 
// certain commands, suh as slurs, which indicates the number
// of notes to include under the slur.  Or "2" for double-flats/
// sharps, or for the transposing interval when changing pitch.
var InterfaceSingleNumber = 1;  

//////////////////////////////
//
// processNotationKey -- Also consider whether MEI or Humdrum is
//    currently being displayed, but that would double the code...
//

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
		else if (key === "n")  { toggleNatural(id, line, field, subfield); }
		else if (key === "i")  { toggleEditorialAccidental(id, line, field, subfield); }
		else if (key === "X")  { toggleExplicitAccidental(id, line, field, subfield); }
		else if (key === "m")  { toggleMordent("m", id, line, field, subfield); }
		else if (key === "M")  { toggleMordent("M", id, line, field, subfield); }
		else if (key === "w")  { toggleMordent("w", id, line, field, subfield); }
		else if (key === "W")  { toggleMordent("W", id, line, field, subfield); }
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
	} else if (name === "rest") {
		if (key === "y")       { toggleVisibility(id, line, field); }
		else if (key === ";")  { toggleFermata(id, line, field); }
	} else if (name === "slur") {
		if (key === "a")       { setSlurAboveMarker(id, line, field, number); }
		else if (key === "b")  { setSlurBelowMarker(id, line, field, number); }
		else if (key === "c")  { deleteSlurDirectionMarker(id, line, field, number); }
		else if (key === "D")  { deleteSlur(id, line, field, number, line2, field2, number2); }
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


///////////////////////////////////////////////////////////////////////////
//
// Beam editing --
//


//////////////////////////////
//
// setBeamAboveMarker --
//

function setBeamAboveMarker(id, line, field) {
	// console.log("SET BEAM ABOVE", token, line, field, id);
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^LJKk]*)([LJKk]+)([" + above + below + "]*)([^LJKk]*)");
	var matches = re.exec(token);
	if (!matches) {
		return;
	} else {
		var newtoken = matches[1];
		newtoken += matches[2];
		newtoken += above;
		newtoken += matches[4];
	}
	
   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// setBeamBelowMarker --
//

function setBeamBelowMarker(id, line, field) {
	// console.log("SET BEAM BELOW", token, line, field, id);
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^LJKk]*)([LJKk]+)([" + above + below + "]*)([^LJKk]*)");
	var matches = re.exec(token);
	if (!matches) {
		return;
	} else {
		var newtoken = matches[1];
		newtoken += matches[2];
		newtoken += below;
		newtoken += matches[4];
	}
	
   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteBeamDirectionMarker --
//

function deleteBeamDirectionMarker(id, line, field) {
	// console.log("REMOVE BEAM DIRECTION", token, line, field, id);
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^LJKk]*)([LJKk]+)([" + above + below + "]*)([^LJKk]*)");
	var matches = re.exec(token);
	if (!matches) {
		return;
	} else {
		var newtoken = matches[1];
		newtoken += matches[2];
		newtoken += matches[4];
	}
	
   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}


///////////////////////////////////////////////////////////////////////////
//
// Slur editing --
//


//////////////////////////////
//
// setSlurAboveMarker --
//

function setSlurAboveMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	console.log("TOGGLE SLUR ABOVE", token, line, field, number, id);

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == above) {
			counter++;
			continue;
		} else if (token[i+1] == below) {
			newtoken += above;
			i++;
			counter++;
			continue;
		} else {
			newtoken += above;
			counter++;
			continue;
		}
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

}



//////////////////////////////
//
// setSlurBelowMarker --
//

function setSlurBelowMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		// nothing to do, just a null data token
		return;
	}
	var token = getEditorContents(line, field);
	// console.log("TOGGLE SLUR BELOW", token, line, field, number, id);

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == below) {
			counter++;
			continue;
		} else if (token[i+1] == above) {
			newtoken += below;
			i++;
			counter++;
			continue;
		} else {
			newtoken += below;
			counter++;
			continue;
		}
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteSlurDirectionMarker --
//

function deleteSlurDirectionMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	//console.log("DELETE SLUR DIRECTION", token, line, field, number, id);

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == below) {
			i++;
			counter++;
			continue;
		} else if (token[i+1] == above) {
			i++;
			counter++;
			continue;
		} else {
			counter++;
			continue;
		}
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// leftEndMoveBack -- Only woks in regions where spines don't split or merge.
//

function leftEndMoveBack(id, line, field, number, line2, field2, number2) {
	console.log("LEFT END MOVE BACK");
	var token1 = getEditorContents(line, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}
	var i = line - 2; // -1 for 0-index and -1 for line after
	var counter = 0;
	while (i > 0) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i--;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != InterfaceSingleNumber) {
			i--;
			continue;
		}
		break;
	}
	console.log("LEFTENDMOVEBACK NEW", token1, line, field, number, token2, i+1, id);

	if (i <= 0) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurstart = deleteSlurStart(id, line, field, number);
	if (slurstart !== "") {
		addSlurStart(id, i+1, field, slurstart);
	}
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 1;
}



//////////////////////////////
//
// addSlur -- add a slur to a note, which goes to the next note in the field.
//

function addSlur(id, line, field) {
	var token = getEditorContents(line, field);
	var freezeBackup = FreezeRendering;
	addSlurStart(id, line, field, '(');

	var i = parseInt(line); // -1 for 0-index and +1 for line after
	var counter = 0;
	var size = EDITOR.session.getLength();
	while (i < size) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i++;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != InterfaceSingleNumber) {
			i++;
			continue;
		}
		break;
	}
	if (i >= size) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 <= line) {
		// do not pass slur begin
		return;
	}

	addSlurEnd(id, i+1, field, ')');
	var newid = id.replace(/^note-/, "slur-");
	// FIX N number here later:
	var ending = "-L" + (i+1) + "F" + field + "N" + 1;
	newid += ending;
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;

	FreezeRendering = freezeBackup;
	if (!FreezeRendering) {
		displayNotation();
	}
	InterfaceSingleNumber = 1;
}



//////////////////////////////
//
// addSlurStart --
//

function addSlurStart(id, line, field, slurstart) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	for (var i=token.length-1; i>=0; i--) {
		if (token[i] == '(') {
			// need to insert new slur after last one
			newtoken = token.substring(0, i+1);
			newtoken += slurstart;
			newtoken += token.substring(i+1);
			break;
		}
	}

	if (newtoken === "") {
		newtoken = slurstart + token;
	}

	var pcount = 0;
	for (i=0; i<newtoken.length; i++) {
		if (newtoken[i] == '(') {
			pcount++;
		}
	}

	var newid = id.replace(/L\d+/, "L" + line);
	newid = newid.replace(/F\d+/, "F" + field);
	newid = newid.replace(/N\d+/, "N" + pcount);
   // console.log("OLDTOKEN2", token, "NEWTOKEN2", newtoken);
   // console.log("OLDID", id, "NEWID", newid);
	if (newtoken !== token) {
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		setEditorContents(line, field, newtoken, newid);
	}
}



//////////////////////////////
//
// addSlurEnd --
//

function addSlurEnd(id, line, field, slurend) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			// need to insert new slur before first one
			newtoken = token.substring(0, i+1);
			newtoken += slurend;
			newtoken += token.substring(i+1);
		}
	}

	if (newtoken === "") {
		newtoken = token + slurend;
	}

	var pcount = 0;
	for (i=0; i<newtoken.length; i++) {
		if (newtoken[i] == '(') {
			pcount++;
		}
	}

	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteSlurStart --
//

function deleteSlurStart(id, line, field, number) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	var counter = 0;
	var output = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		if (counter != number) {
			newtoken += token[i];
			continue;
		}
		output += token[i];
		if (token[i+1] == '>') {
			output += '>';
			i++;
		} else if (token[i+1] == '<') {
			output += '<';
			i++;
		}
		counter++;
   }

   // console.log("OLDTOKEN1", token, "NEWTOKEN1", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

	return output;
}



//////////////////////////////
//
// deleteSlurEnd --
//

function deleteSlurEnd(id, line, field, number) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	var counter = 0;
	var output = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == ')') {
			counter++;
			output = ')';
		}
		if (counter == number) {
			counter++;
			continue;
		}
		newtoken += token[i];
   }

   // console.log("OLDTOKEN1", token, "NEWTOKEN1", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

	return output;
}


//////////////////////////////
//
// deleteSlur --
//

function deleteSlur(id, line, field, number, line2, field2, number2) {
	// console.log("DELETING SLUR");
	var freezeBackup = FreezeRendering;
	deleteSlurStart(id, line, field, number);
	deleteSlurEnd(id, line2, field2, number2);
	FreezeRendering = freezeBackup;
	RestoreCursorNote = null;
	HIGHLIGHTQUERY = null;
	if (!FreezeRendering) {
		displayNotation();
	}
}




//////////////////////////////
//
// leftEndMoveForward --
//

function leftEndMoveForward(id, line, field, number, line2, field2, number2) {
	console.log("LEFT END MOVE FORWARD");
	var token1 = getEditorContents(line, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}

	var i = parseInt(line); // -1 for 0-index and +1 for line after
	var counter = 0;
	var size = EDITOR.session.getLength();
	while (i < size) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i++;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != InterfaceSingleNumber) {
			i++;
			continue;
		}
		break;
	}
	if (i >= size) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 >= line2) {
		// do not pass slur end
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurstart = deleteSlurStart(id, line, field, number);
	if (slurstart !== "") {
		addSlurStart(id, i+1, field, slurstart);
	}
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 1;
}



//////////////////////////////
//
// rightEndMoveForward --
//

function rightEndMoveForward(id, line, field, number, line2, field2, number2) {
	// console.log("RIGHT END MOVE FORWARD");
	var token1 = getEditorContents(line2, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}
	var i = parseInt(line2); // -1 for 0-index and +1 for line after
	var counter = 0;
	var size = EDITOR.session.getLength();
	while (i < size) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i++;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != InterfaceSingleNumber) {
			i++;
			continue;
		}
		break;
	}
	if (i >= size) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 <= line) {
		// do not pass slur start
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurend = deleteSlurEnd(id, line2, field2, number2);
	if (slurend !== "") {
		addSlurEnd(id, i+1, field, slurend);
	}
	// need to remove "N" if "N1" (in verovio)
	var newend = "L" + (i+1) + "F" + field2 + "N" + number2;
	var newid = id.replace(/-[^-]+$/, "-" + newend);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 1;
}



//////////////////////////////
//
// rightEndMoveBack --
//

function rightEndMoveBack(id, line, field, number, line2, field2, number2) {
	// console.log("RIGHT END MOVE BACKWARD");
	var token1 = getEditorContents(line2, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}
	var i = parseInt(line2) - 2; // -1 for 0-index and -1 for line after
	var counter = 0;
	while (i >= 0) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i--;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != InterfaceSingleNumber) {
			i--;
			continue;
		}
		break;
	}
	if (i <= 0) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 <= line) {
		// do not pass slur start
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurend = deleteSlurEnd(id, line2, field2, number2);
	if (slurend !== "") {
		addSlurEnd(id, i+1, field, slurend);
	}
	// need to remove "N" if "N1" (in verovio)
	var newend = "L" + (i+1) + "F" + field2 + "N" + number2;
	var newid = id.replace(/-[^-]+$/, "-" + newend);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 1;
}



///////////////////////////////////////////////////////////////////////////
//
// Tie editing --
//


//////////////////////////////
//
// setTieAboveMarker --
//

function setTieAboveMarker(id, line, field, subfield) {
	console.log("TIE ABOVE", token, line, field, subfield, id);

	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}
	if (token.match("r")) {
		// reset, so no tie allowed
		return;
	}
	
	var newtoken = "";
	var matches;

	if (!(token.match(/[[]/) || token.match("_"))) {
		// no tie start
		return;
	}

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^_[]*)([_[]+)([" + above + below + "]*)([^_[]*)");
	if (matches = re.exec(token)) {
		newtoken = matches[1] + matches[2] + above + matches[4];
	} else {
		newtoken = token;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}




//////////////////////////////
//
// setTieBelowMarker --
//

function setTieBelowMarker(id, line, field, subfield) {
	console.log("TIE BELOW", token, line, field, subfield, id);

	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}
	if (token.match("r")) {
		// reset, so no tie allowed
		return;
	}
	
	var newtoken = "";
	var matches;

	if (!(token.match(/[[]/) || token.match("_"))) {
		// no tie start
		return;
	}

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^_[]*)([_[]+)([" + above + below + "]*)([^_[]*)");
	if (matches = re.exec(token)) {
		newtoken = matches[1] + matches[2] + below + matches[4];
	} else {
		newtoken = token;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteTieDirectionMarker --
//

function deleteTieDirectionMarker(id, line, field, subfield) {
	console.log("TIE DIRECTION REMOVE", token, line, field, subfield, id);

	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}
	if (token.match("r")) {
		// reset, so no tie allowed
		return;
	}
	
	var newtoken = "";
	var matches;

	if (!(token.match(/[[]/) || token.match("_"))) {
		// no tie start
		return;
	}

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^_[]*)([_[]+)([" + above + below + "]*)([^_[]*)");
	if (matches = re.exec(token)) {
		newtoken = matches[1] + matches[2] + matches[4];
	} else {
		newtoken = token;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



///////////////////////////////////////////////////////////////////////////
//
// Stem editing --
//



//////////////////////////////
//
// setStemAboveMarker --
//

function setStemAboveMarker(id, line, field) {
	console.log("STEM ABOVE", line, field, id);
	var token = getEditorContents(line, field);

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var matches;
	var subtokens = token.split(" ");
	for (var i=0; i<subtokens.length; i++) {
		if (matches = subtokens[i].match(/([^\\\\\\\/]*)([\\\\\\\/]+)([^\\\\\\\/]*)/)) {
			subtokens[i] = matches[1] + "/" + matches[3];
		} else if (matches = subtokens[i].match(/([^A-Ga-g#XxYyTt:'~oOS$MmWw\^<>n-]*)([A-Ga-g#Xx<>yYnTt:'~oOS$MmWw\^-]+)(.*)/)) {
			subtokens[i] = matches[1] + matches[2] + "/" + matches[3];
		}
	}

	var newtoken = subtokens.join(" ");

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// setStemBelowMarker --
//

function setStemBelowMarker(id, line, field) {
	console.log("STEM BELOW", line, field, id);
	var token = getEditorContents(line, field);

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var matches;
	var subtokens = token.split(" ");
	for (var i=0; i<subtokens.length; i++) {
		if (matches = subtokens[i].match(/([^\\\/]*)([\\\\\\\/]+)([^\\\\\\\/]*)/)) {
			subtokens[i] = matches[1] + "\\" + matches[3];
		} else if (matches = subtokens[i].match(/([^A-Ga-g#XxYyTt:'~oOS$MmWw\^<>n-]*)([A-Ga-g#Xx<>yYnTt:'~oOS$MmWw\^-]+)(.*)/)) {
			subtokens[i] = matches[1] + matches[2] + "\\" + matches[3];
		}
	}

	var newtoken = subtokens.join(" ");

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteStemMarker --
//

function deleteStemMarker(id, line, field) {
	console.log("REMOVE STEMS", line, field, id);
	var token = getEditorContents(line, field);

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken = token.replace(/[\\\/]/g, "");

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}


///////////////////////////////////////////////////////////////////////////
//
// Transposing --
//


//////////////////////////////
//
// tranposeUp --
//

function transposeNote(id, line, field, subfield, amount)  {
	console.log("TRANSPOSE Note", line, field, subfield, id);
	var token = getEditorContents(line, field);

	amount = parseInt(amount);

	if (InterfaceSingleNumber > 1) {
		if (amount > 0) {
			amount = InterfaceSingleNumber - 1;
		} else {
			amount = -InterfaceSingleNumber + 1;
		}
		InterfaceSingleNumber = 1;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken;
	var matches;
	if (matches = token.match(/([^a-gA-G]*)([a-gA-G]+)([^a-gA-G]*)/)) {
		newtoken = matches[1];
		newtoken += transposeDiatonic(matches[2], amount);
		newtoken += matches[3];

	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



///////////////////////////////////////////////////////////////////////////
//
// Accidental editing --
//



//////////////////////////////
//
// toggleEditorialAccidental --
//

function toggleEditorialAccidental(id, line, field, subfield) {
	console.log("TOGGLE EDITORIAL ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have an accidental
		return;
	}

   var editchar = insertEditorialAccidentalRdf();
	var newtoken;
	var matches;

	var re = new RegExp(editchar);
	if (re.exec(token)) {
		newtoken = token.replace(new RegExp(editchar, "g"), "");
	} else if (token.match(/[-#n]/)) {
		// add editorial accidental
		matches = token.match(/(.*[a-gA-Gn#xXyY-]+)(.*)/);
		newtoken = matches[1] + editchar + matches[2];
	} else {
		// add a natural and an editorial accidental
		matches = token.match(/(.*[a-gA-GxXyY]+)(.*)/);
		newtoken = matches[1] + "n" + editchar + matches[2];
   }

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleSharp -- show or hide a sharp or double sharp on a note.
//

function toggleSharp(id, line, field, subfield) {
	// console.log("TOGGLE NATURAL ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken;


	if (InterfaceSingleNumber == 2) {
		if (!token.match("##")) {
			// add double sharp
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/, 
					function(str,p1) { return p1 ? p1 + "##" : str});
		} else {
			// remove double-sharp
			newtoken = token.replace(/#+/, "");
		}
		InterfaceSingleNumber = 1;
	} else {
		if (token.match("##") || !token.match("#")) {
			// add sharp
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/, 
					function(str,p1) { return p1 ? p1 + "#" : str});
		} else {
			// remove sharp
			newtoken = token.replace(/#+/, "");
		}
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleFlat -- Show or hide a flat or double flat on a note.
//

function toggleFlat(id, line, field, subfield) {
	// console.log("TOGGLE FLAT ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken;
	if (InterfaceSingleNumber == 2) {
		if (!token.match("--")) {
			// add flat
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/, 
					function(str,p1) { return p1 ? p1 + "--" : str});
		} else {
			// remove flat
			newtoken = token.replace(/-+/, "");
		}
		InterfaceSingleNumber = 1;
	} else {
		if (token.match("--") || !token.match("-")) {
			// add flat
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/, 
					function(str,p1) { return p1 ? p1 + "-" : str});
		} else {
			// remove flat
			newtoken = token.replace(/-+/, "");
		}
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleNatural --
//

function toggleNatural(id, line, field, subfield) {
	console.log("TOGGLE NATURAL ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken;
	if (!token.match("n")) {
		// add natural
		newtoken = token.replace(/[#n-]+/, "");
		newtoken = newtoken.replace(/([a-gA-G]+)/, 
				function(str,p1) { return p1 ? p1 + "n" : str});
	} else {
		// remove natural
		newtoken = token.replace(/n+/, "");
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleExplicitAccidental --
//

function toggleExplicitAccidental(id, line, field, subfield) {
	console.log("TOGGLE EXPLICIT ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, so no accidental
		return;
	}

	var newtoken;
	var matches;

	if (token.match(/n/)) {
		// remove cautionary natural
		newtoken = token.replace(/n/g, "");
	} else if (matches = token.match(/([^#-]*)([#-]+)(X?)([^#-]*)/)) {
		// add or remove "X" from sharp/flats
		if (matches[3] === "X") {
			// remove cautionary accidental
			newtoken = matches[1] + matches[2] + matches[4];
		} else {
			// add cautionary accidental
			newtoken = matches[1] + matches[2] + "X" + matches[4];
		}
	} else {
		// add a natural sign
		if (matches = token.match(/([^A-G]*)([A-G]+)([^A-G]*)/i)) {
			newtoken = matches[1] + matches[2] + "n" + matches[3];
		}
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

}



//////////////////////////////
//
// toggleStaccato --
//

function toggleStaccato(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match("'")) {
		// add staccato
		token = token.replace(/'+/, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "'" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove staccato
		token = token.replace(/'/g, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleAccent --
//

function toggleAccent(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/\^+/)) {
		// add accent
		token = token.replace(/\^+/, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "^" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove accent
		token = token.replace(/\^+/g, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleMarcato --
//

function toggleMarcato(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/\^+/)) {
		// add marcato
		token = token.replace(/\^+/, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "^^" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
		token = token.replace(/\^+/g, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleGraceNoteType --
//

function toggleGraceNoteType(id, line, field) {
	var token = getEditorContents(line, field);
	var subtokens = token.split(" ");
	for (var i=0; i<subtokens.length; i++) {
		if (subtokens[i].match("qq")) {
			subtokens[i] = subtokens[i].replace(/qq/g, "q");
		} else if (subtokens[i].match("q")) {
			subtokens[i] = subtokens[i].replace(/q/g, "qq");
		}
	}
	var newtoken = subtokens.join(" ");

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}




//////////////////////////////
//
// toggleMinorTrill --
//

function toggleMinorTrill(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/T/i)) {
		// add trill
		token = token.replace(/T/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "t" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else if (token.match(/T/)) {
		// change to major-second trill
		token = token.replace(/T/g, "t");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove trill
		token = token.replace(/T/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleMordent --
//

function toggleMordent(mtype, id, line, field, subfield) {
	console.log("TOGGLE MORDENT", token, line, field, subfield, id);

	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}
	if (token.match("r")) {
		// reset, so no mordent allowed
		return;
	}
	
	var newtoken = "";
	var matches;
	var matches = token.match(/[MmWw]/);
	var hasmordent = false;
	if (matches) {
		hasmordent = true;
	}
	var hascurrentmordent = false;
	if (hasmordent) {
		var re2 = new RegExp(mtype);
		if (re2.exec(token)) {
			hascurrentmordent = true;
		}
	}
	
	if (hascurrentmordent) {
		// remove existing mordent
		newtoken = token.replace(/[MmWw][<>]*/g, "");
	} else if (hasmordent) {
		// change the current mordent to the new one
		newtoken = token.replace(/[MmWw]/g, mtype);
	} else {
		// add the given mordent
		newtoken = token + mtype;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

   // console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// togglePedalStart -- Inserting before LO:TX is a problem
//
//

function togglePedalStart(id, line, field) {
	console.log("PEDAL START TOGGLE", line);
	var text = EDITOR.session.getLine(line-1);
	if (text.match(/^!/)) {
		return;
	}
	if (text.match(/^\*/)) {
		return;
	}
	var addline = true;
	var ptext = EDITOR.session.getLine(line-2);
	if (ptext.match(/^\*/) && ptext.match(/\*ped/)) {
			addline = false;
	}
	var newid;
	if (!addline) {
		// delete existing pedal line
		console.log("DELETING PEDAL START");
		EDITOR.session.replace(new Range(line-2, 0, line-1, 0), "");
		newid = id.replace(/L\d+/, "L" + (line-1));
   	console.log("OLDID", id, "NEWID", newid);
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		return;
	}
	var fields = text.split("\t");
	for (var i=0; i<fields.length; i++) {
		// inserting in the first column, but maybe should be
		// the first **kern dataspine...
		fields[i] = "*";
	}
	fields[0] = "*ped";
	console.log("ADDING START PEDAL LINE");
	var newline = fields.join("\t") + "\n";
	EDITOR.session.insert({row:line-1, column:0}, newline);
	newid = id.replace(/L\d+/, "L" + (line+1));
  	console.log("OLDID", id, "NEWID", newid);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;
}



//////////////////////////////
//
// togglePedalEnd --
//
//

function togglePedalEnd(id, line, field) {
	console.log("PEDAL END TOGGLE", line);
	var text = EDITOR.session.getLine(line-1);
	if (text.match(/^!/)) {
		return;
	}
	if (text.match(/^\*/)) {
		return;
	}
	var addline = true;
	var ptext = EDITOR.session.getLine(line);
	if (ptext.match(/^\*/) && ptext.match(/\*Xped/)) {
			addline = false;
	}
	var newid;
	if (!addline) {
		// delete existing pedal line
		console.log("DELETING PEDAL END");
		EDITOR.session.replace(new Range(line, 0, line+1, 0), "");
		newid = id;
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		return;
	}
	var fields = text.split("\t");
	for (var i=0; i<fields.length; i++) {
		// inserting in the first column, but maybe should be
		// the first **kern dataspine...
		fields[i] = "*";
	}
	fields[0] = "*Xped";

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	console.log("ADDING END PEDAL LINE");
	var newline = fields.join("\t") + "\n";
	//var oldline = EDITOR.session.getLine(line);
	EDITOR.session.replace(new Range(line, 0, line, 0), newline);
	newid = id;
  	console.log("OLDID", id, "NEWID", newid);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;

	FreezeRendering = freezeBackup;
	displayNotation();
}



//////////////////////////////
//
// toggleMajorTrill --
//

function toggleMajorTrill(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/T/i)) {
		// add trill
		token = token.replace(/T/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "T" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else if (token.match(/t/)) {
		// switch to major second trill
		token = token.replace(/t/g, "T");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove trill
		token = token.replace(/T/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleArpeggio --
//

function toggleArpeggio(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/:/i)) {
		// add marcato
		token = token.replace(/:/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + ":" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
		token = token.replace(/:/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleFermata --
//

function toggleFermata(id, line, field) {
	console.log("TOGGLING FERMATA");
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (!token.match(/;/i)) {
		// add marcato
		token = token.replace(/;/gi, "");
		token = token.replace(/([ra-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + ";" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
		token = token.replace(/;/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}

//////////////////////////////
//
// toggleTenuto --
//

function toggleTenuto(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/~/)) {
		// add marcato
		token = token.replace(/~+/g, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "~" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
		token = token.replace(/~/g, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleStaccatissimo --
//

function toggleStaccatissimo(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/`/)) {
		// add marcato
		token = token.replace(/`/g, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "`" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
		token = token.replace(/`/g, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleVisibility -- Still have to think about chords.
//

function toggleVisibility(id, line, field) {
	var token = getEditorContents(line, field);

	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}

	if (token.match(/yy/)) {
		// token is invisible, so make it visible again.
		token = token.replace(/yy/, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// make token invisible (deal with chords later)
		token = token + "yy";
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



/////////////////////////////
//
// setEditorContents --
//

function setEditorContents(line, field, token, id) {

	var linecontent = EDITOR.session.getLine(line-1);
	var range = new Range(line-1, 0, line-1, linecontent.length);

	var components = linecontent.split("\t");
	components[field-1] = token;
	linecontent = components.join("\t");

	var column = 0;
	for (var i=0; i<field-1; i++) {
		column += components[i].length;
	}
	EDITINGID = id;

	EDITOR.session.replace(range, linecontent);
	EDITOR.gotoLine(line, column+1);

	RestoreCursorNote = id;
}



//////////////////////////////
//
// getEditorContents -- Allow subtokens perhaps.
//

function getEditorContents(line, field) {
	var token = "";

	var linecontent = EDITOR.session.getLine(line-1);

	var col = 0;
	if (field > 1) {
		var tabcount = 0;
		for (i=0; i<linecontent.length; i++) {
			col++;
			if (linecontent[i] == '\t') {
				tabcount++;
			}
			if (tabcount == field - 1) {
				break;
			}
		}
	}
	for (var c=col; c<linecontent.length; c++) {
		if (linecontent[c] == '\t') {
			break;
		}
		if (linecontent[c] == undefined) {
			console.log("undefined index", c);
			break;
		}
		token += linecontent[c];
	}

	return token;
}



