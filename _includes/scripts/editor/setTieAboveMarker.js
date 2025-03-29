{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       setTieAboveMarker.js
// Web Address:    https://verovio.humdrum.org/scripts/setTieAboveMarker.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


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



