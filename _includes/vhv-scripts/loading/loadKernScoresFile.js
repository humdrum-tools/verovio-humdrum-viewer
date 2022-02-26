

//////////////////////////////
//
// loadKernScoresFile --
//

function loadKernScoresFile(obj, force) {
	var file = obj.file;
	if (!file) {
		if (obj.bb) {
			file = `bitbucket:${obj.bb}`;
		} else if (obj.bitbucket) {
			file = `bitbucket:${obj.bitbucket}`;
		} else if (obj.github) {
			file = `github:${obj.github}`;
		} else if (obj.gh) {
			file = `github:${obj.gh}`;
		} else if (obj.jrp) {
			file = `jrp:${obj.jrp}`;
		} else if (obj.tasso) {
			file = `tasso:${obj.tasso}`;
		}
	}
	if (!file) {
		console.warn("No file to load in loadKernScoresFile");
		return;
	}

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
	} else if (file.match(/^gh:/)) {
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
			if (infos.length > 1) {
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
			} else if (infos.length == 1) {
				data = infos[0].data;
			}
			displayScoreTextInEditor(data, vrvWorker.page);

			if (infos.length > 1) {
				// console.log("GOING TO ADD MULTIPLE FILES TO EDITOR", infos);
			} else if (infos.length == 1) {
/*
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
*/
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

