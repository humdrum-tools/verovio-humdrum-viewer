{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleFermata.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleFermata.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function toggleFermata(id, line, field) {
	console.log("TOGGLING FERMATA");
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (!token.match(/;/i)) {
		// add marcato
		token = token.replace(/;/gi, "");
		token = token.replace(/([ra-gA-G]+[-#nXxYy<>]*)/,
				function(str,p1) { return p1 ? p1 + ";" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
		token = token.replace(/;[<>]*/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



