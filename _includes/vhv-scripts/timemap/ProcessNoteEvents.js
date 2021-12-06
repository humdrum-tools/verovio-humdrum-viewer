

//////////////////////////////
//
// ProcessNoteEvents --
//

function ProcessNoteEvents(event) {
	var ons = event.on;
	var offs = event.off;
	var i;

	for (i=0; i<ons.length; i++) {
		// ons[i].style.stroke = "red";
		// ons[i].style.fill = "red";
		// have to re-find on page in case the image has changed:
		var xon = document.querySelector("#" + ons[i].id);
		xon.style.fill = "red";
	}

	for (i=0; i<offs.length; i++) {
		// have to re-find on page in case the image has changed:
		var xoff = document.querySelector("#" + offs[i].id);
		xoff.style.fill = "";
	}
}


