{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       getBeamChild.js
// Web Address:    https://verovio.humdrum.org/scripts/getBeamChild.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Return the direct child of a beam which contains this element.
//
{% endcomment %}


function getBeamChild(element) {
	var current = element;
	while (current) {
		if (current.parentNode && current.parentNode.id.match(/^beam-/)) {
			return current;
		}
		current = current.parentNode;
	}
	return undefined;
}



