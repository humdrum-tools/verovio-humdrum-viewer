

//////////////////////////////
//
// loadBuffer -- load the text contents from a local buffer, but if the
//    shift key is pressed, delete the current contents of the buffer instead.
//

function loadBuffer(number, event) {
	if (number < 1 || number > 9) {
		return;
	}
	if (event && event.shiftKey) {
		// clear contents of given buffer.
		var key = "SAVE" + number;
		delete localStorage[key];
		var title = key + "-TITLE";
		delete localStorage[title];
		var selement = document.querySelector("#save-" + number);
		if (selement) {
			selement.classList.remove("filled");
		}
		var lelement = document.querySelector("#load-" + number);
		if (lelement) {
			lelement.classList.remove("filled");
		}
	} else {
		// store contents of text editor in given buffer.
		MENU.loadFromBuffer(number);
	}
}



//////////////////////////////
//
// saveBuffer -- save the text contents to a local buffer, but if the
//    shift key is pressed, delete the current contents of the buffer instead.
//

function saveBuffer(number, event) {
	if (number < 1 || number > 9) {
		return;
	}
	if (event && event.shiftKey) {
		// clear contents of given buffer.
		var key = "SAVE" + number;
		delete localStorage[key];
		var title = key + "-TITLE";
		delete localStorage[title];
		var selement = document.querySelector("#save-" + number);
		if (selement) {
			selement.classList.remove("filled");
		}
		var lelement = document.querySelector("#load-" + number);
		if (lelement) {
			lelement.classList.remove("filled");
		}
	} else {
		// store contents of text editor in given buffer.
		MENU.saveToBuffer(number);
	}
}



//////////////////////////////
//
// restoreEditorContentsLocally -- Restore the editor contents from localStorage.
//

function restoreEditorContentsLocally() {
	// save current contents to 0th buffer
	var encodedcontents = encodeURIComponent(getTextFromEditorRaw());
	localStorage.setItem("SAVE0", encodedcontents);
	// reset interval timer of buffer 0 autosave here...

	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	key = "SAVE" + target;
	var contents = localStorage.getItem(key);
	if (!contents) {
		return;
	}
	var decodedcontents = decodeURIComponent(localStorage.getItem(key));
	setTextInEditor(decodedcontents);
	InterfaceSingleNumber = 0;
}



//////////////////////////////
//
// prepareBufferStates --
//

function prepareBufferStates() {
	var saves = document.querySelectorAll("[id^=save-]");
	var loads = document.querySelectorAll("[id^=load-]");
	var i;
	var id;
	var num = 0;
	var value;
	var matches;
	var skey;
	var lkey;
	var tkey;

	for (i=0; i<saves.length; i++) {
		id = saves[i].id;
		matches = id.match(/save-(\d+)/);
		if (matches) {
			num = parseInt(matches[1]);
		} else {
			continue;
		}
		if (num < 1) {
			continue;
		}
		skey = "SAVE" + num;
		if (localStorage.hasOwnProperty(skey)) {
			value = localStorage[skey];
			if (value) {
				saves[i].classList.add("filled");
				tkey = "SAVE" + num + "-TITLE";
				if (localStorage.hasOwnProperty(tkey)) {
					title = localStorage[tkey];
					if (title) {
						saves[i].title = title;
					}
				}
			}
		}
	}

	for (i=0; i<loads.length; i++) {
		id = loads[i].id;
		matches = id.match(/load-(\d+)/);
		if (matches) {
			num = parseInt(matches[1]);
		} else {
			continue;
		}
		if (num < 1) {
			continue;
		}
		skey = "SAVE" + num;
		if (localStorage.hasOwnProperty(skey)) {
			value = localStorage[skey];
			if (value) {
				loads[i].classList.add("filled");
				tkey = "SAVE" + num + "-TITLE";
				if (localStorage.hasOwnProperty(tkey)) {
					title = localStorage[tkey];
					if (title) {
						loads[i].title = title;
					}
				}
			}
		}
	}
}



//////////////////////////////
//
// saveEditorContentsLocally -- Save the editor contents to localStorage.
//

function saveEditorContentsLocally() {
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	key = "SAVE" + target;
	var value = getTextFromEditorRaw();
	var filled = false;
	var encodedcontents = "";
	if (value.match(/^\s*$/)) {
		encodedcontents = "";
		filled = false;
	} else {
		encodedcontents = encodeURIComponent(value);
		filled = true;
	}
	localStorage.setItem(key, encodedcontents);
	var telement = document.querySelector("#title-info");
	var title = "";
	if (telement) {
		title = telement.textContent.replace(/^\s+/, "").replace(/\s+$/, "");
	}
	localStorage.setItem(key + "-TITLE", title);

	var selement = document.querySelector("#save-" + target);
	if (selement) {
		selement.title = title;
		if (filled) {
			selement.classList.add("filled");
		} else {
			selement.classList.remove("filled");
		}
	}

	var lelement = document.querySelector("#load-" + target);
	if (lelement) {
		lelement.title = title;
		if (filled) {
			lelement.classList.add("filled");
		} else {
			lelement.classList.remove("filled");
		}
	}

	InterfaceSingleNumber = 0;
}



//////////////////////////////
//
// downloadEditorContentsInHtml --
//

function downloadEditorContentsInHtml() {
	var filebase = getFilenameBase();
	var ext = "html";
	var filename = filebase + "." + ext;
	var text = getTextFromEditor();

	var humdrum = dataIsHumdrum(text);
	if (humdrum && GLOBALFILTER) {
		if (text.charAt[text.length-1] !== "\n") {
			text += "\n";
		}
		text += "!!!filter: " + GLOBALFILTER + "\n";
	}

	var output = '<html>\n';
	output += '<head>\n';
	output += '<title>My Score</title>\n';
	output += '<script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin-worker.js"></script>\n';
	output += '</head>\n';
	output += '<body>\n';
	output += '<script>\n';
	output += '   displayHumdrum({\n';
	output += '      source: "my-score",\n';
	output += '      autoResize: "true",\n';
	output += '      header: "true"\n';
	output += '   });\n';
	output += '<!-- See https://plugin.humdrum.org/#options for more display options -->\n';
	output += '</script>\n';
	output += '\n';
	output += '<script type="text/x-humdrum" id="my-score">\n';
	output += text;
	output += '</script>\n';
	output += '\n';
	output += '</body>\n';
	output += '</html>\n';
	// var blob = new Blob([output], {type: 'text/plain;charset=utf-8'});
	var blob = new Blob([output], {type: 'text/plain'});
	saveAs(blob, filename);
}



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
