{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleMajorTrill.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleMajorTrill.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function toggleMajorTrill(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/T/i)) {
		// add trill
		token = token.replace(/T/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/,
				function(str,p1) { return p1 ? p1 + "T" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else if (token.match(/t/)) {
		// switch to major second trill
		token = token.replace(/t/g, "T");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove trill
		token = token.replace(/T[<>]*/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



