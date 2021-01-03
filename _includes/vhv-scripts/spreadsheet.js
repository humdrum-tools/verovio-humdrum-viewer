

//////////////////////////////
//
// downloadDataFromSpreadsheet --
//

function downloadDataFromSpreadsheet(event) {
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	var id = getSpreadsheetScriptId(selement.value);
	if (!id) {
		return;
	}
	showSpreadsheetIconState();
	setTimeout(function () {
		document.body.classList.add("waiting");
	}, 0);

   var url = "https://script.google.com/macros/s/" + id + "/exec";
   var request = new XMLHttpRequest;
   request.open("GET", url);
	var shiftkey = event.shiftKey;
   request.addEventListener("load", function (event) {
		storeSpreadsheetDataInEditor(request.responseText, shiftkey);
		setTimeout(function () {
			document.body.classList.remove("waiting");
		}, 10);
   });
	request.send();
}



function storeSpreadsheetDataInEditor(data, shiftkey) {
	// first check to see if the current contents has any double tabs,
	// and if not, collapse tabs in data.
	var contents = getTextFromEditor();
	if (!contents.match(/\t\t/)) {
		// collapse tabs
		if (shiftkey) {
			storeSpreadsheetDataInEditor2(data);
		} else {
			MENU.applyFilter("tabber -r", data, storeSpreadsheetDataInEditor2);
		}
	} else {
		// preserve presumed expanded tab data.
		setTextInEditor(data);
	}
}

function storeSpreadsheetDataInEditor2(data) {
	setTextInEditor(data);
}



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

function uploadDataToSpreadsheet2(data) {
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	var id = getSpreadsheetScriptId(selement.value);
	if (!id) {
		return;
	}
	showSpreadsheetIconState();
   var url = "https://script.google.com/macros/s/" + id + "/exec";
   var request = new XMLHttpRequest;
   var formdata = new FormData();
   formdata.append("humdrum", data);
   request.open("POST", url);
   request.send(formdata);
	request.addEventListener("load", function (event) {
		setTimeout(function () {
			document.body.classList.remove("waiting");
		}, 10);
	});
}



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
