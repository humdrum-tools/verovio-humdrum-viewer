{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       setDynamBelowMarker.js
// Web Address:    https://verovio.humdrum.org/scripts/setDynamBelowMarker.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Move dynamic below staff.
//
{% endcomment %}


function setDynamBelowMarker(id, line, field, number) {
	setBelowMarker(id, line, field, number, "DY");
}



