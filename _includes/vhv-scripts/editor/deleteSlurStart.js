{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       deleteSlurStart.js
// Web Address:    https://verovio.humdrum.org/scripts/deleteSlurStart.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function deleteSlurStart(id, line, field, number) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	var counter = 0;
	var output = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		if (counter != number) {
			newtoken += token[i];
			continue;
		}
		output += token[i];
		if (token[i+1] == '>') {
			output += '>';
			i++;
		} else if (token[i+1] == '<') {
			output += '<';
			i++;
		}
		counter++;
	}

	// console.log("OLDTOKEN1", token, "NEWTOKEN1", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

	return output;
}



