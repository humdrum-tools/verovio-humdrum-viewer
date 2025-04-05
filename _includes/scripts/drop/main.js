{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:09:49 PDT 2025
// Filename:      _includes/scripts/drop/main.js
// Included in:   _includes/scripts/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Javascript code related to drag-and-drop of files
//                onto the VHV page.
//
{% endcomment %}

{% include scripts/drop/global.js %}

{% include scripts/drop/allowDrag.js      %}
{% include scripts/drop/handleDrop.js     %}
{% include scripts/drop/hideDropArea.js   %}
{% include scripts/drop/processZipFile.js %}
{% include scripts/drop/setupDropArea.js  %}
{% include scripts/drop/showDropArea.js   %}



