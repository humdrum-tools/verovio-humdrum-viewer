{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleTenuto.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleTenuto.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function toggleTenuto(id, line, field) {
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

		if (!token.match(/~/)) {
			// add marcato
			token = token.replace(/~+/g, "");
			token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/,
					function(str,p1) { return p1 ? p1 + "~" : str});
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		} else {
			// remove marcato
			token = token.replace(/~[<>]*/g, "");
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			setEditorContents(line, field, token, id);
			counter++;
		}

	}
	InterfaceSingleNumber = 0;
	FreezeRendering = freezeBackup;
	displayNotation();
}



