

//////////////////////////////
//
// getSpreadsheetId -- A spreadsheed ID may be added
//   after a | character in the spreadsheet script ID box.
//

function getSpreadsheetId(value) {
	var matches = value.match(/([^\/]+)\/exec/);
	if (matches) {
		value = matches[1];
	}
	if (value.match(/^\s*$/)) {
		value = "";
	}
	matches = value.match(/^\s*(.*)[|\s]+(.*)\s*$/);
	if (matches) {
		value = matches[2];
	}
	SPREADSHEETID = value;
	localStorage.SPREADSHEETID = SPREADSHEETID;
	return value;
}


