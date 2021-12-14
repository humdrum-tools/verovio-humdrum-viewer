{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 16:55:37 CET 2021
// Last Modified: Mon Dec  6 14:27:45 CET 2021
// Filename:      _includes/iiif/getIiifBase.js
// Used by:       
// Included in:   _includes/iiif/main.html
// Syntax:        ECMAScript 6
// vim:           ts=3:nowrap
//
// Description:   Find the IIIF base, either as a separate line, or
//                indirectly through a manifest.
//
{% endcomment %}

function getIiifBase(info, event, callback) {
	let label = info.label;
	if (!label) {
		return "";
	}
	let humdrum = info.humdrum;
	if (!humdrum) {
		return "";
	}

	info.iiifbase = "";

	// First search for line in the format:
	//     !!!IIIF-{label}: {iiifbase}
	
	// Most likely at end of file, so searching backwards.
	// Could also limit to outer regions of file and not search
	// inside data region.
	let skey = `^!!!IIIF-${label}:\\s*([^\\s]+)`;
	let regex = new RegExp(skey);
	for (let i=humdrum.length - 1; i>=0; i--) {
		let matches = humdrum[i].match(regex);
		if (matches) {
			info.iiifbase = matches[1];
			callback(event, info);
			return;
		}
	}

	getIiifManifestInfo(info, event, callback);
}



