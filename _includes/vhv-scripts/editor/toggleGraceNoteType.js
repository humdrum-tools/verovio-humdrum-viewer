{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleGraceNoteType.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleGraceNoteType.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function toggleGraceNoteType(id, line, field) {
	var token = getEditorContents(line, field);
	var subtokens = token.split(" ");
	for (var i=0; i<subtokens.length; i++) {
		if (subtokens[i].match("qq")) {
			subtokens[i] = subtokens[i].replace(/qq/g, "q");
		} else if (subtokens[i].match("q")) {
			subtokens[i] = subtokens[i].replace(/q/g, "qq");
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



