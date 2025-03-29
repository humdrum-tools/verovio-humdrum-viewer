{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       togglePedalStart.js
// Web Address:    https://verovio.humdrum.org/scripts/togglePedalStart.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Inserting before LO:TX is a problem
//                 InterfaceSingleNumber == 4 => *Xlig toggle instead of *Xped
//                 InterfaceSingleNumber == 5 => *Xcol toggle instead of *Xped
//
{% endcomment %}


function togglePedalStart(id, line, field) {
	if (InterfaceSingleNumber == 4) {
		toggleLigatureStart(id, line, field);
		InterfaceSingleNumber = 0;
		return;
	} else if (InterfaceSingleNumber == 5) {
		toggleColorationStart(id, line, field);
		InterfaceSingleNumber = 0;
		return;
	}

	var text = EDITOR.session.getLine(line-1);
	if (text.match(/^!/)) {
		return;
	}
	if (text.match(/^\*/)) {
		return;
	}
	var addline = true;
	var ptext = EDITOR.session.getLine(line-2);
	if (ptext.match(/^\*/) && ptext.match(/\*ped/)) {
			addline = false;
	}
	var newid;
	if (!addline) {
		// delete existing pedal line
		console.log("DELETING PEDAL START");
		EDITOR.session.replace(new Range(line-2, 0, line-1, 0), "");
		newid = id.replace(/L\d+/, "L" + (line-1));
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		return;
	}

	// inserting in the first column, but should more
	// correctly be the first **kern dataspine...
	var newline = createNullLine("*", text);
	newline = newline.replace(/^(\t*)\*(\t*)/, "$1*ped$2");
	EDITOR.session.insert({row:line-1, column:0}, newline);
	newid = id.replace(/L\d+/, "L" + (line+1));
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;
}



