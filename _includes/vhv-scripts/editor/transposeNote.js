{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       transposeNote.js
// Web Address:    https://verovio.humdrum.org/scripts/transposeNote.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function transposeNote(id, line, field, subfield, amount)  {
	// console.log("TRANSPOSE Note", line, field, subfield, id);
	var token = getEditorContents(line, field);

	amount = parseInt(amount);
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	if (target > 1) {
		if (amount > 0) {
			amount = target - 1;
		} else {
			amount = -target + 1;
		}
		InterfaceSingleNumber = 0;
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



