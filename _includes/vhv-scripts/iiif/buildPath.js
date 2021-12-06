{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Wed Oct  6 20:03:37 PDT 2021
// Last Modified: Wed Oct  6 20:03:40 PDT 2021
// Filename:      _includes/vhv-scripts/iiif/buildPath.js
// Included in:   _includes/vhv-scripts/iiif/main.js
// Syntax:        ECMAScript 6
// vim:           ts=3:nowrap
//
// Description:
//
{% endcomment %}

function buildPath(element) {
	let output = [];
	while (element) {
		output.push(element);
		element = element.parentNode;
	}
	return output;
}



