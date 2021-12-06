{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Dec  6 12:54:52 CET 2021
// Last Modified: Mon Dec  6 12:54:54 CET 2021
// Filename:      _includes/vhv-scripts/filtering/main.js
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

{% include vhv-scripts/filtering/applyGlobalFilter.js         %}
{% include vhv-scripts/filtering/checkForFilterActivate.js    %}
{% include vhv-scripts/filtering/compileFilters.js            %}
{% include vhv-scripts/filtering/copyFilterUrl.js             %}
{% include vhv-scripts/filtering/deactivateFilterInToolbar.js %}
{% include vhv-scripts/filtering/detachGlobalFilter.js        %}
{% include vhv-scripts/filtering/getPipedRegion.js            %}
{% include vhv-scripts/filtering/hideFilterLinkIcon.js        %}
{% include vhv-scripts/filtering/removeStrings.js             %}
{% include vhv-scripts/filtering/showCompiledFilterData.js    %}
{% include vhv-scripts/filtering/showFilterHelp.js            %}
{% include vhv-scripts/filtering/showFilterLinkIcon.js        %}
{% include vhv-scripts/filtering/showSpreadsheetHelp.js       %}
{% include vhv-scripts/filtering/updateFilterState.js         %}
{% include vhv-scripts/filtering/validateFilter.js            %}



