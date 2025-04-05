{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Mar 18 01:09:45 PDT 2025
// Last Modified: Tue Mar 18 01:09:49 PDT 2025
// Filename:      _includes/scripts/listeners/autosave.js
// Included in:   _includes/scripts/listeners/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Autosave feature:  Save the contents of the editor
//                every 60 seconds to local storage ("SAVE0"), which
//                can be recalled by typing 0 shift-R within one minute
//                after reloading the VHV website.
//
{% endcomment %}

setInterval(function() { 
	localStorage.setItem("SAVE0", encodeURIComponent(getTextFromEditorRaw())); 
}, 60000);



