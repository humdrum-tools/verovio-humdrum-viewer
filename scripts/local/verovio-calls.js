
function verovioCalls() {
	this.page = 1;
	this.pageCount = 0;
	this.humdrumOutput = "";


	////////////////////////////
	//
	// verovioCalls.validate --
	//

	this.validate = function (data) {
		if (data.charAt(0) == "<") {
			return true;
		}
		var error = false,
		// [20190613: Allow multiple tabs between spine fields]
		// [20200914: Allow Windows newlines]
		hum = data.split(/\r\n|\n|\r/).map(function (l) { return l.split(/\t+/) });
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
		var newdata;
		var checkdata = true;
		if (type !== "humdrum") {
			checkdata = false;
		}
		if (opts.from === "musicxml") {
			checkdata = false;
		}
		if (opts.from === "mei") {
			checkdata = false;
		}
		if (opts.from === "musicxml-hum") {
			checkdata = false;
		}
		if ((opts.from === "auto") && (type === "humdrum")) {
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
	// verovioCalls.renderData --
	//

	this.renderData = function (opts, data, page, force) {
		if (!force) this.validate(data);
		page = page || this.page;
		if (page == 0) {
			page = 1;
		}
		cleanopts = cleanOptions(data, opts);
		this.vrvToolkit.setOptions(cleanopts);
		this.vrvToolkit.loadData(data);
		this.pageCount = this.vrvToolkit.getPageCount();
		if (this.pageCount === 0) {
			throw ("PAGE COUNT IS ZERO:", this.vrvToolkit.getLog());
		} else {
			let svg;
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
			this.humdrumOutput = "";
			if (data.match(/^\s*[!*]/)) {
				// Only store Humdrum data if input data is Humdrum data.
				// This is used to extract intermediate filtered Humdrum
				// data before it was converted to MEI data.  This function
				// should not be called if input is MEI data (and probably
				// not MusicXML data either).
				this.humdrumOutput = this.vrvToolkit.getHumdrum();
			}
			return svg;
		};
	};



	///////////////////////////
	//
	// verovioCalls.getHumdrum -- Return processed Humdrum data from last call to
	//     renderData.
	//

	this.getHumdrum = function() {
		return this.humdrumOutput;
	}



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
		var svglist = [];
		if (!opts) {
			opts = {};
		}

		data = data += "\n!!!verovio-parameter-group: pdf\n";
		cleanopts = cleanOptions(data, opts);

		svglist.push(this.renderData(cleanopts, data));
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
		var meidata = this.vrvToolkit.getMEI(0, 1);
		return meidata;
	};



	////////////////////////////
	//
	// verovioCalls.renderToMidi --
	//

	this.renderToMidi = function () {
		var midi64 = this.vrvToolkit.renderToMIDI();
		return midi64;
	};



	////////////////////////////
	//
	// verovioCalls.getElementsAtTime --
	//

	this.getElementsAtTime = function (vrvTime) {
		var elements = this.vrvToolkit.getElementsAtTime(vrvTime);
		return elements;
	};



	////////////////////////////
	//
	// verovioCalls.getTimeForElement --
	//

	this.getTimeForElement = function (id) {
		var time = this.vrvToolkit.getTimeForElement(id);
		return time;
	};


	//////////////////////////////
	//
	// cleanOptions -- Remove options that will be processed interally from the data.
	//

	function cleanOptions(content, options) {
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



