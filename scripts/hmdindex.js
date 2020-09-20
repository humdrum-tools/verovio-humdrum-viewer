//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Thu Jun 21 16:07:56 PDT 2018
// Last Modified:  Thu Jun 21 16:08:01 PDT 2018
// Filename:       hmdindex.js
// Web Address:    https://verovio.humdrum.org/scripts/hmdindex.js
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
	// parameters == list of key/value pairs extracted from
	// Humdrum reference records in the input Humdurm data.
	this.parameters   = {};

	// items == list of files, groups, or dummy lines stored
	// on data lines in the input Humdrum data.  These are 
	// sorted by the sortkey field after loading the data.
	this.items        = [];

	// groupedItems == database of sortkey values for entries
	// that are in groups (movements of a larger work).
	this.groupedItems = {};

	// sortIndex == database of entries indexed by sortkey value.
	this.sortIndex    = {};
};



//////////////////////////////
//
// HMDIndex.prototype.setParameter -- Set a parameter.
//

HMDIndex.prototype.setParameter = function(key, value) {
	this.parameters[key] = value;
};



//////////////////////////////
//
// HMDIndex.prototype.getParameter -- Get a parameter.
//

HMDIndex.prototype.getParameter = function(key) {
	return this.parameters[key];
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
	if (lines.length == 1) {
		if (lines[0].match(/^https?:\/\//)) {
			return this.parseURL(lines[0]);
		}
	}
	var entry;
	for (var i = 0; i<lines.length; i++) {
		var line = lines[i];
		if (line.match(/^\s*$/)) {
			continue;
		}
		var matches = line.match(/^!!!([^!:\s]+)\s*:\s*(.*)\s*$/);
		if (matches) {
			this.setParameter(matches[1], matches[2]);
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
			pdfname = data[index["pdf"]];
		}
		if (data[index["description"]]) {
			description = data[index["description"]];
		}

		this.addEntry({filename:filename, 
				sortkey:sortkey, 
				available:available, 
				pdfname:pdfname, 
				description:description});
	}

	this.sortEntries();

	return this;
};


//////////////////////////////
//
// HMDIndex.prototype.sortEntries --
//

HMDIndex.prototype.sortEntries = function() {
	this.items.sort(function(a, b) {
		if (a.sortkey < b.sortkey) {
			return -1;
		} else if (a.sortkey > b.sortkey) {
			return 1;
		} else {
			return 0;
		}
	});
};



//////////////////////////////
//
// HMDIndex.prototype.parseURL --
//

HMDIndex.prototype.parseURL = function(url) {
	var that = this;
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onload = function() {
		if (request.status == 200) {
			that.parse(request.responseText);
		} else {
			reject("ERROR:", request.status);
		}
	}
	request.send();
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

	var matches;

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

	var obj = {
			sortkey:     sortkey,
			description: description,
			pdfname:     pdfname
	};
		
	// THERE IS ALSO filename === "DUMMY" to implement.
	if (filename.match(/^@/)) {
		// this is a group, not a filename.  The group is a list
		// of sortkeys of the items that form the group.
		obj.group = filename.replace(/^@/, "").split(":");
		for (var i=0; i<obj.group.length; i++) {
			this.groupedItems[obj.group[i]] = true;
		}
	} else {
		matches = filename.match(/(.*)\//);
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
		obj.available = available;
		obj.file = {
			fullname:    filename, 
			extension:   extension, 
			directory:   directory, 
			basename:    basename
		}
	}

	this.items.push(obj);
	this.sortIndex[sortkey] = obj;
}


//////////////////////////////
//
// HMDIndex.prototype.generateHTML --
//

HMDIndex.prototype.generatHtml = HMDIndex.prototype.generateHTML;

HMDIndex.prototype.generateHTML = function() {
console.log("OBJECT HMD", this);

	var urlbase = "";
	if (this.parameters) {
		urlbase = this.parameters.github;
	}

	var output = "";
	output += "<table class='index-list'>\n";

	for (var i=0; i<this.items.length; i++) {
		var skey = this.items[i].sortkey;
		if (this.groupedItems[skey] === true) {
			continue;
		}
		if (this.items[i].file) {
			output += this.generateFileHTML(this.items[i]);
		} else if (this.items[i].group) {
			output += this.generateGroupHTML(this.items[i]);
		}
		// print DUMMY item
	}

	output += "</table>\n";

	return output;
}



//////////////////////////////
//
// HMDIndex.prototype.generateFileHTML --
//

HMDIndex.prototype.generateFileHTML = function(entry, indent) {
	var output = "";
	output += "<tr>";
	output += "<td>";

	var description = entry.description;
	var matches = description.match(/(.*)<link>(.*?)<\/link>(.*)/);
	var prefix = "";
	var postfix = "";
	if (matches) {
		prefix = matches[1];
		postfix = matches[3];
		description = matches[2];
	}
	if (description.match(/^\s*$/)) {
		description = entry.file.basename;
	}
	
	if (indent) {
		output += "<span class='indenter'></span>";
	}
	output += prefix;
	output += "<span class='ilink'";
	output += " onclick='displayWork(\"";
	output += this.parameters.githubbase;
	output += '/';
	output += entry.file.fullname;
	output += '");';
	output += "'>";
	output += description;
	output += "</span>";
	output += postfix;

	output += "</td>";
	output += "</tr>\n";

	return output;
}



//////////////////////////////
//
// HMDIndex.prototype.generateGroupHTML --
//

HMDIndex.prototype.generateGroupHTML = function(entry) {
	var output = "";
	// output += "<div class='group'>\n";
	output += "<tr><td class='igroup'>\n";
	output += entry.description;
	output += "</td></tr>\n";
	var indent = 1;
	for (var i=0; i<entry.group.length; i++) {
		var fileentry = this.sortIndex[entry.group[i]];
		output += this.generateFileHTML(fileentry, indent);
	}
	// output += "</div>\n";
	return output;
};



