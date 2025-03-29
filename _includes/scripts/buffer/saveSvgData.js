


//////////////////////////////
//
// saveSvgData --
//

function saveSvgData() {
	if (ShowingIndex) {
		return;
	}

	var options = JSON.parse(JSON.stringify(OPTIONS));
	console.log("SVG PRINTING OPTIONS", options);
	var data = getTextFromEditor();
	if (data.match(/^\s*$/)) {
		return;
	};

	var humdrum = dataIsHumdrum(data);
	if (humdrum && GLOBALFILTER) {
		if (data.charAt[data.length-1] !== "\n") {
			data += "\n";
		}
		data += "!!!filter: " + GLOBALFILTER + "\n";
	}

	var page = vrvWorker.page;
	var force = true;

	// vrvWorker.renderPage(vrvWorker.page)
	vrvWorker.renderData(options, data, page, force)
	.then(function(data) {
		var filename = SAVEFILENAME;
		var size = EDITOR.session.getLength();
		var matches;
		var line;
		for (var i=0; i<size; i++) {
			line = EDITOR.session.getLine(i);
			if (matches = line.match(/^!!!!SEGMENT:\s*([^\s].*)\s*$/)) {
				filename = matches[1];
			}
		}
		filename = filename.replace(/\.[^.]+/, ".svg");
		if (!filename.match(/svg$/)) {
			filename += ".svg";
		}

		var blob = new Blob([data], {type: 'text/plain'});
		saveAs(blob, filename);

		// Redraw without adjustPageWidth on.
		options.adjustPageWidth = 0;
		vrvWorker.renderData(options, data, page, force)
	});
}
