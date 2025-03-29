{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleFlat.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleFlat.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Show or hide a flat or double flat on a note.
//
{% endcomment %}


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
			newtoken = token.replace(/-+i?/, "");
		}
		InterfaceSingleNumber = 0;
	} else {
		if (token.match("--") || !token.match("-")) {
			// add flat
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/,
					function(str,p1) { return p1 ? p1 + "-" : str});
		} else {
			// remove flat
			newtoken = token.replace(/-+i?/, "");
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



