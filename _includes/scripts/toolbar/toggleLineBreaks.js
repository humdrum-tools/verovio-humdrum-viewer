

///////////////////////////////
//
// toggleLineBreaks --
//

function toggleLineBreaks() {
	BREAKS = !BREAKS;
	var element = document.querySelector("#line-break-icon");
	if (!element) {
		console.log("Warning: cannot find line-break icon");
		return;
	}
	var output = "";
	if (BREAKS) {
		output += '<span title="Automatic line breaks" class="nav-icon fas fa-align-justify"></span>';
	} else {
		output += '<span title="Use embedded line breaks (if any)" class="nav-icon fas fa-align-center"></span>';
	}
	element.innerHTML = output;

	displayNotation();
}
