{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       addSlur.js
// Web Address:    https://verovio.humdrum.org/scripts/addSlur.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Add a slur to a note, which goes to the next note
//                 in the field.
//
{% endcomment %}


function addSlur(id, line, field) {
	var token = getEditorContents(line, field);
	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	addSlurStart(id, line, field, '(');

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
	if (i+1 <= line) {
		// do not pass slur begin
		return;
	}

	addSlurEnd(id, i+1, field, ')');
	var newid = id.replace(/^note-/, "slur-");
	// FIX N number here later:
	var ending = "-L" + (i+1) + "F" + field + "N" + 1;
	newid += ending;
	FreezeRendering = freezeBackup;
	if (!FreezeRendering) {
		displayNotation(null, null, newid);
	}
	InterfaceSingleNumber = 0;

	// for some reason the highlighting is lost on the note,
	// so add it back:
	// wait for worker to finish redrawing?
	setTimeout(function() {
		var element = document.querySelector("svg g#" + id);
		if (element) {
			var classname = element.getAttribute("class");
			if (!classname.match(/\bhighlight\b/)) {
				classname += " highlight";
				element.setAttribute("class", classname);
			}
			CursorNote = element;
		}
	}, 300);

}



