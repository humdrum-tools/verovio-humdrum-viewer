// vim: ts=3

function verovioCalls() {
	this.page = 1;
	this.pageCount = 0;
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
			throw("Invalid humdrum data detected:", data);
		}
	};

	this.filterData = function (options, data, type) {
		var newdata;
		var checkdata = true;
		if (type !== "humdrum") {
			checkdata = false;
		}
		if (options.inputFormat === "musicxml") {
			checkdata = false;
		}
		if (options.inputFormat === "mei") {
			checkdata = false;
		}
		if (options.inputFormat === "musicxml-hum") {
			checkdata = false;
		}
		if ((options.inputFormat === "auto") && (type === "humdrum")) {
			checkdata = true;
		}
		if (checkdata) {
			this.validate(data);
		}

		this.vrvToolkit.setOptions(options);
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

	this.displayNotation = function (options, data, page, force) {
		if (!force) this.validate(data);
		page = page || this.page;
		this.vrvToolkit.setOptions(options);
		this.vrvToolkit.loadData(data);
		this.pageCount = this.vrvToolkit.getPageCount();
		if (this.pageCount === 0) {
			throw (this.vrvToolkit.getLog());
		} else {
			var svg;
			if (page) {
				svg = this.vrvToolkit.renderPage(page, {});
			} else {
				svg = this.vrvToolkit.renderData(data, options);
			};
			this.page = page;
			return svg;
		};
	};

	this.redoLayout = function (options, redo, measure) {
			if (redo) {
				this.vrvToolkit.setOptions(options);
				this.vrvToolkit.redoLayout();
				this.pageCount = this.vrvToolkit.getPageCount();
			};
			this.page = 1;
			if (measure !== 0) {
				this.page = this.vrvToolkit.getPageWithElement(measure);
			};
			return this.page;
	};

	this.renderPage = function (page) {
		var svg = this.vrvToolkit.renderPage(page, {});
		return svg;
	};

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

	this.getMEI = function () {
		var meidata = this.vrvToolkit.getMEI(0, 1);
		return meidata;
	};

	this.renderToMidi = function () {
		var midi64 = this.vrvToolkit.renderToMidi();
		return midi64;
	};

	this.getElementsAtTime = function (vrvTime) {
		var elements = this.vrvToolkit.getElementsAtTime(vrvTime);
		return elements;
	};

	this.getTimeForElement = function (id) {
		var time = this.vrvToolkit.getTimeForElement(id);
		return time;
	}
};



