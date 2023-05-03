{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       setStemBelowMarker.js
// Web Address:    https://verovio.humdrum.org/scripts/setStemBelowMarker.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function setStemBelowMarker(id, line, field) {
	console.log("STEM BELOW", line, field, id);
	var token = getEditorContents(line, field);
	console.log("TOKEN EXTRACTED IS", token);

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



