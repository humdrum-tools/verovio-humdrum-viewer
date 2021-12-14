{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:30:29 CET 2021
// Last Modified: Sat Dec  4 16:54:57 CET 2021
// Filename:      _includes/vhv-scripts/iiif/main.js
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

{% include vhv-scripts/iiif/buildPath.js              %}
{% include vhv-scripts/iiif/getIiifBase.js            %}
{% include vhv-scripts/iiif/getIiifBoundingBoxInfo.js %}
{% include vhv-scripts/iiif/getIiifManifestInfo.js    %}
{% include vhv-scripts/iiif/iiifCallback.js           %}
{% include vhv-scripts/iiif/processClickForIiif.js    %}


