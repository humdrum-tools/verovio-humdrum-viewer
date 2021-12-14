{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sat Dec 11 22:23:15 CET 2021
// Last Modified: Sat Dec 11 22:23:18 CET 2021
// Filename:      _includes/iiif/iiifCallback.js
// Used by:       
// Included in:   _includes/iiif/main.html
// Syntax:        ECMAScript 6
// vim:           ts=3:nowrap
//
// Description:   Prepare IIIF image URL after the base URL has been
//                extracted from the Humdrum digital score or IIIF Manifest.
//                
//
{% endcomment %}

function iiifCallback(event, info) {

	if (!info.iiifbase) {
		console.error("NO IIIF URL BASE IN", info);
		return;
	}
	if (!info.xywh) {
		console.error("NO XYWH PARAMETER IN", info);
		return;
	}
	if (info.xywh === "0,0,0,0") {
		console.error("EMPTY XYWH PARAMETER IN", info);
		return;
	}
	let iiifbase = info.iiifbase;
	let xywh     = info.xywh;

	let options = "popup=yes";
	let scale = window.devicePixelRatio;
	if (!scale) {
		scale = 1;
	}
	let scwidth  = parseInt(window.screen.width);
	let scheight = parseInt(window.screen.height);

	if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
		// display full page
		let infourl = `${iiifbase}/info.json`;
		let url = `${iiifbase}/full/,${scheight}/0/default.jpg`;
		options += `,top=0`;
		options += `,left=0`;
		options += `,height=${scheight}`;
		fetch(infourl)
			.then(res => res.json())
			.then(data => {
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
		let url = `${iiifbase}/${xywh}/full/0/default.jpg`;
		let matches = xywh.match(/(\d+),(\d+),(\d+),(\d+)/);
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
		window.open(url, "_blank", options);
	}

}



