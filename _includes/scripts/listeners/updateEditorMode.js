{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Mar 18 01:07:33 PDT 2025
// Last Modified: Tue Mar 18 01:07:36 PDT 2025
// Filename:      _includes/vhv-scripts/listeners/updateEditorMode.js
// Included in:   _includes/vhv-scripts/listeners/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Needed for starup, not afterwards, so adjust later.
//                The editor mode controls the display type based on
//                the current text content of the editor, such as xml,
//                humdrum, esac.
//
{% endcomment %}

setInterval(function() { updateEditorMode(); }, 1000);



