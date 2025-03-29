{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:30:29 CET 2021
// Last Modified: Sat Dec  4 16:54:57 CET 2021
// Filename:      _includes/vhv-scripts/toolbar/main.js
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

{% include vhv-scripts/toolbar/chooseToolbarMenu.js                 %}
{% include vhv-scripts/toolbar/gotoNextToolbar.js                   %}
{% include vhv-scripts/toolbar/gotoNextToolbarDelta.js              %}
{% include vhv-scripts/toolbar/gotoPrevToolbarDelta.js              %}
{% include vhv-scripts/toolbar/gotoToolbarMenu.js                   %}
{% include vhv-scripts/toolbar/matchToolbarVisibilityIconToState.js %}
{% include vhv-scripts/toolbar/showToolbarHelp.js                   %}
{% include vhv-scripts/toolbar/toggleLineBreaks.js                  %}
{% include vhv-scripts/toolbar/toggleMenuAndToolbarDisplay.js       %}
{% include vhv-scripts/toolbar/toggleMenuDisplay.js                 %}
{% include vhv-scripts/toolbar/toggleNavigationToolbar.js           %}



