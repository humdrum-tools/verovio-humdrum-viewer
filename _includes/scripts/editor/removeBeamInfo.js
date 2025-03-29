{% comment %}
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       removeBeamInfo.js
// Web Address:    https://verovio.humdrum.org/scripts/removeBeamInfo.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Remove [JLKk] characters from given line and field taken
//                 from ID of input element.
//
{% endcomment %}


function removeBeamInfo(element) {
	if (!element) {
		return;
	}
	var id = element.id;
	var matches = id.match(/[^-]+-.*L(\d+).*F(\d+)/);
	if (!matches) {
		return;
	}
	var line = parseInt(matches[1]);
	var field = parseInt(matches[2]);
	var token = getEditorContents(line, field).replace(/[LJKk]+[<>]?/g, "");
	setEditorContents(line, field, token, id, true);
}



