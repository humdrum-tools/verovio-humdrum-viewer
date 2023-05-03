{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       togglePedalEnd.js
// Web Address:    https://verovio.humdrum.org/scripts/togglePedalEnd.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//                 InterfaceSingleNumber == 4 => *Xlig toggle instead of *Xped
//                 InterfaceSingleNumber == 5 => *Xcol toggle instead of *Xped
//
{% endcomment %}


//////////////////////////////
//
// togglePedalEnd --
// 
//

function togglePedalEnd(id, line, field) {
	if (InterfaceSingleNumber == 4) {
		toggleLigatureEnd(id, line, field);
		InterfaceSingleNumber = 0;
		return;
	} else if (InterfaceSingleNumber == 5) {
		toggleColorationEnd(id, line, field);
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
	var ptext = EDITOR.session.getLine(line);
	if (ptext.match(/^\*/) && ptext.match(/\*Xped/)) {
			addline = false;
	}
	var newid;
	if (!addline) {
		// delete existing pedal line
		// console.log("DELETING PEDAL END");
		EDITOR.session.replace(new Range(line, 0, line+1, 0), "");
		newid = id;
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var newline = createNullLine("*", text);
	newline = newline.replace(/^(\t*)\*(\t*)/, "$1*Xped$2");
	EDITOR.session.replace(new Range(line, 0, line, 0), newline);
	newid = id;
  	console.log("OLDID", id, "NEWID", newid);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;

	FreezeRendering = freezeBackup;
	displayNotation();

}



