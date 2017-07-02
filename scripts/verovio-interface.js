---
vim: ts=3
---

//////////////////////////////
//
// vrvInterface --
//

function vrvInterface(use_worker, onReady) {
	this.WIDTH = 0;
	this.HEIGHT = 0;
	this.page = 1;

	this.initialized = false;
	this.usingWorker = use_worker;

	if (use_worker) {
		this.createWorkerInterface(onReady);
	} else {
		this.createDefaultInterface(onReady);
	};
};



//////////////////////////////
//
// createWorkerInterface --
//

vrvInterface.prototype.createWorkerInterface = function (onReady) {
	var vrv = this;

	function handleEvent(oEvent) {
		switch(oEvent.data.method) {
			case "ready":
				vrv.initialized = true;
				onReady();
				break;
			default:
				while (vrv.resolvedIdx <= oEvent.data.idx) {
					//resolve or reject
					if (vrv.resolvedIdx === oEvent.data.idx) {
						if (oEvent.data.success) {
							vrv.promises[vrv.resolvedIdx].deferred.resolve(oEvent.data.result);
						} else {
						vrv.promises[vrv.resolvedIdx].deferred.reject(oEvent.data.result);
						};
					} else {
						vrv.promises[vrv.resolvedIdx].deferred.reject();
					};
					if (vrv.promises[vrv.resolvedIdx].method === "displayNotation") {
						vrv.displayNotationPending--;
						if (vrv.displayNotationPending === 0) vrv.handleWaitingDisplayNotation();
					};
					delete vrv.promises[vrv.resolvedIdx];
					vrv.resolvedIdx++;
				};
		};
	};

	console.log("creating worker interface");
	this.promises = {};
	this.promiseIdx = 0;
	this.resolvedIdx = 0;
	this.displayNotationPending = 0;
	this.displayNotationWaiting = null;

	this.worker = new Worker("scripts/verovio-worker.js");
	this.worker.addEventListener("message", handleEvent);
};



//////////////////////////////
//
// createDefaultInterface --
//

vrvInterface.prototype.createDefaultInterface = function (onReady) {

{% if site.local == "yes" %}
	var url = '/scripts/local/verovio-toolkit.js';
{% else %}
	var url = 'http://verovio-script.humdrum.org/scripts/verovio-toolkit.js';
{% endif %}

	console.log("create default interface")
	var vrv = this;
	this.verovio = new verovioCalls();

	basket
	.require(
		{url: url, expire: 500, unique: BasketVersion},
		{url: "scripts/ace/humdrumValidator.js", skipCache: true}
	)
	.then(
		function () {
			vrv.verovio.vrvToolkit = new verovio.toolkit();
			vrv.initialized = true;
			onReady();
		},
		function () {
			console.log("There was an error loading script", url);
		}
	);
};



//////////////////////////////
//
// checkInitialized --
//

vrvInterface.prototype.checkInitialized = function () {
	if (!this.initialized) throw("Verovio toolkit not (yet) initialized");
};



//////////////////////////////
//
// filterData --
//

vrvInterface.prototype.filterData = function (options, data, type) {
	return this.execute("filterData", arguments);
};



//////////////////////////////
//
// displayNontation --
//

vrvInterface.prototype.displayNotation = function (options, data, page) {
	return this.execute("displayNotation", arguments);
};



//////////////////////////////
//
// redoLayout --
//

vrvInterface.prototype.redoLayout = function (options, redo, measure) {
	return this.execute("redoLayout", arguments);
};



//////////////////////////////
//
// renderPage --
//

vrvInterface.prototype.renderPage = function (page) {
	return this.execute("renderPage", arguments);
};



//////////////////////////////
//
// gotoPage --
//

vrvInterface.prototype.gotoPage = function (page) {
	var vrv = this;
	return this.execute("gotoPage", arguments)
	.then(function (page) {
		vrv.page = page;
		return page;
	});
};



//////////////////////////////
//
// getMEI --
//

vrvInterface.prototype.getMEI = function (page) {
	return this.execute("getMEI", arguments);
};



//////////////////////////////
//
// renderToMidi --
//

vrvInterface.prototype.renderToMidi = function () {
	return this.execute("renderToMidi", arguments);
};



//////////////////////////////
//
// getElementsAtTime --
//

vrvInterface.prototype.getElementsAtTime = function (vrvTime) {
	return this.execute("getElementsAtTime", arguments);
};



//////////////////////////////
//
// getTimeForElement --
//

vrvInterface.prototype.getTimeForElement = function (id) {
	return this.execute("getTimeForElement", arguments);
};



//////////////////////////////
//
// execute --
//

vrvInterface.prototype.execute = function (method, args) {
	var vrv = this;
	if (this.usingWorker) {
		var arr = Array.prototype.slice.call(args);
		switch(method) {
			case "displayNotation":
				return vrv.postDisplayNotation(method, arr);
			default:
				vrv.handleWaitingDisplayNotation();
				return vrv.post(method, arr);
		};
	} else {
		return new RSVP.Promise(function (resolve, reject) {
			try {
				vrv.checkInitialized();
				resolve(vrv.verovio[method].apply(vrv.verovio, args));
			} catch(err) {
				reject(err);
			};
		});
	};
};



//////////////////////////////
//
// handleWaitingDisplayNotation --
//

vrvInterface.prototype.handleWaitingDisplayNotation = function () {
	if (this.displayNotationWaiting) {
		this.postDeferredMessage("displayNotation",
				this.displayNotationWaiting.args,
				this.displayNotationWaiting.deferred);
		this.displayNotationWaiting = null;
		this.displayNotationPending++;
	};
};



//////////////////////////////
//
// postDisplayNotation --
//

vrvInterface.prototype.postDisplayNotation = function (method, args) {
	if (this.displayNotationPending > 0) {

		if (!this.displayNotationWaiting) {
			this.displayNotationWaiting = {
				deferred: new RSVP.defer(),
			};
		};
		this.displayNotationWaiting.args = args;
		return this.displayNotationWaiting.deferred.promise;
	} else {
		this.displayNotationPending++;
		this.displayNotationWaiting = null;
		return this.post(method, args);
	};
};



//////////////////////////////
//
// post --
//

vrvInterface.prototype.post = function (method, args) {
	return this.postDeferredMessage(method, args, new RSVP.defer());
};



//////////////////////////////
//
// postDeferredMessage --
//

vrvInterface.prototype.postDeferredMessage = function (method, args, deferred) {
	this.worker.postMessage({
		idx: this.promiseIdx,
		method: method,
		args: args
	});
	this.promises[this.promiseIdx] = {
		method: method,
		deferred: deferred
	};
	this.promiseIdx++;
	return deferred.promise;
};


