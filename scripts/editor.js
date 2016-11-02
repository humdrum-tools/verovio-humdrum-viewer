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
	var line  = id.match(/L(\d+)/)[1];
	var field = id.match(/F(\d+)/)[1];
	var name  = id.match(/^([a-z]+)-/)[1];
	if (!(line && field)) {
		return;
	}
	if (line < 1 || field < 1) {
		return;
	}

	if (name === "note") {
		if (key === "i") {
			toggleVisibility(id, line, field);
		}
		if (key === "s") {
			toggleSharp(id, line, field);
		}
		if (key === "f") {
			toggleFlat(id, line, field);
		}
		if (key === "n") {
			toggleNatural(id, line, field);
		}
	}
	if (name === "rest") {
		if (key === "i") {
			toggleVisibility(id, line, field);
		}
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
	EDITOR.session.replace(range, linecontent);
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



