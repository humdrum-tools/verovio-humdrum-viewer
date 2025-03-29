

//////////////////////////////
//
// openSpreadsheet --
//

function openSpreadsheet() {
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	var id = getSpreadsheetId(selement.value);
	if (!id) {
		if (SPREADSHEETID) {
			id = SPREADSHEETID;
		}
	}
	if (!id) {
		return;
	}
	var url = "https://docs.google.com/spreadsheets/d/";
	url += id;
	window.open(url, "spreasheet");
}
