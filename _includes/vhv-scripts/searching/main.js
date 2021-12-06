{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:30:29 CET 2021
// Last Modified: Sat Dec  4 16:54:57 CET 2021
// Filename:      _includes/vhv-scripts/searching/main.js
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


{% include vhv-scripts/searching/buildSearchQueryFilter.js          %}
{% include vhv-scripts/searching/clearMatchInfo.js                  %}
{% include vhv-scripts/searching/copySearchUrl.js                   %}
{% include vhv-scripts/searching/doMusicSearch.js                   %}
{% include vhv-scripts/searching/hideSearchLinkIcon.js              %}
{% include vhv-scripts/searching/showSearchHelp.js                  %}
{% include vhv-scripts/searching/showSearchLinkIcon.js              %}
{% include vhv-scripts/searching/toggleChordSearchDirection.js      %}
{% include vhv-scripts/searching/toggleSearchView.js                %}



