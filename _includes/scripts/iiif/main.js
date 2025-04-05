{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:30:29 CET 2021
// Last Modified: Sat Dec  4 16:54:57 CET 2021
// Filename:      _includes/scripts/iiif/main.js
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

{% include scripts/iiif/buildPath.js              %}
{% include scripts/iiif/getIiifBase.js            %}
{% include scripts/iiif/getIiifBoundingBoxInfo.js %}
{% include scripts/iiif/getIiifManifestInfo.js    %}
{% include scripts/iiif/iiifCallback.js           %}
{% include scripts/iiif/processClickForIiif.js    %}


