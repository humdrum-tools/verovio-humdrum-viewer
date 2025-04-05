{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:30:29 CET 2021
// Last Modified: Sat Dec  4 16:54:57 CET 2021
// Filename:      _includes/scripts/spreadsheet/main.js
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

{% include scripts/spreadsheet/downloadDataFromSpreadsheet.js   %}
{% include scripts/spreadsheet/fillSpreadsheetId.js             %}
{% include scripts/spreadsheet/getSpreadsheetId.js              %}
{% include scripts/spreadsheet/getSpreadsheetScriptId.js        %}
{% include scripts/spreadsheet/openSpreadsheet.js               %}
{% include scripts/spreadsheet/showSpreadsheetIconState.js      %}
{% include scripts/spreadsheet/storeSpreadsheetDataInEditor.js  %}
{% include scripts/spreadsheet/storeSpreadsheetDataInEditor2.js %}
{% include scripts/spreadsheet/uploadDataToSpreadsheet.js       %}
{% include scripts/spreadsheet/uploadDataToSpreadsheet2.js      %}



