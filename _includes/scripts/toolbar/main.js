{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:30:29 CET 2021
// Last Modified: Sat Dec  4 16:54:57 CET 2021
// Filename:      _includes/scripts/toolbar/main.js
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

{% include scripts/toolbar/chooseToolbarMenu.js                 %}
{% include scripts/toolbar/gotoNextToolbar.js                   %}
{% include scripts/toolbar/gotoNextToolbarDelta.js              %}
{% include scripts/toolbar/gotoPrevToolbarDelta.js              %}
{% include scripts/toolbar/gotoToolbarMenu.js                   %}
{% include scripts/toolbar/matchToolbarVisibilityIconToState.js %}
{% include scripts/toolbar/showToolbarHelp.js                   %}
{% include scripts/toolbar/showSaveHelp.js                      %}
{% include scripts/toolbar/showLoadHelp.js                      %}
{% include scripts/toolbar/toggleLineBreaks.js                  %}
{% include scripts/toolbar/toggleMenuAndToolbarDisplay.js       %}
{% include scripts/toolbar/toggleMenuDisplay.js                 %}
{% include scripts/toolbar/toggleNavigationToolbar.js           %}



