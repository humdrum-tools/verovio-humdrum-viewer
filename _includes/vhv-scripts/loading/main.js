{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Dec  6 13:11:01 CET 2021
// Last Modified: Mon Dec  6 13:11:06 CET 2021
// Filename:      _includes/vhv-scripts/loading/main.js
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

{% include vhv-scripts/loading/applyUrlAliases.js         %}
{% include vhv-scripts/loading/cleanRepertoryEntryText.js %}
{% include vhv-scripts/loading/commaDuplicate.js          %}
{% include vhv-scripts/loading/displayHmdIndexFinally.js  %}
{% include vhv-scripts/loading/displayIndexFinally.js     %}
{% include vhv-scripts/loading/downloadKernScoresFile.js  %}
{% include vhv-scripts/loading/downloadMultipleFiles.js   %}
{% include vhv-scripts/loading/getBitbucketUrl.js         %}
{% include vhv-scripts/loading/getGithubUrl.js            %}
{% include vhv-scripts/loading/getRequires.js             %}
{% include vhv-scripts/loading/getTassoUrl.js             %}
{% include vhv-scripts/loading/kernScoresUrl.js           %}
{% include vhv-scripts/loading/loadHmdIndexFile.js        %}
{% include vhv-scripts/loading/loadIndexFile.js           %}
{% include vhv-scripts/loading/loadKernScoresFile.js      %}
{% include vhv-scripts/loading/processInfo.js             %}



