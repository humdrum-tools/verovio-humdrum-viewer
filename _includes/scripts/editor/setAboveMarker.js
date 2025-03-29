{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       setAboveMarker.js
// Web Address:    https://verovio.humdrum.org/scripts/setAboveMarker.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Add layout code for above parameter.
//
{% endcomment %}


function setAboveMarker(id, line, field, number, category) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	var editQ = false;
	var lastline = line - 1;
	var ptoken = getEditorContents(lastline, field);
	var idlineadj = 0;
	if (!ptoken.match(/^!LO/)) {
		createEmptyLine(line);
		idlineadj = 1;
		line += 1;
		lastline = line - 1;
		ptoken = "!";
		editQ = true;
	}

	if (ptoken.match(/^!LO/)) {
		if (ptoken.match(/:b(?=:|=|$)/)) {
			// Change to :a (not very elegant if there is a parameter starting with "b":
			ptoken = ptoken.replace(/:b(?=:|=|$)/, ":a");
			editQ = true;
		} else if (ptoken.match(/:a(:|=|$)/)) {
			// Do nothing
		} else {
			// Assuming no other parameters, but may be clobbering something.
			// (so fix later):
			ptoken = "!LO:" + category + ":a"
			editQ = true;
		}
	} else if (ptoken == "!") {
		ptoken = "!LO:" + category + ":a";
		editQ = true;
	} else {
		console.log("ERROR TOGGLING ABOVE DIRECTION");
	}

	if (idlineadj != 0) {
		id = id.replace("L"  + (line-1), "L" + (line + idlineadj - 1));
	}

	if (editQ) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(lastline, field, ptoken, id);
	}
}



