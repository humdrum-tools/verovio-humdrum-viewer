{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       createNullLine.js
// Web Address:    https://verovio.humdrum.org/scripts/createNullLine.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function createNullLine(token, textline) {
	var newline = "";
	if (textline[0] == '\t') {
		newline += '\t';
	} else {
		newline += token;
	}
	var i;
	for (i=1; i<textline.length; i++) {
		if (textline[i] == '\t') {
			newline += '\t';
		} else if ((textline[i] != '\t') && (textline[i-1] == '\t')) {
			newline += token;
		}
	}
	newline += "\n";
	return newline;
}



