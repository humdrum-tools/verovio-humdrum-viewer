{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       setBeamBelowMarker.js
// Web Address:    https://verovio.humdrum.org/scripts/setBeamBelowMarker.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function setBeamBelowMarker(id, line, field) {
	// console.log("SET BEAM BELOW", token, line, field, id);
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^LJKk]*)([LJKk]+)([" + above + below + "]*)([^LJKk]*)");
	var matches = re.exec(token);
	if (!matches) {
		return;
	} else {
		var newtoken = matches[1];
		newtoken += matches[2];
		newtoken += below;
		newtoken += matches[4];
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



