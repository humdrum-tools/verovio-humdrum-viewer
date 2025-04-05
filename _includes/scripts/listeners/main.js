{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Mon Jun 27 08:48:10 PDT 2016
// Last Modified: Tue Mar 18 01:09:49 PDT 2025
// Filename:      _includes/scripts/listeners/main.js
// Included in:   _includes/scripts/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Javascript code related to listeners for the VHV page.
//
{% endcomment %}

{% include scripts/listeners/global.js %}

{% include scripts/listeners/beforeunload.js                %}
{% include scripts/listeners/autosave.js                    %}
{% include scripts/listeners/verovioCallback.js             %}
{% include scripts/listeners/updateEditorMode.js            %}
{% include scripts/listeners/processInterfaceKeyCommand.js  %}
{% include scripts/listeners/processNotationKeyCommand.js   %}
{% include scripts/listeners/DOMContentLoaded.js            %}



