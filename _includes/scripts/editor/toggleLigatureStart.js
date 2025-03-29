{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       toggleLigatureStart.js
// Web Address:    https://verovio.humdrum.org/scripts/toggleLigatureStart.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function toggleLigatureStart(id, line, field) {
	var addline = true;
	var ptext = EDITOR.session.getLine(line);
	if (ptext.match(/^\*/) && ptext.match(/\*lig/)) {
			// if there is an lig line don't add one
			addline = false;
	}
	if (!addline) {
		// Already a line with one or more *lig exists.  Toggle *lig on/off
		// for given field and delete line if only contains * tokens.
		let oldline = EDITOR.session.getLine(line);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		if (fields[field-1] === "*") {
			fields[field-1] = "*lig";
		} else {
			fields[field-1] = "*";
		}
		let newline = fields.join("\t");
		if (newline.match(/^[*\t]+$/)) {
			// blank line so delete it
			console.log("DELETING BLANK LINE");
			EDITOR.session.replace(new Range(line-2, 0, line-1, 0), "");
			newid = id.replace(/L\d+/, "L" + (line-1));
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		} else {
			// update line
			console.log("UPDATING LINE:", newline);
			newline += "\n";
			EDITOR.session.replace(new Range(line, 0, line+1, 0), newline);
			var newid = id;
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		}
	} else {
		// Add an *lig on a line after the selected line at the given field.
		let oldline = EDITOR.session.getLine(line-1);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		let fieldcount = fields.length;
		let newline = "";
		for (let i=0; i<fieldcount; i++) {
			newline += "*";
			if (i == field - 1) {
				newline += "lig";
			}
			if (i < fieldcount - 1) {
				newline += "\t";
			}
		}
		newline += "\n";
		EDITOR.session.insert({row:line-1, column:0}, newline);
		newid = id.replace(/L\d+/, "L" + (line+1));
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
	}
}



