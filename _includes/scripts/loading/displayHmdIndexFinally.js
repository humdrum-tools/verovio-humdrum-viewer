
//////////////////////////////
//
// displayHmdIndexFinally --
//

function displayHmdIndexFinally(hmdindex, source, options) {
	if (!hmdindex.parameters.hmdindexurl) {
		hmdindex.parameters.hmdindexurl = source;
	}
	if (hmdindex.parameters.hmdindexurl && !hmdindex.parameters.baseurl) {
		var baseurl = hmdindex.parameters.hmdindexurl.replace(/\/index.hmd$/, "");
		hmdindex.parameters.baseurl = baseurl;
	}
	ShowingIndex = true;

	IndexSupressOfInput = true;
	if (InputVisible == true) {
		UndoHide = true;
		ApplyZoom = true;
		// hideInputArea(true);
	}

	var indexelem = document.querySelector("#index");
	indexelem.innerHTML = hmdindex.generateHTML();;
	indexelem.style.visibility = "visible";
	indexelem.style.display = "block";
}
