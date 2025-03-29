{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Wed Jun  5 02:08:33 PDT 2024
// Last Modified:  Wed Jun  5 02:08:40 PDT 2024
// Filename:       addSystemBreakToPreviousBarline.js
// Web Address:    https://verovio.humdrum.org/scripts/addSystemBreakToPreviousBarline.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Add a system break to the next barline (or remove break if
//                 there is already one).
//
{% endcomment %}


function addSystemBreakToPreviousBarline() {
	let location = EDITOR.getCursorPosition();
	let index = location.row;

	var contents = getTextFromEditor().split(/\r?\n/);

	let barIndex = -1;
	for (let i=index; i>=1; i--) {
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
		location.row--;
		EDITOR.moveCursorToPosition(location);
		return;
	}

	let text = "!!LO:LB:g=original";
	let textIndex = barIndex - 1;
	EDITOR.session.insert({ row: textIndex + 1, column: 0 }, text + '\n');
	location.row++;
	EDITOR.moveCursorToPosition(location);
}





