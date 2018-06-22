//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Thu Jun 21 16:07:56 PDT 2018
// Last Modified:  Thu Jun 21 16:08:01 PDT 2018
// Filename:       hmdindex.js
// Web Address:    http://verovio.humdrum.org/scripts/hmdindex.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Parse an index.hmd file giving the contents of a repertory.
//


//////////////////////////////
//
// HMDIndex constructor -- Creat an HMDIndex object.
//

function HMDIndex(contents) {
	this.clear();
	this.parse(contents);
}



//////////////////////////////
//
// HMDIndex.prototype.clear -- Clear the old contents of the index
//

HMDIndex.prototype.clear = function() {
	this.parameters = {};
	this.items = [];
};



//////////////////////////////
//
// HMDIndex.prototype.parse -- Parse the contents of a Humdrum
//     file containing and index of works and store them in the
//     object.
//

HMDIndex.prototype.parse = function(contents) {
	this.clear();
	var exfound          = 0;
	var index = {};
	var lines = contents.match(/[^\r\n]+/g);
	var entry;
	for (var i = 0; i<lines.length; i++) {
		var line = lines[i];
		if (line.match(/^\s*$/)) {
			continue;
		}
		var matches = line.match(/^!!!([^!:\s]+)\s*:\s*(.*)\s*$/);
		if (matches) {
			this.parameters[matches[1]] = matches[2];
			continue;
		}
		if (line.match(/^!/)) {
			// local or global comment
			continue;
		}
		if (line.match(/^\*\*/)) {
			exfound = 1;
			var fields = line.split(/\t+/);
			for (var j = 0; j<fields.length; j++) {
				var ematch = fields[j].match(/^\*\*(.*)/);
				if (ematch) {
					index[ematch[1]] = j;
				}
			}
		}
		if (!exfound) {
			continue;
		}
		if (line.match(/^\*/)) {
			continue;
		}
		var data = line.split(/\t+/);
		if (data.length < 1) {
			// not enough data fields so ignore the entry
			// there must be at least the filename specified.
			continue;
		}
		var filename = "";
		var sortkey = "";
		var available = "";
		var pdfname = "";
		var description = "";
		if (data[index["file"]]) {
			filename = data[index["file"]];
		}
		if (data[index["sort"]]) {
			sortkey = data[index["sort"]];
		}
		if (data[index["available"]]) {
			available = data[index["available"]];

		}
		if (data[index["pdf"]]) {
			pdfname = data[index["file"]];
		}
		if (data[index["description"]]) {
			description = data[index["file"]];
		}

		this.addEntry({filename:filename, sortkey:sortkey, available:available, pdfname:pdfname, description:description});
	}
};


//////////////////////////////
//
// HMDIndex.prototpye.addEntry --
//

HMDIndex.prototype.addEntry = function(object) {
	var filename    = object.filename;
	var sortkey     = object.sortkey;
	var available   = object.available;
	var pdfname     = object.pdfname;
	var description = object.description;

	if ((!filename) || filename === ".") {
		// require filename at a minimum
		return;
	}
	if ((!available) || available === ".") {
		available = "Y";
	}
	if ((available !== "Y") && (available !== "N")) {
		if (available.match(/y/i)) {
			available = "Y";
		} else {
			available = "N";
		}
	}
	if (!available) {
		available = "Y";
	}
	if ((!sortkey) || (sortkey === ".")) {
		sortkey = filename;
	}
	if ((!pdfname) || (pdfname === ".")) {
		pdfname = "";
	}
	if ((!description) || (description === ".")) {
		description = filename;
	}

	// split the filename into directory, basename, and extension:
	var directory = "";
	var basename = "";
	var extension = "";
	var matches = filename.match(/(.*)\//);
	if (matches) {
		directory = matches[1];
	}
	matches = filename.match(/([^\/]+?)(\.[^\/.]*)?$/);
	if (matches) {
		extension = matches[2];
		basename = matches[1];
	} else {
		matches = filename.match(/([^\/]+)$/);
		if (matches) {
			basename = matches[1];
		}
	}

	this.items.push({
			file:        {fullname:filename, extension:extension, directory:directory, basename:basename},
			sortkey:     sortkey,
			available:   available,
			pdfname:     pdfname,
			description: description
		});
}



