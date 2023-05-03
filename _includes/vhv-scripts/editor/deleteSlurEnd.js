{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       deleteSlurEnd.js
// Web Address:    https://verovio.humdrum.org/scripts/deleteSlurEnd.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function deleteSlurEnd(id, line, field, number) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	var counter = 0;
	var output = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == ')') {
			counter++;
			output = ')';
		}
		if (counter == number) {
			counter++;
			continue;
		}
		newtoken += token[i];
	}

	// console.log("OLDTOKEN1", token, "NEWTOKEN1", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

	return output;
}



