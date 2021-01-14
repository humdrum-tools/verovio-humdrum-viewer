

//////////////////////////////
//
// loadKernScoresFile --
//

function loadKernScoresFile(obj, force) {
	var file        = obj.file;
	var measures    = obj.measures;
	var page        = obj.page;
	var getnext     = obj.next;
	var getprevious = obj.previous;

	file = applyUrlAliases(file);

	if (measures) {
		var getnext     = false;
		var getprevious = false;
	}

	COUNTER++;
	if (COUNTER > 10000) {
		console.log("RECURSION TOO LARGE", file);
		return;
	}

	var url = "";
	var key = "";
	var ret;

	if (file) {
		if (file.match(/^https?:/)) {
			url = file;
			key = file;
		} else if (file.match(/^bb:/)) {
			ret = getBitbucketUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.key;
			}
		} else if (file.match(/^bitbucket:/)) {
			ret = getBitbucketUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.key;
			}
		} else if (file.match(/^github:/)) {
			ret = getGithubUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.key;
			}
		} else {
			ret = kernScoresUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.url;
			}
		}
	} else if (obj.tasso) {
		ret = getTassoUrl(obj.tasso, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	} else if (obj.bb) {
		ret = getBitbucketUrl(obj.bb, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	} else if (obj.github) {
		ret = getGithubUrl(obj.bb, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	} else if (obj.bitbucket) {
		ret = getBitbucketUrl(obj.bitbucket, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	}

	if (!key) {
		key = "DATA";
		// return;
	}

	var requires = getRequires(url, key);

	var keys = commaDuplicate(key);

	if (force) {
		for (var i=0; i<keys.length; i++) {
			basketSession.remove(key[i]);
			console.log("removed ", key[i]);
		}
	}

	redrawInputArea();

	var expire = 142;

	var jinfo;

	var info = basketSession.get(keys[0]);
	// var info = null;
	// console.log("INFO", info)

	if (obj && obj.file && (obj.file.match(/musedata/))) {
		// console.log("Going to download", key);
		basketSession.require(...requires).then(function() {
			var infos = [];
			for (var j=0; j<keys.length; j++) {
				infos[j] = basketSession.get(keys[j]);
			}
			var data = "";
			var filenames = commaDuplicate(key);
			for (j=0; j<infos.length; j++) {
				// print file header
				data += "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n";
				//mm = key.match(/([^\/]+)\/([^\/]+)\s*$/);
				//if (mm) {
				//	// filename = mm[1] + "/" + base;
				//	filename = filenames[j];
				//} else {
				//	filename = "unknown";
				//}
				filename = infos[j].url;
				data += "@filename==" + filename + "\n";
				data += "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n";
				var oinfo = infos[j];
				data += oinfo.data;
				data += "/eof\n";
			}
			data += "//\n"; // end-of-transmission marker for MuseData stage2 multipart file.
			displayScoreTextInEditor(data, vrvWorker.page);

			if (infos.length > 1) {
				// console.log("GOING TO ADD MULTIPLE FILES TO EDITOR", infos);
			} else if (infos.length == 1) {
				info = basketSession.get(key);
				console.log("INFO = ", info);
				if (info) {
					try {
						jinfo = JSON.parse(info.data);
						if (force) {
							try {
								var textdata = atob(jinfo.content);
							} catch (err) {
								// text is not MIME encoding.
							}
							if (textdata.match(/^\s*$/)) {
								textdata = "!!!ONB: No data content\n";
							}
							try {
								displayScoreTextInEditor(atob(jinfo.content), vrvWorker.page);
							} catch (err) {
								displayScoreTextInEditor(jinfo.content, vrvWorker.page);
							}
						}
						if (getnext) {
							processInfo(jinfo, obj, false, false);
						}
					} catch(err) {
						console.log("Error downloading", key, "Error:", err);
						displayScoreTextInEditor(info.data, vrvWorker.page);
						if (CGI.k.match(/c/)) {
							CGI.k = CGI.k.replace(/c/, "");
							compileFilters();
						}
					}
				} else {
					console.log("Error retrieving", key);
				}
				redrawInputArea();
			}
		}, function() {
			console.log("Error retrieving", key);
		});
	} else if (!info) {
		console.log("Going to download", key);
		basketSession.require(
			{	url: url,
				key: key,
				expire: expire,
				execute: false
			}
		).then(function() {
			info = basketSession.get(key);
			if (info) {
				if (info.url.match(/\/index.hmd$/)) {
					HMDINDEX = new HMDIndex(info.data);
					HMDINDEX.parameters.githubbase = file;
					displayHmdIndexFinally(HMDINDEX, url);
				} else {
					try {
						jinfo = JSON.parse(info.data);
						if (force) {
							var textdata = atob(jinfo.content);
							if (textdata.match(/^\s*$/)) {
								textdata = "!!!ONB: No data content\n";
							}
							displayScoreTextInEditor(atob(jinfo.content), vrvWorker.page);
						}
						if (getnext) {
							processInfo(jinfo, obj, false, false);
						}
					} catch(err) {
						console.log("Error downloading", key, "Error:", err);
						displayScoreTextInEditor(info.data, vrvWorker.page);
						if (CGI.k.match(/c/)) {
							CGI.k = CGI.k.replace(/c/, "");
							compileFilters();
						}
					}
				}
			} else {
				console.log("Error1 retrieving", key);
			}
			redrawInputArea();
		}, function() {
			console.log("Error2 retrieving", key);
		});
	} else {
		try {
			jinfo = JSON.parse(info.data);
			if (getnext) {
				processInfo(jinfo, obj, false, false);
			}
		} catch(err) {
			displayScoreTextInEditor(info.data, vrvWorker.page);
			if (CGI.k && CGI.k.match(/c/)) {
				CGI.k = CGI.k.replace(/c/, "");
				compileFilters();
			}
			redrawInputArea();
		}
	}
}



//////////////////////////////
//
// getTassoUrl --
//

function getTassoUrl(file, measures) {
	var filename = file.replace(/\.krn$/, "");;

	var url = "https://josquin.stanford.edu/cgi-bin/tasso?&file=" + filename;
	url += "&a=humdrum";

	var key = filename;
	if (measures) {
		url += "&mm=" + measures;
		key += "&mm=" + measures;
	}

	return {url: url, key: key};
}


//////////////////////////////
//
// getGithubUrl --
//
// http://verovio.humdrum.org/?file=github:polyrhythm-project/rds-scores
// https://bitbucket.org/musedata/beethoven/raw/master/bhl/qrtet/op18no5/stage2/01/03
//

function getGithubUrl(file, measures) {
	file = file.replace(/^github:\/*/, "");

	var username = "";
	var repository = "";
	var pathandfile = "";
	var url = "";

	url = "https://raw.githubusercontent.com/";
	matches = file.match("^\/*([^\/]+)\/([^\/]+)\/?(.*)");
	if (matches) {
		username    = matches[1];
		repository  = matches[2];
		pathandfile = matches[3];
	}
	url += username;
	url += "/";
	url += repository;
	url += "/master/";
	if (!pathandfile) {
		url += "index.hmd";
	} else {
		url += pathandfile;
	}

	var key = pathandfile;

	var obj = {url: url, key: key};
	return obj;
}


//////////////////////////////
//
// getBitbucketUrl --
//
// http://verovio.humdrum.org/?file=bitbucket:musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03
// https://bitbucket.org/musedata/beethoven/raw/master/bhl/qrtet/op18no5/stage2/01/03
//

function getBitbucketUrl(file, measures) {
	file = file.replace(/^(bb|bitbucket):/, "");

	var username = "";
	var repository = "";
	var pathandfile = "";
	var url = "";

	url = "https://bitbucket.org/";
	matches = file.match("^\/?([^\/]+)\/([^\/]+)\/(.*)");
	if (matches) {
		username    = matches[1];
		repository  = matches[2];
		pathandfile = matches[3];
	}
	url += username;
	url += "/";
	url += repository;
	url += "/raw/master/";
	url += pathandfile;

	var key = pathandfile;

	return {url: url, key: key};
}



//////////////////////////////
//
// kernScoresUrl -- convert kernscores location into URL.
//

function kernScoresUrl(file, measures) {
	var location;
	var filename;
	var user = "" ;
	var repository = "";
	var matches;
	var jrp = false;
	var github = false;
	var nifc = false;

	if (matches = file.match(/^(j|jrp):\/?\/?(.*)/)) {
		jrp = true;
		file = matches[2];
	} else if (matches = file.match(/^(g|gh|github):\/?\/?([^\/]+)\/([^\/]+)\/(.+)/)) {
		github = true;
		user = matches[2];
		repository = matches[3];
		file = matches[4];
	} else if (matches = file.match(/^nifc:\/?\/?(.*)/i)) {
		nifc = true;
		file = matches[1];
	}

	if (jrp) {
		filename = file;
		location = "";
	} else if (github) {
		filename = file;
	} else if (nifc) {
		filename = file;
	} else {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
	}

	if ((!filename) || !filename.match(/\.[a-z][a-z][a-z]$/)) {
		if (!jrp) {
			loadIndexFile(file);
			return;
		}
	}

	if (filename.match(/^\s*$/)) {
		if (!jrp) {
			loadIndexFile(file);
			return;
		}
	}

	var url;
	if (jrp) {
		url = "https://josquin.stanford.edu/cgi-bin/jrp?id=" + filename;
		url += "&a=humdrum";
	} else if (nifc) {
		url = "https://humdrum.nifc.pl/" + filename;
	} else if (github) {
		url = "https://raw.githubusercontent.com/" + user + "/" + repository + "/master/" + filename;
	} else {
		url = "https://kern.humdrum.org/data?l=" + location + "&file=" + filename;
		url += "&format=info-json";
	}

	var key = "";
	if (!github) {
		key = location + "/" + filename;
		if (measures) {
			url += "&mm=" + measures;
			key += "&mm=" + measures;
		}
	}

	return {url: url, key: key};
}



//////////////////////////////
//
// downloadKernScoresFile --
//

function downloadKernScoresFile(file, measures, page) {
	var location;
	var filename;
	var matches;
	var jrp = false;
	var bitbucket = false;
	var github = false;
	var nifc = false;

	matches = file.match(/^jrp:(.*)/i);
	if (matches) {
		jrp = true;
		file = matches[1];
	} else {
		matches = file.match(/^(?:bitbucket|bb):(.*)/i);
		if (matches) {
			bitbucket = true;
			file = matches[1];
		} else {
			matches = file.match(/^(?:github|gh):(.*)/i);
			if (matches) {
				bitbucket = true;
				file = matches[1];
			} else {
				matches = file.match(/^nifc:(.*)/i);
				if (matches) {
					nifc = true;
					file = matches[1];
				}
			}
		}
	}

	var url;
	if (jrp) {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
		url = "https://josquin.stanford.edu/data?id=" + location;
		url += "&a=humdrum";
	} else if (nifc) {
		file = file.replace(/^\/+/, "");
		url = "https://humdrum.nifc.pl/" + file;
	} else {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
		url = "https://kern.humdrum.org/data?l=" + location + "&file=" + filename;
		if (measures) {
			url += "&mm=" + measures;
		}
	}

	if (filename) {
		SAVEFILENAME = filename;
		console.log("SAVEFILENAME - ", SAVEFILENAME);
	}

	if (bitbucket && url.match(/,/)) {
		downloadMultipleFiles(url);
		return;
	}

	console.log("DATA URL", url);
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			// console.log("DATA", request.responseText);
			//var inputarea = document.querySelector("#input");
			//console.log("Current file:", file);
			//inputarea.value = request.response;

			// https://ace.c9.io/#nav=api&api=editor
			replaceEditorContentWithHumdrumFile(request.response, page);
			if (CGI.k.match(/c/)) {
				CGI.k = CGI.k.replace(/c/, "");
				compileFilters();
			}
		}

	});
	request.send();
}



/////////////////////////////
//
// downloadMultipleFiles -- Currently assumes to be MuseData.
//

function downloadMultipleFiles(url) {
	console.log("DOWNLOADING MULTIPLE FILES", url);
}



///////////////////////////////
//
// loadHmdIndexFile --
//

function loadHmdIndexFile(location) {
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			var INDEX = request.responseText;
			HMDINDEX = new HMDIndex(info.data);
			// console.log("INDEX= ", INDEX);
			$('html').css('cursor', 'auto');
			displayHmdIndexFinally(HMDINDEX, location);
		}
	});
	request.send();
}



///////////////////////////////
//
// loadIndexFile --
//

function loadIndexFile(location) {
	if (location.match(/index.hmd$/)) {
		loadHmdIndexFile(location);
		return;
	}
	var url = "https://kern.humdrum.org/data?l=" + location;
	url += "&format=index";

	console.log("Loading index", url);

	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			var INDEX = request.responseText;
			// console.log("INDEX= ", INDEX);
			$('html').css('cursor', 'auto');
			displayIndexFinally(INDEX, location);
		}
	});
	request.send();
}



//////////////////////////////
//
// displayIndexFinally --
//

function displayIndexFinally(index, location) {
	ShowingIndex = true;

	IndexSupressOfInput = true;
	if (InputVisible == true) {
		UndoHide = true;
		ApplyZoom = true;
		// hideInputArea(true);
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

		final += "<tr><td>"

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
			spantext += location;
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
	var indexelem = document.querySelector("#index");
	indexelem.innerHTML = final;
	indexelem.style.visibility = "visible";
	indexelem.style.display = "block";
}



//////////////////////////////
//
// cleanRepertoryEntryText --
//

function cleanRepertoryEntryText(text) {
	text = text.replace(/-sharp/g, "&sharp;").replace(/-flat/g, "&flat;");
	text = text.replace(/<not>.*?<\/not>/g, "");
	let matches = text.match(/@\{link:([^}]+)\}/);
	if (matches) {
		let link = matches[1];
		let replacement = "";
		if (link.match(/https?:\/\/.*wikipedia/)) {
			replacement += '<a target="_blank" href="' + link + '">';
			replacement += '<span style="float:right; font-size:60%" class="fa-stack fa-1x">\n';
			replacement += '<i class="fas fa-square fa-stack-2x"></i>\n';
			replacement += '<i class="fab fa-wikipedia-w fa-stack-1x fa-inverse"></i>\n';
			replacement += '</span>\n';
			replacement += '</a>\n';
			text = text.replace(/@\{link:[^}]+\}/, replacement);
		}
	}
	return text;
}



//////////////////////////////
//
// displayHmdIndexFinally --
//

function displayHmdIndexFinally(hmdindex, source) {
	if (!hmdindex.parameters.hmdindexurl) {
		hmdindex.parameters.hmdindexurl = source;
	}
	if (hmdindex.parameters.hmdindexurl && !hmdindex.parameters.baseurl) {
		var baseurl = hmdindex.parameters.hmdindexurl.replace(/\/index.hmd$/, "");
		hmdindex.parameters.baseurl = baseurl;
	}
	ShowingIndex = true;

	IndexSupressOfInput = true;
	if (InputVisible == true) {
		UndoHide = true;
		ApplyZoom = true;
		// hideInputArea(true);
	}

	var indexelem = document.querySelector("#index");
	indexelem.innerHTML = hmdindex.generateHTML();;
	indexelem.style.visibility = "visible";
	indexelem.style.display = "block";
}



//////////////////////////////
//
// applyUrlAliases --
//
//

function applyUrlAliases(file) {
	if (!file) {
		return file;
	}
	var matches;

	// Github web interface URL:
	//    https://github.com/josquin-research-project/Ock/blob/master/Ock2002-Ave_Maria.krn
	// Maps to the raw data associated with that page:
	//    https://raw.githubusercontent.com/josquin-research-project/Ock/master/Ock2002-Ave_Maria.krn
	matches = file.match(/https:\/\/github.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)/);
	if (matches) {
		var user = matches[1];
		var repertory = matches[2];
		var commit = matches[3];
		var path = matches[4];
		file = "https://raw.githubusercontent.com/" + user + "/" + repertory + "/";
		file += commit + "/" + path;
	}

	return file;
}



//////////////////////////////
//
// getRequires -- Convert a comma-construct for URL into a list of files to download.
//

function getRequires(url, key) {
	var expire = 172;
	var listing;
	if (!key.match(/,/)) {
		listing = [{
			url: url,
			key: key,
			expire: expire,
			execute: false
		}];
		return listing;
	}

	// Input represents multiple files, such as
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03,04
	// should expand to two files:
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/04

	var urls = commaDuplicate(url);
	var keys = commaDuplicate(key);

	listing = [];
	for (var i=0; i<urls.length; i++) {
		listing.push({
			url: urls[i],
			key: keys[i],
			expire: expire,
			execute: false
		});
	}
	return listing;
}



//////////////////////////////
//
// commaDuplicate --
//

function commaDuplicate(value) {
	var pieces = value.split(/\s*,\s*/);
	var first = pieces[0];
	var matches = first.match(/^(.*\/)([^\/]+)/);
	if (!matches) {
		return value;
	}
	var base = matches[1];
	pieces[0] = matches[2];
	var output = [];
	for (var i=0; i<pieces.length; i++) {
		output.push(base + pieces[i]);
	}
	return output;;
}



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
