
// Convert Humdrum data to MusicXML (server-side conversion),
// with result being saved to hard disk.
// vim: ts=3:nowrap
//

function convertToMusicXmlAndSave() {
	if (document.body.classList.contains("waiting")) {
		alert("Already converting a score");
		return;
	}

	let formdata = new FormData();
	let inputdata = getTextFromEditor();
	var blob = new Blob([inputdata], { type: "text/x-humdrum" });
	formdata.append("inputdata", blob);

	for (var pair of formdata.entries()) {
		console.log("FORMDATA", pair[0] + ', ' + pair[1]); 
	}

	document.body.classList.add("waiting");
	let request = new XMLHttpRequest();
	request.open("POST", "https://data.musicxml.humdrum.org");
	request.responseType = "blob";
	request.onload = function () {
		document.body.classList.remove("waiting");
		let myblob = this.response;
		let url = window.URL.createObjectURL(myblob);

		// open in another window:
		// window.open(url);

		// or save to a file:
		let link = document.createElement("a");
		document.body.appendChild(link);
		link.style = "display: none";
		link.href = url;
		link.download = "data" + ".musicxml";
		link.click();
		// window.URL.revokeObjectURL(url);
		document.body.removeChild(link);

	};
	request.send(formdata);
}



