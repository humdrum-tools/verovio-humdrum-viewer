{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Jun 11 19:15:38 PDT 2022
// Last Modified: Sat Jun 11 19:15:40 PDT 2022
// Filename:      _includes/vhv-scripts/html/applyParameters.js
// Included in:   _includes/vhv-scripts/html/main.js
// Syntax:        HTML; ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Treat input string as a template, which can be filled
//                in with reference record values or parameter values
//                from PRE/POST HTML parameters.
//
{% endcomment %}

function applyParameters(text, refs1, refs2) {
	if (typeof text === "undefined") {
		return;
	}

	let regex = /@\{(.*?)\}/g;
	text = text.replace(regex, function(value0, value1) {
		let output = "";
		console.warn("VALUE0", value0, "VALUE1", value1);
		let key = value1;
		if ((typeof refs1 !== "undefined") && (typeof refs1[key] !== "undefined")) {
			console.warn("REF1", key, " = ", refs1[key]);
			if (Array.isArray(refs1[key])) {
				output = refs1[key][0];
			} else if (typeof refs1[key] === "string") {
				output = refs1[key];
			}
		} else if ((typeof refs2 !== "undefined") && (typeof refs2[key] !== "undefined")) {
			console.warn("REF2", key, " = ", refs2[key]);
			if (Array.isArray(refs2[key])) {
				output = refs2[key][0].value;
			} else if (typeof refs2[key].value === "string") {
				output = refs2[key].value;
			}
		}
		return output;
	});
	return text;
}



