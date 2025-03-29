{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleExplicitAccidental.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleExplicitAccidental.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


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



