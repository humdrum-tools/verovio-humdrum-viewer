{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec  4 13:31:16 CET 2021
// Last Modified: Sat Dec  4 13:31:19 CET 2021
// Filename:      _includes/vhv-scripts/iiif/processClickForIiif.js
// Included in:   _includes/vhv-scripts/iiif/main.js
// Syntax:        ECMAScript 6
// vim:           ts=3:nowrap
//
// Description:   Check the element path for a mouse click and 
//                process any IIIF that is active on the current
//                click path.
//
{% endcomment %}

function processClickForIiif(event) {
	let path = buildPath(event.target);
	if (!path) {
		return;
	}
	// assuming the text editor contains Humdrum data:
	let humdrum = getTextFromEditor();

	let line = -1;
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
	// zero-index line and field
	let info = getIiifInfo(humdrum, line-1, field-1);
	// console.log("IIIF info", info);
	if (!info.xywh) {
		return;
	}
	if (!info.tag) {
		return;
	}
	if (!info.iiifbase) {
		return;
	}

	let options = "popup=yes";
	let scale = window.devicePixelRatio;
	if (!scale) {
		scale = 1;
	}
	let scwidth = parseInt(window.screen.width);
	let scheight = parseInt(window.screen.height);

	if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) {
		// Any modifier key will cause display of full page instead of system.
		let infourl = info.infourl;
		let url = `${info.iiifbase}/full/,${scheight}/0/default.jpg`;
		options += `,top=0`;
		options += `,left=0`;
		options += `,height=${scheight}`;
		fetch(infourl)
			.then(res => res.json())
			.then(data => {
				// console.warn(data);
				let imgwidth = data.width;
				let imgheight = data.height;
				// console.warn("IW", imgwidth, "IH", imgheight);
				let aspect = imgwidth / imgheight;
				let newwidth = scheight * aspect;
				options += `,width=${newwidth}`;
				window.open(url, "_blank", options);
			})
			.catch(err => {
				window.open(url, "_blank", options);
			});
		event.preventDefault();
	} else {
		// display only system image.  The system is displayed
		// at the bottom of the screen, centered if the image does
		// not go all of the way across the screen.
		let heightprop = 4;  // max 1/4 of window height for image
		let url = `${info.iiifbase}/${info.xywh}/full/0/default.jpg`;
		let matches = info.xywh.match(/(\d+),(\d+),(\d+),(\d+)/);
		let width = 0;
		let height = 0
		if (matches) {
			width = matches[3];
			height = matches[4];
		}
		let aspect = width / height;
		let maxheight = parseInt(scheight / heightprop);
		let maxwidth = scwidth;
		width  = width  > maxwidth  ? maxwidth  : width;
		height = height > maxheight ? maxheight : height;
		let newaspect = width / height;
		if (newaspect > aspect) {
			width = parseInt(height * aspect);
		} else if (newaspect < aspect) {
			height = parseInt(width / aspect);
		}
		let sctop = scheight - height;
		let scleft = parseInt((scwidth - width)/2);
		options += `,width=${width}`;
		options += `,height=${height}`;
		options += `,top=${sctop}`;
		options += `,left=${scleft}`;
		let imgwin = window.open(url, "_blank", options);
	}
	
}



