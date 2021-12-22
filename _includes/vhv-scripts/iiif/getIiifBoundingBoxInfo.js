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

	let isManipulator = function (line) {
		let tokens = line.split(/\t+/);
		let output = true;
		let empty = true;
		for (let i=0; i<tokens.length; i++) {
			if (tokens[i] === "*") { continue; }
			empty = 0;
			if (tokens[i].substring(0, 2) === "**") { continue; }
			if (tokens[i] === "*-") { continue; }
			if (tokens[i] === "*v") { continue; }
			if (tokens[i] === "*^") { continue; }
			// not dealing with *+
			return false;
		}
		if (empty) {
			return false;
		}
		return true;
	};

	let getNewFieldIndex = function (ofield, line) {
		let tokens = line.split(/\t+/);
		let adjust = [];
		for (let i=0; i<tokens.length; i++) {
			adjust[i] = 0;
		}
		let ladjust = 0;
		for (let i=1; i<tokens.length; i++) {
			if ((tokens[i] === "*v") && (tokens[i-1] === "*v")) {
				ladjust++;
			} else if (tokens[i-1] === "*^") {
				ladjust--;
			}
			adjust[i] += ladjust;
		}
		for (let j=0; j<adjust.length; j++) {
			if (j - adjust[j] == ofield) {
				return j;
			}
		}
		return -100;
	};

	// zero-index line and field
	line--;
	field--;
	let cfield = field; // current field;

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
		let ismanipulator = isManipulator(lines[i]);
		if (ismanipulator) {
			cfield = getNewFieldIndex(cfield, lines[i]);
		}

		let fields = lines[i].split(/\t+/);
		let matches = fields[cfield].match(/^\*xywh-([^:]+):(.*)$/);
		if (matches) {
			output.label = matches[1];
			output.xywh = matches[2];
			break;
		}
		matches = fields[cfield].match(/^\*xywh:(.*)$/);
		if (matches) {
			output.xywh = matches[1];
		}
		matches = fields[cfield].match(/^\*iiif:([^:]+)/);
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



