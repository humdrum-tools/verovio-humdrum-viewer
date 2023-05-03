{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       rightEndMoveBack.js
// Web Address:    https://verovio.humdrum.org/scripts/rightEndMoveBack.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function rightEndMoveBack(id, line, field, number, line2, field2, number2) {
	// console.log("RIGHT END MOVE BACKWARD");
	var token1 = getEditorContents(line2, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}
	var i = parseInt(line2) - 2; // -1 for 0-index and -1 for line after
	var counter = 0;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	while (i >= 0) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i--;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != target) {
			i--;
			continue;
		}
		break;
	}

	if (i <= 0) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 <= line) {
		// do not pass slur start
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurend = deleteSlurEnd(id, line2, field2, number2);
	if (slurend !== "") {
		addSlurEnd(id, i+1, field, slurend);
	}
	// need to remove "N" if "N1" (in verovio)
	var newend = "L" + (i+1) + "F" + field2 + "N" + number2;
	var newid = id.replace(/-[^-]+$/, "-" + newend);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 0;
}



