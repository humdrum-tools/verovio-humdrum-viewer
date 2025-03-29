{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:30:29 CET 2021
// Last Modified: Sat Dec  4 16:54:57 CET 2021
// Filename:      _includes/vhv-scripts/spreadsheet/main.js
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

{% include vhv-scripts/spreadsheet/downloadDataFromSpreadsheet.js   %}
{% include vhv-scripts/spreadsheet/fillSpreadsheetId.js             %}
{% include vhv-scripts/spreadsheet/getSpreadsheetId.js              %}
{% include vhv-scripts/spreadsheet/getSpreadsheetScriptId.js        %}
{% include vhv-scripts/spreadsheet/openSpreadsheet.js               %}
{% include vhv-scripts/spreadsheet/showSpreadsheetIconState.js      %}
{% include vhv-scripts/spreadsheet/storeSpreadsheetDataInEditor.js  %}
{% include vhv-scripts/spreadsheet/storeSpreadsheetDataInEditor2.js %}
{% include vhv-scripts/spreadsheet/uploadDataToSpreadsheet.js       %}
{% include vhv-scripts/spreadsheet/uploadDataToSpreadsheet2.js      %}



