{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Dec  6 13:04:55 CET 2021
// Last Modified: Wed Mar 27 17:53:13 PDT 2024
// Filename:      _includes/scripts/main/main.js
// Included in:   _includes/scripts/main.js
// Syntax:        HTML; ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   This file collects all files in this directory into
//                a single file that is included in the head element
//                of the webpage.  Each javascript function is stored
//                in a separate file based on the name of the function.
//
{% endcomment %}

{% include scripts/menu/buildPdfIconListInMenu.js  %}
{% include scripts/menu/buildScanIconListInMenu.js %}
{% include scripts/menu/makeFilterIcon.js          %}
{% include scripts/menu/makePdfIcon.js             %}
{% include scripts/menu/makeScanIcon.js            %}
{% include scripts/menu/makeWikipediaIcon.js       %}
{% include scripts/menu/makeYoutubeIcon.js         %}
{% include scripts/menu/openOrReplaceWikipedia.js  %}
{% include scripts/menu/openOrReplaceYoutube.js    %}



