{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       addNullLine.js
// Web Address:    https://verovio.humdrum.org/scripts/addNullLine.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Add a line of tokens based on how many tokens
//                the given line has.  However, if the current line is an
//                exclusive interpretation, then instead add a **dynam column
//                on the right side of the cursor's column.
//
{% endcomment %}


function addNullLine(token, exinterp, row) {
	if (!token) {
		token = ".";
	}
	if (!exinterp) {
		exinterp = "**blank";
	}
	if (!row) {
		var location = EDITOR.getCursorPosition();
		row = location.row;
	}
	var currentline = EDITOR.session.getLine(row);
	if (currentline.match(/^!!/)) {
		// don't know how many spines to add
		return;
	}
	if (currentline.match(/^$/)) {
		// empty line: don't know how many spines to add
		return;
	}
	if (currentline.match(/^\*\*/)) {
		// can't add spines before exclusive interpretation
		// so instead add a **dynam spine on the right of the
		// cursor's current column.
		addSpineToRight(exinterp, currentline, location);
		return;
	}

	var newline = createNullLine(token, currentline);
	EDITOR.session.insert({row:row, column:0}, newline);
}



