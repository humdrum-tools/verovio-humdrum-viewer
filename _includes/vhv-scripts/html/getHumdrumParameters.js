{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Jun 11 19:15:38 PDT 2022
// Last Modified: Sat Jun 11 19:15:40 PDT 2022
// Filename:      _includes/vhv-scripts/html/getHumdrumParameters.js
// Included in:   _includes/vhv-scripts/html/main.js
// Syntax:        HTML; ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Get Humdrum parameters (reference records and PRE/POST HTML parameters).
//
{% endcomment %}

function getHumdrumParameters(humdrum) {
	let REFS = {};

	let atonlines = "";
	let lines = humdrum.split(/\r?\n/);
	let atonactive = "";

	for (let i=0; i<lines.length; i++) {
		if (!lines[i].match(/^!!/)) {
			continue;
		}
		let matches = lines[i].match(/^!!!\s*([^:]+)\s*:\s*(.*)\s*/);
		if (matches) {
			let key = matches[1];
			let value = matches[2];
			let item = {
				key: key,
				value: value,
				line: i+1
			};
			if (typeof REFS[key] === "undefined") {
				REFS[key] = item;
			} else if (Array.isArray(REFS[key]) == false) {
				REFS[key] = [ REFS[key], item ];
			} else {
				REFS[key].push(item);
			}
			continue;
		}
		matches = lines[i].match(/^!!(?!!)/);
		if (!matches) {
			continue;
		}
		let newline = lines[i].substr(2);
		if (atonactive) {
			atonlines += newline + "\n";
			let stringg = `^@@END:\\s*${atonactive}\\s*$`;
			let regex = new RegExp(stringg);
			if (newline.match(regex)) {
				atonactive = "";
			}
			continue;
		} else {
			matches = newline.match(/^@@BEGIN:\s*(.*)\s*$/);
			if (matches) {
				atonactive = matches[1];
				atonlines += newline + "\n";
			}
		}
	}

	let output = {};
	if (atonlines) {
		let aton = new ATON;
		try {
			output = aton.parse(atonlines);
		} catch (error) {
			console.error("Error in ATON data:\n", atonlines);
		}
	}
	output._REFS = REFS;

	return output;
}



