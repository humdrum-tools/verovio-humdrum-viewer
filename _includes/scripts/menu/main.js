{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Dec  6 13:04:55 CET 2021
// Last Modified: Wed Mar 27 17:53:13 PDT 2024
// Filename:      _includes/vhv-scripts/main/main.js
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

{% include vhv-scripts/menu/buildPdfIconListInMenu.js  %}
{% include vhv-scripts/menu/buildScanIconListInMenu.js %}
{% include vhv-scripts/menu/makeFilterIcon.js          %}
{% include vhv-scripts/menu/makePdfIcon.js             %}
{% include vhv-scripts/menu/makeScanIcon.js            %}
{% include vhv-scripts/menu/makeWikipediaIcon.js       %}
{% include vhv-scripts/menu/makeYoutubeIcon.js         %}
{% include vhv-scripts/menu/openOrReplaceWikipedia.js  %}
{% include vhv-scripts/menu/openOrReplaceYoutube.js    %}



