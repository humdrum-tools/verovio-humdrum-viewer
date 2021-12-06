


//////////////////////////////
//
// getSpreadsheetScriptId -- Extract ID from URL if present and also
//    store ID in localStorage for use in a later session.
//

function getSpreadsheetScriptId(value) {
	var matches = value.match(/([^\/]+)\/exec/);
	if (matches) {
		value = matches[1];
	}
	if (value.match(/^\s*$/)) {
		value = "";
	}
	matches = value.match(/^\s*([^|\s]*)/);
	if (matches) {
		value = matches[1];
	}
	SPREADSHEETSCRIPTID = value;
	localStorage.SPREADSHEETSCRIPTID = SPREADSHEETSCRIPTID;
	return value;
}


