{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:53:16 PDT 2025
// Filename:      _includes/vhv-scripts/drop/setupDropArea.js
// Included in:   _includes/vhv-scripts/drop/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   
//
{% endcomment %}

function setupDropArea(target) {
	if (!target) {
	  target = "#dropArea";
	}
	var droparea = document.querySelector(target);
	DROPAREA = droparea;

	window.addEventListener('dragenter', function(event) {
		showDropArea();
	});

	droparea.addEventListener('dragenter', allowDrag);
	droparea.addEventListener('dragover', allowDrag);
	droparea.addEventListener('dragleave', function(event) {
		hideDropArea();
	});
	droparea.addEventListener('drop', handleDrop);
}



