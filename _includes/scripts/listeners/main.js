{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:09:49 PDT 2025
// Filename:      _includes/vhv-scripts/listeners/main.js
// Included in:   _includes/vhv-scripts/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Javascript code related to listeners for the VHV page.
//
{% endcomment %}

{% include vhv-scripts/listeners/global.js %}

{% include vhv-scripts/listeners/beforeunload.js                %}
{% include vhv-scripts/listeners/autosave.js                    %}
{% include vhv-scripts/listeners/verovioCallback.js             %}
{% include vhv-scripts/listeners/updateEditorMode.js            %}
{% include vhv-scripts/listeners/processInterfaceKeyCommand.js  %}
{% include vhv-scripts/listeners/processNotationKeyCommand.js   %}
{% include vhv-scripts/listeners/DOMContentLoaded.js            %}



