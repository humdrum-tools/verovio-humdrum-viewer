

//////////////////////////////
//
// cleanOptions2 -- Remove options that will be processed interally from the data.
//

function cleanOptions2(content, options) {
	var lines = content.match(/[^\r\n]+/g);
	var output = options;
	var setlist = [""];
	var optionsets = {};
	optionsets[""] = {};
	var i;

	for (i=0; i<lines.length; i++) {
		var matches = lines[i].match(/^!!!verovio([^\s]*):\s*(.*)\s*$/);
		if (!matches) {
			continue;
		}
		if (matches[1] == "-parameter-group") {
			setlist.push(matches[2]);
			continue;
		}
		var mm = matches[2].match(/^\s*([^\s]+)\s+(.*)\s*$/);
		if (!mm) {
			continue;
		}
		var m = matches[1].match(/^-([^\s]+)\s*$/);
		var set = "";
		if (m) {
			set = m[1];
		}
		if (typeof optionsets[set] === 'undefined') {
			optionsets[set] = {};
		}
		optionsets[set][mm[1]] = mm[2];
	}

	for (i=0; i<setlist.length; i++) {
		if (!optionsets[setlist[i]]) {
			continue;
		}
		var keys = Object.keys(optionsets[setlist[i]]);
		var j;
		var key;
		for (j=0; j<keys.length; j++) {
			if (typeof output[keys[j]] !== 'undefined') {
				delete output[keys[j]];
			}
		}
	}

	return output;
}



