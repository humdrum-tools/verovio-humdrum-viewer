{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Mar 15 19:20:05 PDT 2025
// Last Modified: Sat Mar 15 19:25:26 PDT 2025
// Filename:      _includes/scripts/options/main.js
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

{% include scripts/options/global.js %}

{% include scripts/options/esacToHumdrumOptions.js     %}
{% include scripts/options/getScaleFromPercentSize.js  %}
{% include scripts/options/getVerovioDefaultOptions.js %}
{% include scripts/options/humdrumToHumdrumOptions.js  %}
{% include scripts/options/humdrumToSvgOptions.js      %}
{% include scripts/options/loadEditorFontSizes.js      %}
{% include scripts/options/meiToHumdrumOptions.js      %}
{% include scripts/options/meiToMeiOptions.js          %}
{% include scripts/options/musedataToHumdrumOptions.js %}
{% include scripts/options/musicxmlToHumdrumOptions.js %}
{% include scripts/options/musicxmlToMeiOptions.js     %}
{% include scripts/options/validateOptions.js          %}



