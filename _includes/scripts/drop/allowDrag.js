{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:09:49 PDT 2025
// Filename:      _includes/scripts/drop/allowDrag.js
// Included in:   _includes/scripts/drop/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Test that the item being dragged is a valid one.
//
{% endcomment %}

function allowDrag(event) {
	if (true) {
		event.dataTransfer.dropEffect = 'copy';
		event.preventDefault();
	}
}



