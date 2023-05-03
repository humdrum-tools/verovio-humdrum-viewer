{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       createEmptyLine.js
// Web Address:    https://verovio.humdrum.org/scripts/createEmptyLine.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Create a null local comment line.  See addNullLine()
//                 which can probably replace this function.
//
{% endcomment %}


function createEmptyLine(line) {
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}

	var text = EDITOR.session.getLine(line - 1);
	var output = "";
	if (text[0] == '\t') {
		output += '\t';
	} else {
		output += '!';
	}
	var i;
	for (i=1; i<text.length; i++) {
		if (text[i] == '\t') {
			output += '\t';
		} else if ((text[i] != '\t') && (text[i-1] == '\t')) {
			output += '!';
		}
	}
	output += "\n" + text;

	var range = new Range(line-1, 0, line-1, text.length);
	EDITOR.session.replace(range, output);

	// don't redraw the data
	FreezeRendering = freezeBackup;
}



