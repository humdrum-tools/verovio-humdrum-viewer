{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleMordent.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleMordent.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


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



