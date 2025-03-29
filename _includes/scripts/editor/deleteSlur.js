{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       deleteSlur.js
// Web Address:    https://verovio.humdrum.org/scripts/deleteSlur.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function deleteSlur(id, line, field, number, line2, field2, number2) {
	// console.log("DELETING SLUR");
	var freezeBackup = FreezeRendering;
	deleteSlurStart(id, line, field, number);
	deleteSlurEnd(id, line2, field2, number2);
	FreezeRendering = freezeBackup;
	RestoreCursorNote = null;
	HIGHLIGHTQUERY = null;
	if (!FreezeRendering) {
		displayNotation();
	}
}



