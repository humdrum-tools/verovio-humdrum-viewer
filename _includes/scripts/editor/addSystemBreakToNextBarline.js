{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Wed Jun  5 02:08:33 PDT 2024
// Last Modified:  Wed Jun  5 02:08:40 PDT 2024
// Filename:       addSystemBreakToNextBarline.js
// Web Address:    https://verovio.humdrum.org/scripts/addSystemBreakToNextBarline.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Add a system break to the next barline (or remove break if
//                 there is already one).
//
{% endcomment %}


function addSystemBreakToNextBarline() {
	let location = EDITOR.getCursorPosition();
	let index = location.row;

	var contents = getTextFromEditor().split(/\r?\n/);

	let barIndex = -1;
	for (let i=index; i<contents.length; i++) {
		if (contents[i].match(/^=/)) {
			barIndex = i;
			break;
		}
	}
	if (barIndex < 1) {
		return;
	}

	console.warn("LO", contents[barIndex - 1]);	

	if (contents[barIndex-1].match(/^!!LO:[LP]B:/)) {
		// Remove system break line
		var Range = ace.require("ace/range").Range;
		var range = new Range(barIndex-1, 0, barIndex, 0);
		EDITOR.session.remove(range);
		return;
	}

	let text = "!!LO:LB:g=original";
	let textIndex = barIndex - 1;
	EDITOR.session.insert({ row: textIndex + 1, column: 0 }, text + '\n');

	// Adjust the cursor position if it is below the inserted line
	// if (cursorPosition.row >= lineNumber) {
	// 	cursorPosition.row += 1;
	// }

	EDITOR.moveCursorToPosition(location);
}



