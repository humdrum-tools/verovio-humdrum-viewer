{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Jun 11 14:15:24 PDT 2022
// Last Modified: Sat Jun 11 14:15:26 PDT 2022
// Filename:      _includes/vhv-scripts/html/main.js
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

{% include vhv-scripts/html/displayPrePostHtml.js %}
{% include vhv-scripts/html/getChecksum.js %}
{% include vhv-scripts/html/getHumdrumParameters.js %}
{% include vhv-scripts/html/applyParameters.js %}

