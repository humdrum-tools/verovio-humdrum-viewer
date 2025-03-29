{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       addSlurStart.js
// Web Address:    https://verovio.humdrum.org/scripts/addSlurStart.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function addSlurStart(id, line, field, slurstart) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	for (var i=token.length-1; i>=0; i--) {
		if (token[i] == '(') {
			// need to insert new slur after last one
			newtoken = token.substring(0, i+1);
			newtoken += slurstart;
			newtoken += token.substring(i+1);
			break;
		}
	}

	if (newtoken === "") {
		newtoken = slurstart + token;
	}

	var pcount = 0;
	for (i=0; i<newtoken.length; i++) {
		if (newtoken[i] == '(') {
			pcount++;
		}
	}

	var newid = id.replace(/L\d+/, "L" + line);
	newid = newid.replace(/F\d+/, "F" + field);
	newid = newid.replace(/N\d+/, "N" + pcount);
	// console.log("OLDTOKEN2", token, "NEWTOKEN2", newtoken);
	// console.log("OLDID", id, "NEWID", newid);
	if (newtoken !== token) {
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		setEditorContents(line, field, newtoken, newid);
	}
}



