{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Dec  6 13:11:01 CET 2021
// Last Modified: Mon Dec  6 13:11:06 CET 2021
// Filename:      _includes/scripts/loading/main.js
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

{% include scripts/loading/applyUrlAliases.js         %}
{% include scripts/loading/cleanRepertoryEntryText.js %}
{% include scripts/loading/commaDuplicate.js          %}
{% include scripts/loading/displayHmdIndexFinally.js  %}
{% include scripts/loading/displayIndexFinally.js     %}
{% include scripts/loading/downloadKernScoresFile.js  %}
{% include scripts/loading/downloadMultipleFiles.js   %}
{% include scripts/loading/getBitbucketUrl.js         %}
{% include scripts/loading/getGithubUrl.js            %}
{% include scripts/loading/getRequires.js             %}
{% include scripts/loading/getTassoUrl.js             %}
{% include scripts/loading/kernScoresUrl.js           %}
{% include scripts/loading/loadHmdIndexFile.js        %}
{% include scripts/loading/loadIndexFile.js           %}
{% include scripts/loading/loadKernScoresFile.js      %}
{% include scripts/loading/processInfo.js             %}



