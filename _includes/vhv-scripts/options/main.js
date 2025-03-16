{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Mar 15 19:20:05 PDT 2025
// Last Modified: Sat Mar 15 19:25:26 PDT 2025
// Filename:      _includes/vhv-scripts/options/main.js
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

{% include vhv-scripts/options/global.js %}

{% include vhv-scripts/options/esacToHumdrumOptions.js     %}
{% include vhv-scripts/options/getScaleFromPercentSize.js  %}
{% include vhv-scripts/options/getVerovioDefaultOptions.js %}
{% include vhv-scripts/options/humdrumToHumdrumOptions.js  %}
{% include vhv-scripts/options/humdrumToSvgOptions.js      %}
{% include vhv-scripts/options/loadEditorFontSizes.js      %}
{% include vhv-scripts/options/meiToHumdrumOptions.js      %}
{% include vhv-scripts/options/meiToMeiOptions.js          %}
{% include vhv-scripts/options/musedataToHumdrumOptions.js %}
{% include vhv-scripts/options/musicxmlToHumdrumOptions.js %}
{% include vhv-scripts/options/musicxmlToMeiOptions.js     %}
{% include vhv-scripts/options/validateOptions.js          %}



