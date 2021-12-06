{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 16:55:37 CET 2021
// Last Modified: Sat Dec  4 16:55:40 CET 2021
// Filename:      _includes/vhv-scripts/iiif/getIiifInfo.js
// Included in:   _includes/vhv-scripts/iiif/main.js
// Syntax:        ECMAScript 6
// vim:           ts=3:nowrap
//
// Description:   Check the element path for a mouse click and 
//                process any IIIF that is active on the current
//                click path.
//
{% endcomment %}

function getIiifInfo(humdrum, line, field) {
	let lines = humdrum.split(/\r?\n/);
	let output = {};
	output.xywh = "0,0,0,0";
	output.tag = "";
	output.iiifbase = "";
	output.infourl = "";

	// currently requiring no spine splits or merges.
	for (let i=line-1; i>=0; i--) {
		if (!lines[i].match(/^\*/)) {
			continue;
		}
		let fields = lines[i].split(/\t+/);
		let matches = fields[field].match(/^\*xywh:(.*)$/);
		if (matches) {
			output.xywh = matches[1];
		}
		matches = fields[field].match(/^\*iiif:([^:]+)/);
		if (matches) {
			output.tag = matches[1];
			break;
		}
	}
	if (output.tag === "") {
		return;
	}
	
	// also get the IIIF image
	let skey = `^!!!IIIF-${output.tag}:\s*(.*)\s*$`;
	let regex = new RegExp(skey);
	for (let i=lines.length - 1; i>=0; i--) {
		let matches = lines[i].match(regex);
		if (matches) {
			let value = matches[1];
			matches = value.match(/^\s*([^\s]+)\s+([^\s]+)\s*$/);
			if (matches) {
				let iiifbase = matches[1];
				let infourl = matches[2];
				if (!infourl.match(/^https?:\/\//)) {
					infourl = `${iiifbase}/${infourl}`;
				}
				output.iiifbase = iiifbase;
				output.infourl = infourl;
				break;
			} else {
				output.iiifbase = value;
				// no info url
				break;
			}
		}
	}

	return output;
}



