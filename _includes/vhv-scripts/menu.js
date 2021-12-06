

//////////////////////////////
//
// buildPdfIconListInMenu -- Read !!!URL-pdf: reference records and
//    create icons for each one at the top right of the VHV window.
//    If there are no embedded URLs, then display the one from index.hmd
//    if there is a PDF available from kernScores.
//

function buildPdfIconListInMenu() {
	var container = document.querySelector("#pdf-urls");
	if (!container) {
		return;
	}

	var urllist = getPdfUrlList();

	var output = "";
	if (urllist.length > 0) {
		for (var i=0; i<urllist.length; i++) {
			output += makePdfIcon(urllist[i].url, urllist[i].title);
		}
	} else {
		if (FILEINFO && FILEINFO["has-pdf"] && (FILEINFO["has-pdf"] === "true")) {
			var url = "https://kern.humdrum.org/data?l=" + FILEINFO["location"];
			url += "&file=" + FILEINFO["file"];
			url += "&format=pdf&#view=FitH";
			output += makePdfIcon(url, "Source edition");
		}
	}

	container.innerHTML = output;
}



//////////////////////////////
//
// buildScanIconListInMenu -- Read !!!URL-scan: reference records and
//    create icons for each one at the top right of the VHV window.
//

function buildScanIconListInMenu() {
	var container = document.querySelector("#scan-urls");
	if (!container) {
		return;
	}

	var urllist = getScanUrlList();

	var output = "";
	if (urllist.length > 0) {
		for (var i=0; i<urllist.length; i++) {
			output += makeScanIcon(urllist[i].url, urllist[i].title);
		}
	}

	container.innerHTML = output;
}



//////////////////////////////
//
// makePdfIcon --
//

function makePdfIcon(url, title) {
	title = title.replace(/"/g, "'");
	var output = "<div title=\"" + title + "\" ";
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:100%' ";
	output += "onclick='openPdfAtBottomThirdOfScreen(\"" + url + "\")' ";
	output += "class='nav-icon fas fa-file-pdf-o'></div>";
	return output;
}



//////////////////////////////
//
// makeScanIcon --
//

function makeScanIcon(url, title) {
	title = title.replace(/"/g, "'");
	var output = `<div title="${title}" `;
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:100%' ";
	output += `onclick="window.open('${url}')" `;
	output += "class='nav-icon fas fa-picture-o'></div>";
	return output;
}



