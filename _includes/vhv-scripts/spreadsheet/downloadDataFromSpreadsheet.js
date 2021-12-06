

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


