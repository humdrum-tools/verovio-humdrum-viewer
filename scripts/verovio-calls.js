// vim: ts=3

function verovioCalls() {
	this.page = 1;
	this.pageCount = 0;


	////////////////////////////
	//
	// verovioCalls.validate --
	//

	this.validate = function (data) {
console.log("GOT HERE VALIDATE");
		if (data.charAt(0) == "<") {
			return true;
		}
		var error = false,
		hum = data.split("\n").map(function (l) { return l.split("\t") });
		validateHumdrum_Process(hum, function () {
			//break on error
			error = true;
			return false;
		}, function () {
			//continue on warning
			return true;
		});
		if (error) {
			throw("Invalid humdrum data detected."); //  + data);
		}
	};



	////////////////////////////
	//
	// verovioCalls.filterData -- Used to convert from one data type to another.
	//

	this.filterData = function (opts, data, type) {
console.log("GOT HERE FILTERDATA");
		var newdata;
		var checkdata = true;
		if (type !== "humdrum") {
			checkdata = false;
		}
		if (opts.inputFormat === "musicxml") {
			checkdata = false;
		}
		if (opts.inputFormat === "mei") {
			checkdata = false;
		}
		if (opts.inputFormat === "musicxml-hum") {
			checkdata = false;
		}
		if ((opts.inputFormat === "auto") && (type === "humdrum")) {
			checkdata = true;
		}
		if (checkdata) {
			this.validate(data);
		}

		this.vrvToolkit.setOptions(opts);
		this.vrvToolkit.loadData(data);
		this.pageCount = this.vrvToolkit.getPageCount();
		switch (type) {
			case "humdrum":
				newdata = this.vrvToolkit.getHumdrum();
				break;
			case "mei":
				newdata = this.vrvToolkit.getMEI(0, 1);
				break;
		};
		return newdata;
	};



	//////////////////////////////
	//
	// verovioCalls.displayNotation --
	//

	this.displayNotation = function (opts, data, page, force) {
console.log("GOT HERE GGGGG");
		if (!force) this.validate(data);
		page = page || this.page;
console.log("INITIAL OPTIONS", opts);
		cleanopts = cleanOptions(data, opts);
console.log("NEW OPTIONS", cleanopts);
		this.vrvToolkit.setOptions(cleanopts);
		this.vrvToolkit.loadData(data);
		this.pageCount = this.vrvToolkit.getPageCount();
		if (this.pageCount === 0) {
			throw (this.vrvToolkit.getLog());
		} else {
			var svg;
			if (page) {
				if (page > this.pageCount) {
					page = 1;
					this.page = 1;
				}
				svg = this.vrvToolkit.renderToSVG(page, {});
			} else {
				svg = this.vrvToolkit.renderData(data, cleanopts);
			};
			this.page = page;
			return svg;
		};
	};



	////////////////////////////
	//
	// verovioCalls.redoLayout --
	//

	this.redoLayout = function (opts, redo, measure) {
			if (redo) {
				this.vrvToolkit.setOptions(opts);
				this.vrvToolkit.redoLayout();
				this.pageCount = this.vrvToolkit.getPageCount();
			};
			this.page = 1;
			if (measure !== 0) {
				this.page = this.vrvToolkit.getPageWithElement(measure);
			};
			return this.page;
	};



	////////////////////////////
	//
	// verovioCalls.renderPage --
	//

	this.renderPage = function (page) {
		var svg = this.vrvToolkit.renderToSVG(page, {});
		return svg;
	};



	////////////////////////////
	//
	// verovioCalls.renderAllPages -- Render all pages.
	//    This is used for generatePdfFull().
	//

	this.renderAllPages = function (data, opts) {
console.log("GOT HERE RENDERALLPAGE");
		var svglist = [];
		if (!opts) {
			opts = {};
		}

		data = data += "\n!!!verovio-parameter-group: pdf\n";
		cleanopts = cleanOptions(data, opts);

		svglist.push(this.displayNotation(cleanopts, data));
		for (var i = 2; i <= this.pageCount; i++) {
			svglist.push(this.renderPage(i));
		}

		return svglist;
	};



	////////////////////////////
	//
	// verovioCalls.gotoPage --
	//

	this.gotoPage = function (page) {
console.log("GOT HERE GOTOPAGE");
		page = page || this.pageCount;
		if (page < 1) {
			page = this.pageCount;
		} else if (page > this.pageCount) {
			page = 1;
		};
		this.page = page;
		return {
			page: page,
			pageCount: this.pageCount
		}
	};



	////////////////////////////
	//
	// verovioCalls.getMEI --
	//

	this.getMEI = function () {
console.log("GOT HERE GETMEI");
		var meidata = this.vrvToolkit.getMEI(0, 1);
		return meidata;
	};



	////////////////////////////
	//
	// verovioCalls.renderToMidi --
	//

	this.renderToMidi = function () {
console.log("GOT HERE RENDERTOMIDI");
		var midi64 = this.vrvToolkit.renderToMIDI();
		return midi64;
	};



	////////////////////////////
	//
	// verovioCalls.getElementsAtTime --
	//

	this.getElementsAtTime = function (vrvTime) {
console.log("GOT HERE ELEMENTSATTIME");
		var elements = this.vrvToolkit.getElementsAtTime(vrvTime);
		return elements;
	};



	////////////////////////////
	//
	// verovioCalls.getTimeForElement --
	//

	this.getTimeForElement = function (id) {
console.log("GOT HERE TIMEFORELEMENT");
		var time = this.vrvToolkit.getTimeForElement(id);
		return time;
	};


	//////////////////////////////
	//
	// cleanOptions -- Remove options that will be processed interally from the data.
	//

	function cleanOptions(content, options) {
console.log("GOT HERE  YYY");
		var lines = content.match(/[^\r\n]+/g);
		var output = options;
		var setlist = [""];
		var optionsets = {};
		optionsets[""] = {};
		var i;

		for (i=0; i<lines.length; i++) {
			var matches = lines[i].match(/^!!!verovio([^\s]*):\s*(.*)\s*$/);
			if (!matches) {
				continue;
			}
			if (matches[1] == "-parameter-group") {
				setlist.push(matches[2]);
				continue;
			}
			var mm = matches[2].match(/^\s*([^\s]+)\s+(.*)\s*$/);
			if (!mm) {
				continue;
			}
			var m = matches[1].match(/^-([^\s]+)\s*$/);
			var set = "";
			if (m) {
				set = m[1];
			}
			if (typeof optionsets[set] === 'undefined') {
				optionsets[set] = {};
			}
			optionsets[set][mm[1]] = mm[2];
		}

		for (i=0; i<setlist.length; i++) {
			if (!optionsets[setlist[i]]) {
				continue;
			}
			var keys = Object.keys(optionsets[setlist[i]]);
			var j;
			var key;
			for (j=0; j<keys.length; j++) {
				if (typeof output[keys[j]] !== 'undefined') {
					delete output[keys[j]];
				}
			}
		}

		return output;
		}


};



