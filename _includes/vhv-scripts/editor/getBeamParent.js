{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       getBeamParent.js
// Web Address:    https://verovio.humdrum.org/scripts/getBeamParent.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Return the first element containing an id starting
//                 with "beam-" in the ancestors of the given element.
//
{% endcomment %}


function getBeamParent(element) {
	var current = element.parentNode;
	while (current) {
		if (current.id.match(/^beam-/)) {
			return current;
		}
		current = current.parentNode;
	}
	return undefined;
}



