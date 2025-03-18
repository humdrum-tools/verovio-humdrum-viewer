{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:09:49 PDT 2025
// Filename:      _includes/vhv-scripts/drop/main.js
// Included in:   _includes/vhv-scripts/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Javascript code related to drag-and-drop of files
//                onto the VHV page.
//
{% endcomment %}

{% include vhv-scripts/drop/global.js %}

{% include vhv-scripts/drop/allowDrag.js      %}
{% include vhv-scripts/drop/handleDrop.js     %}
{% include vhv-scripts/drop/hideDropArea.js   %}
{% include vhv-scripts/drop/processZipFile.js %}
{% include vhv-scripts/drop/setupDropArea.js  %}
{% include vhv-scripts/drop/showDropArea.js   %}



