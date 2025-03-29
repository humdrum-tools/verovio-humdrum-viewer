{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       setSlurBelowMarker.js
// Web Address:    https://verovio.humdrum.org/scripts/setSlurBelowMarker.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function setSlurBelowMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		// nothing to do, just a null data token
		return;
	}
	var token = getEditorContents(line, field);
	// console.log("TOGGLE SLUR BELOW", token, line, field, number, id);

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == below) {
			counter++;
			continue;
		} else if (token[i+1] == above) {
			newtoken += below;
			i++;
			counter++;
			continue;
		} else {
			newtoken += below;
			counter++;
			continue;
		}
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



