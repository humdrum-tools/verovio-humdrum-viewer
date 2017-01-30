//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Mon Oct 31 14:42:36 PDT 2016
// Filename:       editor.js
// Web Address:    http://verovio.humdrum.org/scripts/editor.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Processing key commands to edit music.
//

//////////////////////////////
//
// processNontationKey -- Also consider whether MEI or Humdrum is
//    currently being displayed.
//

function processNotationKey(key, element) {
	var id    = element.id;
console.log("PROCESSING ", id);
	var matches;

	if (matches = id.match(/L(\d+)/)) {
		var line = matches[1];
	} else {
		return; // required
	}
	if (matches = id.match(/F(\d+)/)) {
		var field = matches[1];
	} else {
		return; // required
	}
	if (matches = id.match(/S(\d+)/)) {
		var subfield = matches[1];
	}
	if (matches = id.match(/N(\d+)/)) {
		var number = matches[1];
	} else {
		number = 1;
	}
	if (matches = id.match(/^([a-z]+)-/)) {
		var name = matches[1];
	} else {
		return; // required
	}
	
	var name  = id.match(/^([a-z]+)-/)[1];

	if (!(line && field)) {
		return;
	}
	if (line < 1 || field < 1) {
		return;
	}
console.log("PROCESSING COMMAND FOR ", name);

	if (name === "note") {
		if (key === "y") { toggleVisibility(id, line, field); }
		else if (key === "#") { toggleSharp(id, line, field); }
		else if (key === "-") { toggleFlat(id, line, field); }
		else if (key === "n") { toggleNatural(id, line, field); }
		else if (key === "'") { toggleStaccato(id, line, field); }
		else if (key === "^") { toggleAccent(id, line, field); }
		else if (key === "^^") { toggleMarcato(id, line, field); }
		else if (key === "~") { toggleTenuto(id, line, field); }
		else if (key === "t") { toggleMinorTrill(id, line, field); }
		else if (key === "T") { toggleMajorTrill(id, line, field); }
		else if (key === "`") { toggleStaccatissimo(id, line, field); }
		else if (key === ";") { toggleFermata(id, line, field); }
		else if (key === ":") { toggleArpeggio(id, line, field); }
	} else if (name === "rest") {
		if (key === "y") { toggleVisibility(id, line, field); }
		else if (key === ";") { toggleFermata(id, line, field); }
	} else if (name === "slur") {
		if (key === "a") { setSlurAboveMarker(id, line, field, number); }
		else if (key === "b") { setSlurBelowMarker(id, line, field, number); }
		else if (key === "d") { deleteSlurDirectionMarker(id, line, field, number); }
		else if (key === "f") { flipSlurDirection(id, line, field, number); }
	} else if (name === "tie") {
		// need to fix tie functions to deal with chord notes (subfield values):
		if (key === "a") { setTieAboveMarker(id, line, field, subfield); }
		else if (key === "b") { setTieBelowMarker(id, line, field, subfield); }
		else if (key === "d") { deleteTieDirectionMarker(id, line, field, subfield); }
		else if (key === "f") { flipTieDirection(id, line, field, subfield); }
	} else if (name === "beam") {
		if (key === "a") { setBeamAboveMarker(id, line, field); }
		else if (key === "b") { setBeamBelowMarker(id, line, field); }
		else if (key === "d") { deleteBeamDirectionMarker(id, line, field); }
		else if (key === "f") { flipBeamDirection(id, line, field); }
	}
}



//////////////////////////////
//
// setBeamAboveMarker --
//

function setBeamAboveMarker(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	console.log("TOGGLE BEAM ABOVE", token, line, field, id);
	var counter = 0;
	var newtoken = "";
	
	var matches = token.match("([^LJKk]*)([LJKk]+)([<>]*)([^LJKk]*)");
	if (!matches) {
		return;
	}
	
	var newtoken = matches[1];
	newtoken += matches[2];
	newtoken += ">";
	newtoken += matches[4];
	
   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
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
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	console.log("TOGGLE BEAM ABOVE", token, line, field, id);
	var counter = 0;
	var newtoken = "";
	
	var matches = token.match("([^LJKk]*)([LJKk]+)([<>]*)([^LJKk]*)");
	if (!matches) {
		return;
	}
	
	var newtoken = matches[1];
	newtoken += matches[2];
	newtoken += "<";
	newtoken += matches[4];
	
   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// flipBeamDirection --
//

function flipBeamDirection(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	console.log("TOGGLE BEAM DIRECTION", token, line, field, id);
	var counter = 0;
	var newtoken = "";
	
	var matches = token.match("([^LJKk]*)([LJKk]+)([<>]*)([^LJKk]*)");
	if (!matches) {
		return;
	}

	var olddir = matches[3];
	
	var newtoken = matches[1];
	newtoken += matches[2];
	if (olddir === "<") {
		newtoken += ">";
	} else if (olddir === ">") {
		newtoken += "<";
	} else { 
		newtoken += "<";
	}
	newtoken += matches[4];
	
   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
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
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	console.log("DELETE BEAM DIRECTION", token, line, field, id);
	var counter = 0;
	var newtoken = "";
	
	var matches = token.match("([^LJKk]*)([LJKk]+)([<>]*)([^LJKk]*)");
	if (!matches) {
		return;
	}
	
	var newtoken = matches[1];
	newtoken += matches[2];
	newtoken += matches[4];
	
   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// setSlurAboveMarker --
//

function setSlurAboveMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	// console.log("TOGGLE SLUR ABOVE", token, line, field, number, id);
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
		if (token[i+1] == '>') {
			counter++;
			continue;
		} else if (token[i+1] == '<') {
			newtoken += '>';
			i++;
			counter++;
			continue;
		} else {
			newtoken += '>';
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
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	// console.log("TOGGLE SLUR BELOW", token, line, field, number, id);
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
		if (token[i+1] == '<') {
			counter++;
			continue;
		} else if (token[i+1] == '>') {
			newtoken += '<';
			i++;
			counter++;
			continue;
		} else {
			newtoken += '<';
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
// flipSlurDirection --
//

function flipSlurDirection(id, line, field, number) {
	var token = getEditorContents(line, field);
	console.log("FLIP SLUR DIRECTION", token, line, field, number, id);
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	// console.log("TOGGLE SLUR DIRECTION", token, line, field, number, id);
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
		if (token[i+1] == '<') {
			newtoken += '>';
			i++;
			counter++;
			continue;
		} else if (token[i+1] == '>') {
			newtoken += '<';
			i++;
			counter++;
			continue;
		} else {
			newtoken += '<';
			counter++;
			continue;
		}
	}

   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
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
	console.log("DELETE SLUR DIRECTION", token, line, field, number, id);
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
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
		if (token[i+1] == '<') {
			i++;
			counter++;
			continue;
		} else if (token[i+1] == '>') {
			i++;
			counter++;
			continue;
		} else {
			counter++;
			continue;
		}
	}

   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// setTieAboveMarker --
//

function setTieAboveMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	console.log("TOGGLE TIE ABOVE", token, line, field, number, id);
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if ((token[i] == '[') || (token[i] == '_')) {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == '>') {
			counter++;
			continue;
		} else if (token[i+1] == '<') {
			newtoken += '>';
			i++;
			counter++;
			continue;
		} else {
			newtoken += '>';
			counter++;
			continue;
		}
	}

   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
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

function setTieBelowMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	console.log("TOGGLE SLUR BELOW", token, line, field, number, id);
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if ((token[i] == '[') || (token[i] == '_')) {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == '<') {
			counter++;
			continue;
		} else if (token[i+1] == '>') {
			newtoken += '<';
			i++;
			counter++;
			continue;
		} else {
			newtoken += '<';
			counter++;
			continue;
		}
	}

   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// flipTieDirection --
//

function flipTieDirection(id, line, field, number) {
	var token = getEditorContents(line, field);
	console.log("FLIP SLUR DIRECTION", token, line, field, number, id);
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	// console.log("TOGGLE SLUR DIRECTION", token, line, field, number, id);
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if ((token[i] == '[') || (token[i] == '_')) {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == '<') {
			newtoken += '>';
			i++;
			counter++;
			continue;
		} else if (token[i+1] == '>') {
			newtoken += '<';
			i++;
			counter++;
			continue;
		} else {
			newtoken += '<';
			counter++;
			continue;
		}
	}

   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
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

function deleteTieDirectionMarker(id, line, field, number) {
	console.log("DELETE SLUR DIRECTION", token, line, field, number, id);
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if ((token[i] == '[') || (token[i] == '_')) {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == '<') {
			i++;
			counter++;
			continue;
		} else if (token[i+1] == '>') {
			i++;
			counter++;
			continue;
		} else {
			counter++;
			continue;
		}
	}

   console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleSharp --
//

function toggleSharp(id, line, field) {
	if (line < 1 || field < 1) {
		return;
	}
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match("#")) {
		// add sharp
		token = token.replace(/[#n-]+/, "");
		token = token.replace(/([a-gA-G]+)/, 
				function(str,p1) { return p1 ? p1 + "#" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove sharp
		token = token.replace(/#+/, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleFlat --
//

function toggleFlat(id, line, field) {
	if (line < 1 || field < 1) {
		return;
	}
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match("-")) {
		// add flat
		token = token.replace(/[#n-]+/, "");
		token = token.replace(/([a-gA-G]+)/, 
				function(str,p1) { return p1 ? p1 + "-" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove sharp
		token = token.replace(/-+/, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleNatural --
//

function toggleNatural(id, line, field) {
	if (line < 1 || field < 1) {
		return;
	}
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match("n")) {
		// add natural
		token = token.replace(/[#n-]+/, "");
		token = token.replace(/([a-gA-G]+)/, 
				function(str,p1) { return p1 ? p1 + "n" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove sharp
		token = token.replace(/n+/, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleStaccato --
//

function toggleStaccato(id, line, field) {
	if (line < 1 || field < 1) {
		return;
	}
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
	if (line < 1 || field < 1) {
		return;
	}
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
	if (line < 1 || field < 1) {
		return;
	}
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
// toggleMinorTrill --
//

function toggleMinorTrill(id, line, field) {
	if (line < 1 || field < 1) {
		return;
	}
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
		// add marcato
		token = token.replace(/T/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "t" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
		token = token.replace(/T/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleMajorTrill --
//

function toggleMajorTrill(id, line, field) {
	if (line < 1 || field < 1) {
		return;
	}
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
		// add marcato
		token = token.replace(/T/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy]*)/, 
				function(str,p1) { return p1 ? p1 + "T" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
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
	if (line < 1 || field < 1) {
		return;
	}
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
	if (line < 1 || field < 1) {
		return;
	}
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
	if (line < 1 || field < 1) {
		return;
	}
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
	if (line < 1 || field < 1) {
		return;
	}
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
	if (line < 1 || field < 1) {
		return;
	}
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
	if (line < 1) {
		return;
	}
	if (field < 1) {
		return;
	}

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
console.log("EDITING ID ", id);

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
	if (line < 1) {
		return;
	}
	if (field < 1) {
		return;
	}

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



