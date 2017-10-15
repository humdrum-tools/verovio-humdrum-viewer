// vim: ts=3

function verovioCalls() {
	this.page = 1;
	this.pageCount = 0;


	////////////////////////////
	//
	// verovioCalls.validate --
	//

	this.validate = function (data) {
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
		if (!force) this.validate(data);
		page = page || this.page;
		this.vrvToolkit.setOptions(opts);
		this.vrvToolkit.loadData(data);
		this.pageCount = this.vrvToolkit.getPageCount();
		if (this.pageCount === 0) {
			throw (this.vrvToolkit.getLog());
		} else {
			var svg;
			if (page) {
				svg = this.vrvToolkit.renderPage(page, {});
			} else {
				svg = this.vrvToolkit.renderData(data, opts);
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
		var svg = this.vrvToolkit.renderPage(page, {});
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

		svglist.push(this.displayNotation(opts, data));
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
		return page;
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
		var midi64 = this.vrvToolkit.renderToMidi();
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


};



