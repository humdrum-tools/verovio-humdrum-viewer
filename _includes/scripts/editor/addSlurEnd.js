{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       addSlurEnd.js
// Web Address:    https://verovio.humdrum.org/scripts/addSlurEnd.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function addSlurEnd(id, line, field, slurend) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			// need to insert new slur before first one
			newtoken = token.substring(0, i+1);
			newtoken += slurend;
			newtoken += token.substring(i+1);
		}
	}

	if (newtoken === "") {
		newtoken = token + slurend;
	}

	var pcount = 0;
	for (i=0; i<newtoken.length; i++) {
		if (newtoken[i] == '(') {
			pcount++;
		}
	}

	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



