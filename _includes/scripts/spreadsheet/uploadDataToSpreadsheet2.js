

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

