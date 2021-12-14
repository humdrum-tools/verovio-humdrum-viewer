{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 16:55:37 CET 2021
// Last Modified: Sat Dec 11 18:23:20 CET 2021
// Filename:      _includes/vhv-scripts/iiif/getIiifBoundingBoxInfo.js
// Used by:       
// Included in:   _includes/vhv-scripts/iiif/main.js
// Syntax:        ECMAScript 6
// vim:           ts=3:nowrap
//
// Description:   Extract line/field information for target element and
//                then extract IIIF bounding box information from Humdrum
//                data active for the given line/field values.
//
{% endcomment %}

function getIiifBoundingBoxInfo(path) {

	// search for a token in the form:
	//   *xywh-label:#,#,#,#
	// Then search for a single IIIF image with the given label,
	// or a IIIF manifest which should contain the label information.
	let line  = -1;
	let field = -1;
	for (let i=0; i<path.length; i++) {
		let name = path[i].nodeName;
		if (name === "svg") {
			break;
		}
		if (name !== "g") {
			continue;
		}
		let id = path[i].id;
		if (!id) {
			continue;
		}
		let matches = id.match(/-.*L(\d+).*F(\d+)/);
		if (matches) {
			line = parseInt(matches[1]);
			field = parseInt(matches[2]);
			break;
		}
	}
	if (line < 0) {
		return;
	}
	if (field < 0) {
		return;
	}

	// zero-index line and field
	line--;
	field--;
console.warn("LINE", line, "FIELD", field);

	let humdrum = getTextFromEditor();
	let lines = humdrum.split(/\r?\n/);
	let output = {};
	output.xywh = "0,0,0,0";
	output.label = "";
	output.humdrum = lines; // Also used later to extract output.iiifbase 

	// The iiifbase parameter will be extracted in the calling function.
	output.iiifbase = "";

	// Currently requires no spine splits or merges.
	for (let i=line-1; i>=0; i--) {
		if (!lines[i].match(/^\*/)) {
			continue;
		}
		let fields = lines[i].split(/\t+/);
		let matches = fields[field].match(/^\*xywh-([^:]+):(.*)$/);
		if (matches) {
			output.label = matches[1];
			output.xywh = matches[2];
			break;
		}
		matches = fields[field].match(/^\*xywh:(.*)$/);
		if (matches) {
			output.xywh = matches[1];
		}
		matches = fields[field].match(/^\*iiif:([^:]+)/);
		if (matches) {
			output.label = matches[1];
			break;
		}
	}
	if (output.label === "") {
		return null;
	}

	return output;
}



