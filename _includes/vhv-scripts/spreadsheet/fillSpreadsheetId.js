

//////////////////////////////
//
// fillSpreadsheetId -- This is run after creating the toolbar.
//    The spreasdsheet information from localStorage is inserted
//    into the Spreadsheet script ID box.
//

function fillSpreadsheetId() {
	var value = "";
	if (SPREADSHEETSCRIPTID) {
		value = SPREADSHEETSCRIPTID;
	}
	if (SPREADSHEETID) {
		value += "|" + SPREADSHEETID;
	}
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	selement.value = value;
	showSpreadsheetIconState();
}


