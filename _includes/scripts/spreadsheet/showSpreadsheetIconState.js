

//////////////////////////////
//
// showSpreadsheetIconState --
//

function showSpreadsheetIconState() {
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	var scriptid = getSpreadsheetScriptId(selement.value);
	var sheetid = getSpreadsheetId(selement.value);

	SPREADSHEETSCRIPTID = scriptid;
	SPREADSHEETID = sheetid;
	localStorage.SPREADSHEETSCRIPTID = scriptid;
	localStorage.SPREADSHEETID = sheetid;

	var sheetelement = document.querySelector("#sheetid");
	if (!sheetelement) {
		return;
	}
	if (!sheetid) {
		sheetelement.style.display = "none";
	} else {
		sheetelement.style.display = "inline-block";
	}
}

