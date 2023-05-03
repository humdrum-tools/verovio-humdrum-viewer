{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       leftEndMoveForward.js
// Web Address:    https://verovio.humdrum.org/scripts/leftEndMoveForward.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function leftEndMoveForward(id, line, field, number, line2, field2, number2) {
	console.log("LEFT END MOVE FORWARD");
	var token1 = getEditorContents(line, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}

	var i = parseInt(line); // -1 for 0-index and +1 for line after
	var counter = 0;
	var size = EDITOR.session.getLength();
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	while (i < size) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i++;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != target) {
			i++;
			continue;
		}
		break;
	}

	if (i >= size) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 >= line2) {
		// do not pass slur end
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurstart = deleteSlurStart(id, line, field, number);
	if (slurstart !== "") {
		addSlurStart(id, i+1, field, slurstart);
	}
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 0;
}



