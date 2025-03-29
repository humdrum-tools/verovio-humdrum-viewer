{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Dec  6 01:28:20 CET 2021
// Last Modified: Mon Dec  6 01:28:23 CET 2021
// Filename:      _includes/vhv-scripts/buffer/main.js
// Included in:   _includes/vhv-scripts/main.js
// Syntax:        HTML; ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   This file collects all files in this directory into
//                a single file that is included in the head element
//                of the webpage.  Each javascript function is stored
//                in a separate file based on the name of the function.
//
{% endcomment %}

{% include vhv-scripts/buffer/downloadEditorContentsInHtml.js %}
{% include vhv-scripts/buffer/loadBuffer.js                   %}
{% include vhv-scripts/buffer/prepareBufferStates.js          %}
{% include vhv-scripts/buffer/restoreEditorContentsLocally.js %}
{% include vhv-scripts/buffer/saveBuffer.js                   %}
{% include vhv-scripts/buffer/saveEditorContentsLocally.js    %}
{% include vhv-scripts/buffer/saveSvgData.js                  %}



