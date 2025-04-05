{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Dec  6 12:54:52 CET 2021
// Last Modified: Tue Feb 28 10:05:25 PST 2023
// Filename:      _includes/scripts/filtering/main.js
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

{% include scripts/filtering/applyGlobalFilter.js          %}
{% include scripts/filtering/checkForFilterActivate.js     %}
{% include scripts/filtering/compileFilters.js             %}
{% include scripts/filtering/copyFilterUrl.js              %}
{% include scripts/filtering/deactivateFilterInToolbar.js  %}
{% include scripts/filtering/detachGlobalFilter.js         %}
{% include scripts/filtering/detachGlobalVerovioOptions.js %}
{% include scripts/filtering/getPipedRegion.js             %}
{% include scripts/filtering/hideFilterLinkIcon.js         %}
{% include scripts/filtering/loadFilter.js                 %}
{% include scripts/filtering/removeStrings.js              %}
{% include scripts/filtering/showCompiledFilterData.js     %}
{% include scripts/filtering/showFilterHelp.js             %}
{% include scripts/filtering/showFilterLinkIcon.js         %}
{% include scripts/filtering/showSpreadsheetHelp.js        %}
{% include scripts/filtering/updateFilterState.js          %}
{% include scripts/filtering/validateFilter.js             %}



