{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       addInvisibleBarlineAboveCurrentPosition.js
// Web Address:    https://verovio.humdrum.org/scripts/addInvisibleBarlineAboveCurrentPosition.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Add barline above the current
//                 line which is invisible. Cursor keeps its position on the original line.
//
{% endcomment %}


function addInvisibleBarlineAboveCurrentPosition() {
	addNullLine("=-", "**blank");
}



