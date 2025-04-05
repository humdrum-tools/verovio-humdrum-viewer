{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:53:16 PDT 2025
// Filename:      _includes/scripts/drop/hideDropArea.js
// Included in:   _includes/scripts/drop/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   
//
{% endcomment %}

function hideDropArea(droparea) {
	if (!droparea) {
	  droparea = DROPAREA;
	}
	droparea.style.visibility = "hidden";
}



