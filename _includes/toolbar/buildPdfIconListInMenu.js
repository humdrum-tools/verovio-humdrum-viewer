

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
		console.error("ERROR: Cannot find URL container");
		return;
	}

	var urllist = getUrlAndFilterList();

	var output = "";

	let urls = urllist.url || {};

	if (urls.youtube && urls.youtube.length > 0) {
		for (var i=0; i<urls.youtube.length; i++) {
			output += makeYoutubeIcon(urls.youtube[i].url, urls.youtube[i].title);
		}
	}

	if (urls.wikipedia && urls.wikipedia.length > 0) {
		for (var i=0; i<urls.wikipedia.length; i++) {
			output += makeWikipediaIcon(urls.wikipedia[i].url, urls.wikipedia[i].title);
		}
	}

	if (urls.pdf && urls.pdf.length > 0) {
		for (var i=0; i<urls.pdf.length; i++) {
			output += makePdfIcon(urls.pdf[i].url, urls.pdf[i].title);
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

	container = document.querySelector("#embedded-filters");
	if (!container) {
		console.error("ERROR: Cannot find filter container");
		return;
	}

	let filters = urllist.filter || {};

	outputMain = "";

	output = "";
	for (let prop in filters) {
		let text = makeFilterIcon(filters[prop], prop);
		output += text;
		if ((prop === "modern") || (prop === "keyboard")) {
			outputMain += text;
		}
	}
	if (output === "") {
		container.style.display = "none";
	} else {
		container.style.display = "inline-block";
	}
	container.innerHTML = output;

	let mainContainer = document.querySelector("#main-filter-buttons");
	if (mainContainer) {
		mainContainer.innerHTML = outputMain;
	}

}

