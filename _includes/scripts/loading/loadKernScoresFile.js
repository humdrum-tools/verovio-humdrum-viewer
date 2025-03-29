

//////////////////////////////
//
// loadKernScoresFile --
//

function loadKernScoresFile(options, force) {
console.warn("ENTERING LOADKERNSCORESFILE", options);
	// Allow redirect of Github links to raw file:

	if (options.file) {
		let matches = options.file.match(/^https?:\/\/github.com\/(.*?)\/(.*?)\/(?:blob|tree)\/(.*?)\/(.*)$/);
		if (matches) {
			let account = matches[1];
			let repo    = matches[2];
			let branch  = matches[3];
			let rest    = matches[4];
			options.file = `https://raw.githubusercontent.com/${account}/${repo}/${branch}/${rest}`;
		}
	}

	let file = options.file;

	let matches = file.match(/poly\/[RT]?(\d+[^_]*)$/);
	if (matches) {
		file = getPolyFile(matches[1]);
	}

	if (!file) {
		if (options.bb) {
			file = `bitbucket:${options.bb}`;
		} else if (options.bitbucket) {
			file = `bitbucket:${options.bitbucket}`;
		} else if (options.github) {
			file = `github:${options.github}`;
		} else if (options.gh) {
			file = `github:${options.gh}`;
		} else if (options.jrp) {
			file = `jrp:${options.jrp}`;
		} else if (options.poly) {
			file = getPolyFile(options.poly);
		} else if (options.tasso) {
			file = `tasso:${options.tasso}`;
		}
	}
	if (!file) {
		console.warn("No file to load in loadKernScoresFile");
		return;
	}

	let measures    = options.measures;
	let page        = options.page;
	let getnext     = options.next;
	let getprevious = options.previous;

console.warn("GOT HERE MMM");
	file = applyUrlAliases(file);
console.warn("GOT HERE NNN");

	if (measures) {
		let getnext     = false;
		let getprevious = false;
	}

	COUNTER++;
	if (COUNTER > 10000) {
		console.log("RECURSION TOO LARGE", file);
		return;
	}

	let url = "";
	let key = "";
	let ret;

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
		ret = kernScoresUrl(file, measures, options);
		if (ret) {
			url = ret.url;
			key = ret.url;
		}
	}

	if (!key) {
		key = "DATA";
		// return;
	}

	let requires = getRequires(url, key);

	let keys = commaDuplicate(key);

	if (force) {
		for (let i=0; i<keys.length; i++) {
			basketSession.remove(key[i]);
			console.log("removed ", key[i]);
		}
	}

	redrawInputArea();

	let expire = 142;

	let jinfo;

	let info = basketSession.get(keys[0]);
	// let info = null;
	// console.log("INFO", info)

	if (options && options.file && (options.file.match(/musedata/))) {
		// console.log("Going to download3", key);
		basketSession.require(...requires).then(function() {
			let infos = [];
			for (let j=0; j<keys.length; j++) {
				infos[j] = basketSession.get(keys[j]);
			}
			let data = "";
			let filenames = commaDuplicate(key);
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
					let oinfo = infos[j];
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
								let textdata = atob(jinfo.content);
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
							processInfo(jinfo, options, false, false);
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
		console.log("Going to download2 KEY=", key, "URL=", url);

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
					displayHmdIndexFinally(HMDINDEX, url, options);
				} else {
					try {
						jinfo = JSON.parse(info.data);
						if (force) {
							// let textdata = atob(jinfo.content);
							let textdata = Base64.decode(jinfo.content);
							if (textdata.match(/^\s*$/)) {
								textdata = "!!!ONB: No data content\n";
							}
							// displayScoreTextInEditor(atob(jinfo.content), vrvWorker.page);
							displayScoreTextInEditor(Base64.decode(jinfo.content), vrvWorker.page);
						}
						if (getnext) {
							processInfo(jinfo, options, false, false);
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
				processInfo(jinfo, options, false, false);
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
// getPolyFile -- return RDS polyrhythm project file based on example number
//

function getPolyFile(polyid) {

	let polymap = {};
	polymap["R129"]  = "R129_Jan-w30p11m124-127.krn";
	polymap["R130"]  = "R130_Jan-w33p13m63-71.krn";
	polymap["R131"]  = "R131_Jan-w43p6m1-4.krn";
	polymap["R144"]  = "R144_Jan-w47p5h4m1-4.krn";
	polymap["R161"]  = "R161_Deb-w13p34m25-26.krn";
	polymap["R180"]  = "R180_Deb-w40p21h15m5-7.krn";
	polymap["R183"]  = "R183_Deb-w16p69h21m7-9.krn";
	polymap["R187"]  = "R187_Deb-w42p9s3-4.krn";
	polymap["R187x"] = "R187x_Deb-w42p9s3-4.krn";
	polymap["R198"]  = "R198_Sch-w9p42m4-1h40m1-2.krn";
	polymap["R215"]  = "R215_Sch-w33p85m523-528.krn";
	polymap["R218"]  = "R218_Sch-w33p200m252-256.krn";
	polymap["R222"]  = "R222_Sch-w35p20m73-75.krn";
	polymap["R237B"] = "R237B_Ive-w31p9hEm2-3.krn";
	polymap["R255"]  = "R255_Ive-w35p12m19-24.krn";
	polymap["R258"]  = "R258_Ive-w30p9m55-57.krn";
	polymap["R262"]  = "R262_Ive-w33b4p26.krn";
	polymap["R262x"] = "R262x_Ive-w33b4p26.krn";
	polymap["R279"]  = "R279_Rav-w15p1m4-5.krn";
	polymap["R281"]  = "R281_Rav-w21p2m8-9.krn";
	polymap["R295"]  = "R295_Rav-w23p20h22m1-4.krn";
	polymap["R299"]  = "R299_Rav-w32p1-2m1-12.krn";
	polymap["R308B"] = "R308B_Fal-w6p111h10m1-7.krn";
	polymap["R310"]  = "R310_Fal-w3p15m1-8.krn";
	polymap["R315"]  = "R315_Fal-w8p62h67m1-5.krn";
	polymap["R319"]  = "R319_Fal-w6p178-179h44m1-5.krn";
	polymap["R322A"] = "R322A_Bar-w3p70m1-4.krn";
	polymap["R324"]  = "R324_Bar-w14p6m3-10.krn";
	polymap["R322"]  = "R332_Bar-w24p53m5-3h21.krn";
	polymap["R350"]  = "R350_Bar-w30p4m22-30.krn";
	polymap["R371"]  = "R371_Str-w15p19m2-1h1m1-5.krn";
	polymap["R389"]  = "R389_Str-w32p8s1-2.krn";
	polymap["R392"]  = "R392_Str-w33p52-54h74m1-h80m1.krn";
	polymap["R396"]  = "R396_Str-w47p8m1h8-h10m1.krn";
	polymap["R408"]  = "R408_Web-w13p1-2m1-12.krn";
	polymap["R409"]  = "R409_Web-w3p7m46-49.krn";
	polymap["R411"]  = "R411_Web-w28p4m33-35.krn";
	polymap["R415"]  = "R415_Web-w28p2-3m11-19.krn";
	polymap["R420"]  = "R420_Var-w8p23h7m10-14.krn";
	polymap["R426"]  = "R426_Var-w4p17h1m5-10.krn";
	polymap["R428"]  = "R428_Var-w1p12-13h5m9-12.krn";
	polymap["R432"]  = "R432_Var-w4p18-19h2m1-9.krn";
	polymap["R441"]  = "R441_Ber-w10p81m376-377.krn";
	polymap["R443"]  = "R443_Ber-w10p321m593-595.krn";
	polymap["R453"]  = "R453_Ber-w15p362-363m118-121.krn";
	polymap["R456B"] = "R456B_Ber-w15p474-475m553-557.krn";
	polymap["R485"]  = "R485_Mau-w85p12m57-60.krn";
	polymap["R488"]  = "R488_Mau-w56p9m35-37.krn";
	polymap["R492"]  = "R492_Mau-w24p19m99-104.krn";
	polymap["R525"]  = "R525_Mau-w94p35h19m5-8.krn";
	polymap["R1534"] = "R534_Mai-w6p2m1-5.krn";
	polymap["R534x"] = "R534x_Mai-w6p1-2m1-12.krn";
	polymap["R536"]  = "R536_Mai-w8p11m32-41.krn";
	polymap["R537"]  = "R537_Mai-w9p50m1-6.krn";
	polymap["R560"]  = "R560_Mai-w29p25m10-14.krn";
	polymap["R572"]  = "R572_Pro-w32p63h48m7.krn";
	polymap["R573"]  = "R573_Pro-w36p38m293-295.krn";
	polymap["R574"]  = "R574_Pro-w41p21m74-77.krn";
	polymap["R582"]  = "R582_Pro-w35p25s1-3.krn";
	polymap["R584"]  = "R584_Hon-w4p5h6m1-3.krn";
	polymap["R588"]  = "R588_Hon-w18p7-8m51-66.krn";
	polymap["R599"]  = "R599_Hon-w38p60h5m8-20.krn";
	polymap["R602"]  = "R602_Hon-w20p7h3m1-5.krn";
	polymap["R616"]  = "R616_Hin-w6p9m114-117.krn";
	polymap["R630"]  = "R630_Hin-w22p74-75hDm4-9.krn";
	polymap["R655"]  = "R655_Hin-w77p19m154-160.krn";
	polymap["R678"]  = "R678_Hin-w90p19m143-147.krn";
	polymap["R686"]  = "R686_Ger-w3p12h9m1-5.krn";
	polymap["R686x"] = "R686x_Ger-w3v2p12h9m1-5.krn";
	polymap["R687"]  = "R687_Ger-w6p24h19m1-3.krn";
	polymap["R688"]  = "R688_Ger-w3p19h14m1-3.krn";
	polymap["R689"]  = "R689_Ger-w12p59m29-34.krn";
	polymap["R700"]  = "R700_Cop-w2p64h38m3-10.krn";
	polymap["R701"]  = "R701_Cop-w1v2p8m1-h2m2.krn";
	polymap["R714"]  = "R714_Cop-w32p117-118m110-112.krn";
	polymap["R724"]  = "R724_Cop-w42p64h66m1-7.krn";
	polymap["R730"]  = "R730_Mes-w16b1p8m26-27.krn";
	polymap["R731"]  = "R731_Mes-w16b3p9m24-28.krn";
	polymap["R744"]  = "R744_Mes-w19p135h2m13-14.krn";
	polymap["R770"]  = "R770_Mes-w22p273h7m3-6.krn";
	polymap["R798"]  = "R798_Bri-w42p12m41.krn";
	polymap["R799"]  = "R799_Bri-w22p62m286-289.krn";
	polymap["R809"]  = "R809_Bri-w28p5m22-30.krn";
	polymap["R812"]  = "R812_Bri-w33p39h19m2-13.krn";

	polyid += "";
	if (!polyid.match(/^R/)) {
		polyid = "R" + polyid;
		polyid = polyid.replace(/_.*/, "");
	}

	let file = polymap[polyid];

	if (file) {
		return `poly/${file}`;
	} else {
		return `poly`;
	}
}



