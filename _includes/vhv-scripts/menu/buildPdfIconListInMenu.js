

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

	var urllist = getUrlList();

	var output = "";

	if (urllist.youtube && urllist.youtube.length > 0) {
		for (var i=0; i<urllist.youtube.length; i++) {
			output += makeYoutubeIcon(urllist.youtube[i].url, urllist.youtube[i].title);
		}
	}

	if (urllist.pdf && urllist.pdf.length > 0) {
		for (var i=0; i<urllist.pdf.length; i++) {
			output += makePdfIcon(urllist.pdf[i].url, urllist.pdf[i].title);
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

