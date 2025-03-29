{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       deleteDirectionMarker.js
// Web Address:    https://verovio.humdrum.org/scripts/deleteDirectionMarker.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Remove layout code for hairpins.
//
{% endcomment %}


function deleteDirectionMarker(id, line, field, number, category) {
	line = parseInt(line);
	var token = getEditorContents(line-1, field);
	if (token[0] !== "!") {
		// don't know what to do.
		return;
	}
	var editQ = false;
	var re = new RegExp("^!LO:" + category + ":");
	if (token.match(re)) {
		token = "!";
		editQ = true;
	} else {
		// don't know what to do
		return;
	}
	if (!editQ) {
		return;
	}

	setEditorContents(line-1, field, token, id, true);

	var text = EDITOR.session.getLine(line-2);
	if (text.match(/^[!\t]+$/)) {
		// remove line
		var range = new Range(line-2, 0, line-1, 0);

		EDITOR.session.remove(range);

		RestoreCursorNote = id.replace("L" + (line), "L" + (line - 1));
		displayNotation();
		highlightIdInEditor(RestoreCursorNote);
	}
}



