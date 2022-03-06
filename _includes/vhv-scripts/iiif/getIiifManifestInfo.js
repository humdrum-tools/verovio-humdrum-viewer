{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Fri Dec 10 12:46:45 CET 2021
// Last Modified: Fri Dec 10 12:46:48 CET 2021
// Filename:      _includes/vhv-scripts/iiif/getIiifManifestInfo.js
// Used by:       
// Included in:   _includes/vhv-scripts/iiif/main.html
// Syntax:        ECMAScript 6
// vim:           ts=3:nowrap
//
// Description:   Download IIIF Manifest and extract the page
//                image list along with labels for each image.
//
{% endcomment %}


var DATA = "XXX";

function getIiifManifestInfo(info, event, callback) {
console.warn("GETIIIFMANIFEST INFO", info);
	let humdrum = info.humdrum;
	if (!humdrum) {
		console.error("NO HUMDRUM DATA IN", info);
		return;
	}
	if (!info.label) {
		console.error("NO IMAGE LABEL IN", info);
		return;
	}
	let label = info.label;

	let skey = `^!!!IIIF:\\s*([^\\s]+)`;
	let regex = new RegExp(skey);
	for (let i=humdrum.length - 1; i>=0; i--) {
		let matches = humdrum[i].match(regex);
		if (matches) {
			let manifest = matches[1];
			let mobj = IIIF_MANIFEST[manifest];
			if (mobj) {
				info.manifest = mobj;
				let imi = mobj.images;
				for (let j=0; j<imi.length; j++) {
					if (imi[j].label === label) {
						info.iiifbase = imi[j].iiifbase;
						break;
					}
				}

				if (!info.iiifbase) {
					// 0-indexed image number:
					let matches = label.match(/^#z(\d+)/);
					if (matches) {
						info.iiifbase = info.manifest.images[parseInt(matches[1])].iiifbase;
					}

					// 1-indexed image number:
					matches = label.match(/^#(\d+)/);
					if (matches) {
						info.iiifbase = info.manifest.images[parseInt(matches[1]) - 1].iiifbase;
					}
				}

				callback(event, info);
				return;
			}
			fetch(manifest)
				.then(results => results.json())
				.then(data => {
				   let items = data.items;
					let version = 3;
					if (!items) {
						// Assume IIIF version 2 (better check can be done).
						version = 2;
						items = data.sequences[0].canvases;
					}
					let maninfo = {};
					maninfo.images = [];
					maninfo.manifest = manifest;
					for (let i=0; i<items.length; i++) {
						let entry = {};
						if (items[i].id) {
							entry.iiifbase = items[i].id.replace(/\/?info\.json$/, "");
						} else if (items[i]["@id"]) {
							entry.iiifbase = items[i].images[0].resource["@id"].replace(/\/?full.*\.jpg$/, "");
						} else {
							console.warn("PROBLEM HERE WITH IIIF BASE");
						}
						let lobj = items[i].label;
						let label = "";
						if (version == 3) {
							let keys = Object.keys(lobj);
							if (keys.length > 0) {
								label = lobj[keys[0]][0];
							}
						}
						if (!label) {
							label = items[i].label;
						}
						if (label) {
							entry.label = label;
						}
						if (label === info.label) {
							info.iiifbase = entry.iiifbase;
						}
						maninfo.images.push(entry);
					}

					info.manifest = maninfo;

					if (!info.iiifbase) {
						// 0-indexed image number:
						let matches = info.label.match(/^#z(\d+)/);
						if (matches) {
							info.iiifbase = info.manifest.images[parseInt(matches[1])].iiifbase;
						}

						// 1-indexed image number:
						matches = info.label.match(/^#(\d+)/);
						if (matches) {
							info.iiifbase = info.manifest.images[parseInt(matches[1]) - 1].iiifbase;
						}
					}
					IIIF_MANIFEST[manifest] = maninfo;
					callback(event, info);
				})
				.catch(error => { console.error(error); });
			break;
		}
	}
}



