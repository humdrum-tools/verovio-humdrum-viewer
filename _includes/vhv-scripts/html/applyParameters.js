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

function applyParameters(text, refs1, refs2, language) {
	if (typeof text === "undefined") {
		return;
	}

	let regex = /@\{(.*?)\}/g;
	text = text.replace(regex, function(value0, value1) {
		let output = "";
		console.warn("VALUE0", value0, "VALUE1", value1);
		let key = value1;
		let keyolang;
		let keylang;

		if (language) {
			keyolang = `${key}@@${language}`;
			keylang = `${key}@${language}`;
		}

		if ((typeof keyolang !== "undefined") && (typeof refs1 !== "undefined") && (typeof refs1[keyolang] !== "undefined")) {
			if (Array.isArray(refs1[keyolang])) {
				output = refs1[keyolang][0];
			} else if (typeof refs1[keyolang] === "string") {
				output = refs1[keyolang];
			}
		} else if ((typeof keylang !== "undefined") && (typeof refs1 !== "undefined") && (typeof refs1[keylang] !== "undefined")) {
			if (Array.isArray(refs1[keylang])) {
				output = refs1[keylang][0];
			} else if (typeof refs1[keylang] === "string") {
				output = refs1[keylang];
			}
		} else if ((typeof refs1 !== "undefined") && (typeof refs1[key] !== "undefined")) {
			if (Array.isArray(refs1[key])) {
				output = refs1[key][0];
			} else if (typeof refs1[key] === "string") {
				output = refs1[key];
			}
		} else if ((typeof keyolang !== "undefined") && (typeof refs2 !== "undefined") && (typeof refs2[keyolang] !== "undefined")) {
			if (Array.isArray(refs2[keyolang])) {
				output = refs2[keyolang][0].value;
			} else if (typeof refs2[keyolang].value === "string") {
				output = refs2[keyolang].value;
			}
		} else if ((typeof keylang !== "undefined") && (typeof refs2 !== "undefined") && (typeof refs2[keylang] !== "undefined")) {
			if (Array.isArray(refs2[keylang])) {
				output = refs2[keylang][0].value;
			} else if (typeof refs2[keylang].value === "string") {
				output = refs2[keylang].value;
			}
		} else if ((typeof refs2 !== "undefined") && (typeof refs2[key] !== "undefined")) {
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



