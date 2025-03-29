

//////////////////////////////
//
// processInfo --
//

function processInfo(info, obj, nextwork, prevwork) {
	var score;
	if (info) {
		FILEINFO = info;
		// score = atob(info.content);
		score = Base64.decode(info.content);
		// console.log("Score unpacked");
	} else {
		console.log("Impossible error for", infojson);
		return;
	}

	var matches;
	if (obj && obj.file && (matches = obj.file.match(/([^\/]+)$/))) {
		SAVEFILENAME = matches[1];
	}

	// var inputarea = document.querySelector("#input");
	// inputarea.value = score;
	displayScoreTextInEditor(score, vrvWorker.page);

	obj.next = false;
	obj.previous = false;

	if (!obj) {
		return;
	}

	if (info["next-work"]) {
		obj.file = info["next-work"];
		loadKernScoresFile(obj)
	}
	if (info["previous-work"]) {
		obj.file = info["previous-work"];
		loadKernScoresFile(obj)
	}
}
