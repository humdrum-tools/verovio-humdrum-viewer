

//////////////////////////////
//
// displayIndexFinally --
//

function displayIndexFinally(index, location, options) {
console.log("OPTIONS", options, JSON.stringify(GITHUB_LINKS));
console.log("INDEX", index);
	ShowingIndex = true;

	IndexSupressOfInput = true;
	if (InputVisible == true) {
		UndoHide = true;
		ApplyZoom = true;
		// hideInputArea(true);
	}

	var file = "";
	if (options) {
		file = options.file;
	}
	var matches;
	var lines = index.split(/\r?\n/);
	var i;
	var newlines = [];
	var data;
	for (i=0; i<lines.length; i++) {
		if (lines[i].match(/^\s*$/)) {
			continue;
		}
		data = lines[i].split(/\t+/);
		if (data.length >= 3) {
			if (matches = data[1].match(/(.*)HIDE$/)) {
				// data[1] = matches[1];
				data[1] = data[1].replace(/\/.ref/, "");
				data[2] = data[2].replace(/<hlstart>/g, "");
				data[2] = data[2].replace(/<hlend>/g, "");
			}
			newline = data[1] + "\t" + data[0] + "\t" + data[2];
			newlines.push(newline);
		}
	}
	newlines.sort();
	var items = [];
	for (i=0; i<newlines.length; i++) {
		data = newlines[i].split(/\t+/);
		var entry = {};
		entry.sorter = data[0];
		entry.filename = data[1];
		entry.text = cleanRepertoryEntryText(data[2]);
		items.push(entry);
	}

	var indents = {};

	var final = "<table class='index-list'>";
	for (i=0; i<items.length; i++) {
		if (items[i].text.match(/^All /)) {
			continue;
		}
		items[i].text = items[i].text.replace(/\[?<a[^>]*wikipedia[^<]*.*?<\/a>\]?/gi, "");

		final += "<tr>";
		if (items[i].filename.match(/^@/)) {
			final += "<td class='dummy'>"
		} else {
			final += "<td>"
		}

		if (indents[items[i].sorter]) {
			final += "<span class='indenter'></span>";
		} else if (indents[items[i].sorter.replace(/HIDE$/, "")]) {
			final += "<span class='indenter'></span>";
		}

		if (items[i].filename.match(/^@/)) {
			items[i].text.replace(/<not>.*?<\/not>/g, "");
			final += items[i].text;
			var xtext = items[i].filename;
			xtext = xtext.replace(/^@/, "");
			var tindent = xtext.split(/:/);
			indents = {};
			for (var j=0; j<tindent.length; j++) {
				indents[tindent[j]] = "true";
			}
		} else if (items[i].sorter.match(/HIDE$/)) {
			var spantext = "";
			spantext += location;
			spantext += "/" + items[i].filename;
			spantext += "');\">";
			items[i].text = items[i].text.replace(/<hlstart>/, spantext);
			final += items[i].text;
		} else if (!items[i].text.match(/hlstart/)) {
			final += "<span class='ilink' onclick=\"displayWork('";
			final += location;
			final += "/" + items[i].filename;
			final += "');\">";
			final += items[i].text;
			final += "</span>";
		} else {
			var spantext = "";
			spantext += "<span class='ilink' onclick=\"displayWork('";
			spantext += location.replace(/\/.ref/, "");
			spantext += "/" + items[i].filename;
			spantext += "');\">";
			items[i].text = items[i].text.replace(/<hlstart>/, spantext);
			if (items[i].text.match(/<hlend>/)) {
				items[i].text = items[i].text.replace(/<hlend>/, "</span>");
			} else {
				items[i].text += "</span>";
			}
			final += items[i].text;
		}
		final += "</td></tr>"
	}
	final += "</table>";

	let cssTop = 30;
	let buttonCount = 0;

	// close button (always)
	let button = `<button title="close index (esc key)" style="top:${cssTop + 33 * buttonCount}px" id="close-button" onclick="hideRepertoryIndex()"><i class="fas fa-times"></i></button>`;
	buttonCount++;

	// random button (always)
	button += `<button title="display random entry from index" style="top:${cssTop + 33 * buttonCount}px" id="random-button" onclick="chooseRandomEntry()"><i class="fas fa-random"></i></button>`;
	buttonCount++;

	if (options && options.event) {
		let target = options.event.target;

		if (target && target.dataset.website) {
			let website = target.dataset.website;
			if (!(website && website.match(/^\s*$/))) {
				button += `<button title="view reperotory website" style="top:${cssTop + 33 * buttonCount}px" id="website-button">`;
				button += `<a target="_blank" href="${website}">`;
				button += `<i title="view repertory website" class="fas fa-desktop"></i></a>`;
				button += `</button>`;
				buttonCount++;
			}
		}

		if (target && target.dataset.github) {
			let github = target.dataset.github;
			if (!(github && github.match(/^\s*$/))) {
				button += `<button title="view github repository for repertory" style="top:${cssTop + 33 * buttonCount}px" id="github-button">`;
				button += `<a target="_blank" href="${github}">`;
				button += `<i title="view github repository for repertory" class="fas fa-cloud"></i></a>`;
				button += `</button>`;
				buttonCount++;
			}
		}
	} else {
		if (WEBSITE_LINKS[file]) {
			button += `<button title="view reperotory website" style="top:${cssTop + 33 * buttonCount}px" id="website-button">`;
			button += `<a target="_blank" href="${WEBSITE_LINKS[file]}">`;
			button += `<i title="view repertory website" class="fas fa-desktop"></i></a>`;
			button += `</button>`;
			buttonCount++;
		}

		if (GITHUB_LINKS[file]) {
			button += `<button title="view github repository for repertory" style="top:${cssTop + 33 * buttonCount}px" id="github-button">`;
			button += `<a target="_blank" href="${GITHUB_LINKS[file]}">`;
			button += `<i title="view github repository for repertory" class="fas fa-cloud"></i></a>`;
			button += `</button>`;
			buttonCount++;
		}
	}

	final = `${button}<div id="index-table-wrapper">${final}</div>`;
	var indexelem = document.querySelector("#index");
	indexelem.innerHTML = final;
	indexelem.style.visibility = "visible";
	indexelem.style.display = "block";
}



//////////////////////////////
//
// chooseRandomEntry -- 
//

function chooseRandomEntry() {
	let table = document.querySelector("table.index-list");
	if (!table) {
		return;
	}
	let list = table.querySelectorAll(".ilink");
	if (list.length == 0) {
		return;
	}
	let randomNumber = Math.floor(Math.random() * list.length);
	let text = list[randomNumber].outerHTML;
	let matches = text.match(/displayWork.['"](.*?)['"]/);
	if (matches) {
		let entry = matches[1];
		displayWork(entry);
	}
}



