{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       setEditorContents.js
// Web Address:    https://verovio.humdrum.org/scripts/setEditorContents.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function setEditorContents(line, field, token, id, dontredraw) {
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}

	var i;
	var linecontent = EDITOR.session.getLine(line-1);
	var range = new Range(line-1, 0, line-1, linecontent.length);

	var components = linecontent.split(/\t+/);
	components[field-1] = token;
	
	// count tabs between fields
	var tabs = [];
	for (i=0; i<components.length + 1; i++) {
		tabs[i] = "";
	}
	var pos = 0;
	if (linecontent[0] != '\t') {
		pos++;
	}
	for (i=1; i<linecontent.length; i++) {
		if (linecontent[i] == '\t') {
			tabs[pos] += '\t';
		} else if ((linecontent[i] != '\t') && (linecontent[i-1] == '\t')) {
			pos++;
		}
	}

	var newlinecontent = "";
	for (i=0; i<tabs.length; i++) {
		newlinecontent += tabs[i];
		if (components[i]) {
			newlinecontent += components[i];
		}
	}

	// newlinecontent = components.join("\t");

	var column = 0;
	for (i=0; i<field-1; i++) {
		column += components[i].length;
		column += tabs[i].length;
	}
	EDITINGID = id;

	EDITOR.session.replace(range, newlinecontent);
	EDITOR.gotoLine(line, column+1);

	RestoreCursorNote = id;
	FreezeRendering = freezeBackup;
	if (!dontredraw) {
		displayNotation();
	}
}



