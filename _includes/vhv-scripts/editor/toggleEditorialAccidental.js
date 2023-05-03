{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleEditorialAccidental.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleEditorialAccidental.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


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



