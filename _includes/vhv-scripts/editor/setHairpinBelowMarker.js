{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       setHairpinBelowMarker.js
// Web Address:    https://verovio.humdrum.org/scripts/setHairpinBelowMarker.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:
//
{% endcomment %}


function setHairpinBelowMarker(id, line, field, number) {
	setBelowMarker(id, line, field, number, "HP");
}



