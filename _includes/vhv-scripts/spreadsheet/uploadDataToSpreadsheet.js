



//////////////////////////////
//
// uploadDataToSpreadsheet --
//

function uploadDataToSpreadsheet(event) {
	setTimeout(function () {
		document.body.classList.add("waiting");
	}, 0);
	if (event.shiftKey) {
		// upload without passing through tabber filter.
		uploadDataToSpreadsheet2(getTextFromEditor());
	} else {
		MENU.applyFilter("tabber", getTextFromEditor(), uploadDataToSpreadsheet2);
	}
}
