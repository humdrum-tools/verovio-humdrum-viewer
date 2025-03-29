{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleSharp.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleSharp.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Show or hide a sharp or double sharp on a note.
//
{% endcomment %}


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
			newtoken = token.replace(/#+i?/, "");
		}
		InterfaceSingleNumber = 0;
	} else {
		if (token.match("##") || !token.match("#")) {
			// add sharp
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/,
					function(str,p1) { return p1 ? p1 + "#" : str});
		} else {
			// remove sharp
			newtoken = token.replace(/#+i?/, "");
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



