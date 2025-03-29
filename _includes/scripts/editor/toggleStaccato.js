{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleStaccato.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleStaccato.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function toggleStaccato(id, line, field) {
console.warn("TOGGLING STACCATO AT ID", id);
	var counter = 0;
	var maxline = EDITOR.session.getLength();
	var i = line;
	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	while ((line < maxline) && (counter < target)) {
		var token = getEditorContents(line, field);
		if (token.match(/^\*/) || token.match(/^=/) || token.match(/^!/) || (token === "")) {
			line++;
			continue;
		}
		if (token === ".") {
			// nothing to do, just a null data token
			line++;
			continue;
		}
		if (token.match("r")) {
			// not a note
			line++;
			continue;
		}
		if (!token.match("'")) {
			// add staccato
			token = token.replace(/'+/, "");
			token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/g,
					function(str,p1) { return p1 ? p1 + "'" : str});
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		} else {
			// remove staccato
			token = token.replace(/'[<>]*/g, "");
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		}
	}
	InterfaceSingleNumber = 0;
	FreezeRendering = freezeBackup;
	displayNotation();
}



