{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       addInterpretationLineAboveCurrentPosition.js
// Web Address:    https://verovio.humdrum.org/scripts/addInterpretationLineAboveCurrentPosition.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Add an interpretation
//                 line above the current line. Cursor keeps its position on the
//                 original line.
//
{% endcomment %}


function addInterpretationLineAboveCurrentPosition() {
	addNullLine("*", "**blank");
}



