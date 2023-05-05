//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec  2 08:11:05 EST 2018
// Last Modified: Sun Dec 23 01:58:26 EST 2018
// Filename:      humdrum-notation-plugin.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
//	This script sets up an editiable humdrum text region
//	on a webpage plus a dynamcially calculated SVG image
//	generated from the humdrum text using verovio.
//
//	Input parameters for plugin styling:
//		tabsize:            default none (browser default)
//		humdrumMinHeight: the minimum height of the humdrum text box
//		humdrumMaxWidth:  the maximum width of the humdrum text box
//		humdrumMinWidth:  the maximum width of the humdrum text box
//		humdrumVisible:    "false" will hide the humdrum text.
//		callback:           callback when notation changes
//
//	Parameters for verovio:
//	http://www.verovio.org/command-line.xhtml
//
//		adjustPageHeight default 1
//		border           default 50
//		evenNoteSpacing  default 0
//		font             default "Leipzig"
//		inputFrom        default "auto"
//		# page           default 1
//		# header         default 0
//		# footer         default 0
//		pageHeight       default 60000
//		pageWidth        default 1350
//		scale            default 40
//		spacingLinear    default 0.25
//		spacingNonLinear default 0.6
//		spacingStaff     default 12
//		spacingSystem    default 12
//

//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/global.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
// This file contains global functions for the Humdrum notation plugin.
//



//////////////////////////////
//
// DOMContentLoaded event listener --
//

document.addEventListener("DOMContentLoaded", function() {
	downloadVerovioToolkit("true");
});



//////////////////////////////
//
// downloadVerovioToolkit --
//

function downloadVerovioToolkit(use_worker) {
   vrvWorker = new vrvInterface(use_worker, callbackAfterInitialized);
};

function callbackAfterInitialized() {
	console.log("Initialized verovio worker");
	HNP.ready = 1;
	HNP.displayWaiting();
}




//////////////////////////////
//
// setErrorScore --
//

function setErrorScore(baseid) {
	document.addEventListener("DOMContentLoaded", function() {
		HNP.setErrorScore(baseid);
	});
}



//////////////////////////////
//
// setHumdrumOption --
//

function setHumdrumOption(baseid, key, value) {
	if (typeof baseid  !== "string" && !(baseid instanceof String)) {
		console.log("Error: ID must be a string, but is", baseid, "which is a", typeof baseid);
		return;
	}
	if (typeof key  !== "string" && !(key instanceof String)) {
		console.log("Error: property must be a string, but is", key, "which is a", typeof baseid);
		return;
	}
	let entry = HNP.entries[baseid];
	if (!entry) {
		console.log("Error: ID does not reference a Humdrum notation script:", baseid);
		return;
	}
	if (!entry.options) {
		console.log("Error: entry", baseid, "does not have any options to change.");
		return;
	}
	entry.options[key] = value;
}



//////////////////////////////
//
// getHumdrumOption --
//

function getHumdrumOption(baseid, key) {
	if (typeof baseid  !== "string" && !(baseid instanceof String)) {
		console.log("Error: ID must be a string, but is", baseid, "which is a", typeof baseid);
		return;
	}
	if (typeof key  !== "string" && !(key instanceof String)) {
		console.log("Error: property must be a string, but is", key, "which is a", typeof baseid);
		return;
	}
	let entry = HNP.entries[baseid];
	if (!entry) {
		console.log("Error: ID does not reference a Humdrum notation script:", baseid);
		return;
	}
	if (!entry.options) {
		console.log("Error: entry", baseid, "does not have any options to change.");
		return;
	}
	return entry.options[key];
}



//////////////////////////////
//
// displayHumdrum -- Main externally usable function which sets up
//   a Humdrum notation display on a webpage (if it does not exist), and then
//   creates an SVG image for the notation.
//

function displayHumdrum(opts) {
	
	if (HNP.ready) {
	
     	HNP.displayHumdrumNow(opts);
	} else {
		// Wait until the page has finished loading resources.
		HNP.waiting.push(opts);
		// document.addEventListener("DOMContentLoaded", function() {
		// 	HNP.displayHumdrumNow(opts);
		// });
	}
}





///////////////////////////////
//
// downloadHumdrumUrlData -- Download Humdrum data from a URL and then convert
//     the data into an SVG.
//

function downloadHumdrumUrlData(source, opts) {
	if (!source) {
		return;
	}
	if (!opts.processedUrl) {
		return;
	}
	if (opts.processedUrl.match(/^\s*$/)) {
		return;
	}
	let url = opts.processedUrl;
	let fallback = opts.urlFallback;
	let request = new XMLHttpRequest();

	request.addEventListener("load", function() {
		source.textContent = this.responseText;
		HNP.displayHumdrumNow(opts);
	});
	request.addEventListener("error", function() {
		downloadFallback(source, opts, fallback);
	});
	request.addEventListener("loadstart", function() {
		// display a busy cursor
		document.body.style.cursor = "wait !important";
	});
	request.addEventListener("loadend", function() {
		// display a normal cursor
		document.body.style.cursor = "auto";
	});
	request.open("GET", url);
	request.send();

}



//////////////////////////////
//
// downloadFallback -- Load alternate URL for data. Use embedded data if there is a problem.
//

function downloadFallback(source, opts, url) {
	if (!url) {
		HNP.displayHumdrumNow(opts);
	}

	let request = new XMLHttpRequest();
	request.onload = function() {
		if (this.status == 200) {
			source.textContent = this.responseText;
			HNP.displayHumdrumNow(opts);
		} else {
			HNP.displayHumdrumNow(opts);
		}
	};
	request.onerror = function() {
		HNP.displayHumdrumNow(opts);
	};
	request.open("GET", url);
	request.send();
}



//////////////////////////////
//
// checkParentResize --
//    Note that Safari does not allow shrinking of original element sizes, only 
//    expanding: https://css-tricks.com/almanac/properties/r/resize
//

function checkParentResize(baseid) {
	let entry = HNP.entries[baseid];
	if (!entry) {
		console.log("Error: cannot find data for ID", baseid);
		return;
	}
	let container = entry.container;
	if (!container) {
		console.log("Error: cannot find container for ID", baseid);
		return;
	}
	let pluginOptions = entry.options;
	if (!pluginOptions) {
		console.log("Error: cannot find options for ID", baseid);
		return;
	}
	let scale = pluginOptions.scale;
	let previousWidth = parseInt(pluginOptions._currentPageWidth * scale / 100.0);
	let style = window.getComputedStyle(container, null);
	let currentWidth = parseInt(style.getPropertyValue("width"));
	if (currentWidth == previousWidth) {
		// nothing to do
		return;
	}
	if (Math.abs(currentWidth - previousWidth) < 3)  {
		// Safari required hysteresis
		return;
	}
	// console.log("UPDATING NOTATION DUE TO PARENT RESIZE FOR", baseid);
	// console.log("OLDWIDTH", previousWidth, "NEWWIDTH", currentWidth);
	if (!HNP.MUTEX) {
		// This code is used to stagger redrawing of the updated examples
		// so that they do not all draw at the same time (given a little
		// more responsiveness to the UI).
		HNP.MUTEX = 1;
		displayHumdrum(baseid);
		HNP.MUTEX = 0;
	}
}



//////////////////////////////
//
// convertMusicXmlToHumdrum --
//


function convertMusicXmlToHumdrum(targetElement, sourcetext, vrvOptions, pluginOptions) {
	// let toolkit = pluginOptions.renderer;
	if (typeof vrvWorker !== "undefined") {
		toolkit = vrvWorker;
	}

	if (!toolkit) {
		console.log("Error: Cannot find verovio toolkit!");
		return;
	}
	// inputFrom = input data type
	vrvOptions.inputFrom = "musicxml-hum";


	vrvWorker.filterData(vrvOptions, sourcetext, "humdrum")
	.then(function(content) {
		targetElement.textContent = content;
		targetElement.style.display = "block";
	});

}



//////////////////////////////
//
// getHumdrum -- Return the Humdrum data used to render the last
//    SVG image(s).  This Humdrum data is the potentially
//    filtered input Humdrum data (otherwise the last raw
//    Humdrum input data).
//


function getHumdrum(pluginOptions) {
	let toolkit = pluginOptions.renderer;
	if (typeof vrvWorker !== "undefined") {
		toolkit = vrvWorker;
	}


	if (!toolkit) {
		console.log("Error: Cannot find verovio toolkit!");
		return;
	}


	vrvWorker.getHumdrum()
	.then(function(content) {
		return content;
	});

}



//////////////////////////////
//
// convertMeiToHumdrum --
//


function convertMeiToHumdrum(targetElement, sourcetext, vrvOptions, pluginOptions) {
	let toolkit = pluginOptions.renderer;
	if (typeof vrvWorker !== "undefined") {
		toolkit = vrvWorker;
	}


	if (!toolkit) {
		console.log("Error: Cannot find verovio toolkit!");
		return;
	}
	// inputFrom = input data type
	vrvOptions.inputFrom = "mei-hum";


	vrvWorker.filterData(vrvOptions, sourcetext, "humdrum")
	.then(function(content) {
		targetElement.textContent = content;
		targetElement.style.display = "block";
	});

}



//////////////////////////////
//
// getFilters -- Extract filters from the options and format for insertion
//    onto the end of the Humdrum data inpt to verovio.
//

function getFilters(options) {
	let filters = options.filter;
	if (!filters) {
		filters = options.filters;
	}
	if (!filters) {
		return "";
	}
	if (Object.prototype.toString.call(filters) === "[object String]") {
		filters = [filters];
	} else if (!Array.isArray(filters)) {
		// expected to be a string or array, so giving up
		return "";
	}
	let output = "";
	for (let i=0; i<filters.length; i++) {
		output += "!!!filter: " + filters[i] + "\n";
	}

	return output;
}



//////////////////////////////
//
// processHtml -- Extract PREHTML/POSTHTML content from file and 
//    place into div.PREHTML element and div.POSTHTML element.
//

function processHtml(entry) {
	// console.log("PROCESSHTML ENTRY", entry);
	if (!entry) {
		console.error("Error: No entry in processHtml");
		return;
	}
	if (!entry.humdrumOutput) {
		return;
	}
	let parameters = getHumdrumParameters(entry.humdrumOutput);
	// console.log("EXTRACTED PARAMETERS", parameters);

	if (!parameters) {
		return;
	}

	let preHtml = parameters.PREHTML;
	let postHtml = parameters.POSTHTML;

	let preElement = entry.container.querySelector("div.PREHTML");
	let postElement = entry.container.querySelector("div.POSTHTML");

	if (!preHtml) {
		if (preElement) {
			preElement.style.display = "none";
		}
	}
	if (!postHtml) {
		if (postElement) {
			postElement.style.display = "none";
		}
	}
	if (!preHtml && !postHtml) {
		return;
	}

	// Also deal with paged content: show preHtml only above first page
	// and postHtml only below last page.

	let lang = entry.options.lang || "";
	let langs = lang.split(/[^A-Za-z0-9_-]+/).filter(e => e);
	let preContent = "";
	let postContent = "";
	if (langs.length > 0) {
		for (let i=0; i<langs.length; i++) {
			if (preHtml) {
				preContent = preHtml[`CONTENT-${langs[i]}`];
			} 
			if (typeof preContent !== 'undefined') {
				break;
			}
		}
		for (let i=0; i<langs.length; i++) {
			if (postHtml) {
				postContent = postHtml[`CONTENT-${langs[i]}`];
			} 
			if (typeof postContent !== 'undefined') {
				break;
			}
		}
		if (typeof preContent === 'undefined') {
			if (preHtml) {
				preContent = preHtml.CONTENT;
			}
		}
		if (typeof postContent === 'undefined') {
			if (postHtml) {
				postContent = postHtml.CONTENT;
			}
		}
	} else {
		if (preHtml) {
			preContent = preHtml.CONTENT;
		}
		if (postHtml) {
			postContent = postHtml.CONTENT;
		}
	}

	// Get the first content-lang parameter:
	if (typeof preContent === 'undefined') {
		if (preHtml) {
			for (var name in preHtml) {
				if (name.match(/^CONTENT/)) {
					preContent = preHtml[name];
					break;
				}
			}
		}
	}
	if (typeof postContent === 'undefined') {
		if (postHtml) {
			for (var name in postHtml) {
				if (name.match(/^CONTENT/)) {
					postContent = postHtml[name];
					break;
				}
			}
		}
	}

	let preStyle = "";
	let postStyle = "";

	if (preHtml) {
		preStyle = preHtml.STYLE || "";
	}
	if (postHtml) {
		postStyle = postHtml.STYLE || "";
	}

	if (!preContent) {
		if (preElement) {
			preElement.style.display = "none";
		}
	} else if (preElement) {
		preElement.style.display = "block";
		if (preStyle) {
			preElement.style.cssText = preStyle;
		}
		preElement.innerHTML = preContent;
	}

	if (!postContent) {
		if (postElement) {
			postElement.style.display = "none";
		}
	} else if (postElement) {
		postElement.style.display = "block";
		if (postStyle) {
			postElement.style.cssText = postStyle;
		}
		postElement.innerHTML = postContent;
	}
}



//////////////////////////////
//
// getHumdrumParameters --
//

function getHumdrumParameters(humdrum) {
	let REFS = {};

	let atonlines = "";
	let lines = humdrum.split(/\r?\n/);
	let atonactive = "";

	for (let i=0; i<lines.length; i++) {
		if (!lines[i].match(/^!!/)) {
			continue;
		}
		let matches = lines[i].match(/^!!!\s*([^:]+)\s*:\s*(.*)\s*/);
		if (matches) {
			let key = matches[1];
			let value = matches[2];
			let item = {
				key: key,
				value: value,
				line: i+1
			};
			if (typeof REFS[key] === "undefined") {
				REFS[key] = item;
			} else if (Array.isArray(REFS[key]) == false) {
				REFS[key] = [ REFS[key], item ];
			} else {
				REFS[key].push(item);
			}
			continue;
		}
		matches = lines[i].match(/^!!(?!!)/);
		if (!matches) {
			continue;
		}
		let newline = lines[i].substr(2);
		if (atonactive) {
			atonlines += newline + "\n";
			let stringg = `^@@END:\\s*${atonactive}\\s*$`;
			let regex = new RegExp(stringg);
			if (newline.match(eegex)) {
				atonactive = "";
			}
			continue;
		} else {
			matches = newline.match(/^@@BEGIN:\s*(.*)\s*$/);
			if (matches) {
				atonactive = matches[1];
				atonlines += newline + "\n";
			}
		}
	}

	let output = {};
	if (atonlines) {
		let aton = new ATON;
		try {
			output = aton.parse(atonlines);
		} catch (error) {
			console.error("Error in ATON data:\n", atonlines);
		}
	}
	output._REFS = REFS;

	return output;
}



//////////////////////////////
//
// executeFunctionByName -- Also allow variable names that store functions.
//

function executeFunctionByName(functionName, context /*, args */) {
	if (typeof functionName === "function") {
		return
	}
	let args = Array.prototype.slice.call(arguments, 2);
	let namespaces = functionName.split(".");
	let func = namespaces.pop();
	for (let i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
		if (context && context[func]) {
			break;
		}
	}
	return context[func].apply(context, args);
}



//////////////////////////////
//
// functionName --
//

function functionName(fun) {
  let ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}





//////////////////////////////
//
// saveHumdrumSvg -- Save the specified Hudrum SVG images to the hard disk.  The input
// can be any of:
//    * A Humdrum script ID
//    * An array of Humdrum script IDs
//    * Empty (in which case all images will be saved)
//    * An SVG element
//

function saveHumdrumSvg(tags, savename) {
	if ((tags instanceof Element) && (tags.nodeName === "svg")) {
		// Save a single SVG element's contents to the hard disk.
		let sid = "";
		sid = tags.id;
		if (!sid) {
			sid = tags.parentNode.id;
		}
		let filename = savename;
		if (!filename) {
			filename = sid.replace(/-svg$/, "") + ".svg";
		}
		let text = tags.outerHTML.replace(/&nbsp;/g, " ").replace(/&#160;/g, " ");;
		blob = new Blob([text], { type: 'image/svg+xml' }),
		anchor = document.createElement('a');
		anchor.download = filename;
		anchor.href = window.URL.createObjectURL(blob);
		anchor.dataset.downloadurl = ['image/svg+xml', anchor.download, anchor.href].join(':');
		(function (anch, blobby, fn) {
			setTimeout(function() {
				anch.click();
				window.URL.revokeObjectURL(anch.href);
      		blobby = null;
			}, 0)
		})(anchor, blob, filename);
		return;
	}

	if (!tags) {
		// let selector = 'script[type="text/x-humdrum"]';
		let selector = '.humdrum-text[id$="-humdrum"]';
		let items = document.querySelectorAll(selector);
		tags = [];
		for (let i=0; i<items.length; i++) {
			let id = items[i].id.replace(/-humdrum$/, "");
			if (!id) {
				continue;
			}
			let ss = "#" + id + "-svg svg";
			let item = document.querySelector(ss);
			if (item) {
				tags.push(item);
			}
		}
	}
	if (tags.constructor !== Array) {
		tags = [tags];
	}

	(function (i, sname) {
		(function j () {
			let tag = tags[i++];
			if (typeof tag  === "string" || tag instanceof String) {
				let s = tag
				if (!tag.match(/-svg$/)) {
					s += "-svg";
				}
				let thing = document.querySelector("#" + s + " svg");
				if (thing) {
					saveHumdrumSvg(thing, sname);
				}
			} else if (tag instanceof Element) {
				(function(elem) {
					saveHumdrumSvg(elem, sname);
				})(tag);
			}
			if (i < tags.length) {
				// 100 ms delay time is necessary for saving all SVG images to
				// files on the hard disk.  If the time is too small, then some
				// of the files will not be saved.  This could be relate to
				// deleting the temporary <a> element that is used to download
				// the file.  100 ms is allowing 250 small SVG images to all
				// be saved correctly (may need to increase for larger files, or
				// perhaps it is possible to lower the wait time between image
				// saves).  Also this timeout (even if 0) will allow better
				// conrol of the UI vesus the file saving.
				setTimeout(j, 100);
			}
		})();
	})(0, savename);
}



//////////////////////////////
//
// saveHumdrumText -- Save the specified Hudrum text to the hard disk.  The input
// can be any of:
//    * A Humdrum script ID
//    * An array of Humdrum script IDs
//    * Empty (in which case all Humdrum texts will be saved)
//    * If the third parameter is present, then the first parameter will be ignored
//      and the text content of the third parameter will be stored in the filename
//      of the second parameter (with a default of "humdrum.txt").
//

function saveHumdrumText(tags, savename, savetext) {

	if (savetext) {
		// Saving literal text content to a file.
		if (!savename) {
			savename = "humdrum.txt";
		}
		// Unescaping < and >, which may cause problems in certain conditions, but not many:
		let stext = savetext.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		blob = new Blob([stext], { type: 'text/plain' }),
		anchor = document.createElement('a');
		anchor.download = savename;
		anchor.href = window.URL.createObjectURL(blob);
		anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
		(function (anch, blobby) {
			setTimeout(function() {
				anch.click();
				window.URL.revokeObjectURL(anch.href);
      		blobby = null;
			}, 0)
		})(anchor, blob);
		return;
	}

	if ((tags instanceof Element) && (tags.className.match(/humdrum-text/))) {
		// Save the text from a single element.
		let sid = "";
		sid = tags.id;
		if (!sid) {
			sid = tags.parentNode.id;
		}
		let filename = savename;
		if (!filename) {
			filename = sid.replace(/-humdrum$/, "") + ".txt";
		}
		let text = tags.textContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
		blob = new Blob([text], { type: 'text/plain' }),
		anchor = document.createElement('a');
		anchor.download = filename;
		anchor.href = window.URL.createObjectURL(blob);
		anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
		anchor.click();
		window.URL.revokeObjectURL(anchor.href);
      blob = null;
		return;
	}

	if (typeof tags  === "string" || tags instanceof String) {
		// Convert a Humdrum ID into an element and save contents in that element.
		let myid = tags.replace(/-humdrum$/, "");
		let myelement = document.querySelector("#" + myid + "-humdrum");
		if (!myelement) {
			myelement = document.querySelector("#" + myid);
		}
		saveHumdrumText(myelement);
		return;
	}

	if (!tags) {
		// If tags is empty, then create a list of all elements that
		// should contain Humdrum content.
		let selector = '.humdrum-text[id$="-humdrum"]';
		tags = document.querySelectorAll(selector);
	}
	if (tags.constructor !== NodeList) {
		if (tags.constructor !== Array) {
			// Force tags to be in an array-like structure (not that necessary).
			tags = [tags];
		}
	}
	if (tags.length == 0) {
		// Nothing to do, so give up.
		return;
	}
	if (tags.length == 1) {
		// Just one element on the page with interesting content, so save that
		// to a filename based on the element ID.
		saveHumdrumText(tags[0]);
		return;
	}

	// At this point, there are multiple elements with Humdrum content that should
	// be saved to the hard-disk.  Combine all of the content into a single data
	// stream, and then save (with a default filename of "humdrum.txt").

	let outputtext = "";
	let humtext = "";
	for (let i=0; i<tags.length; i++) {
		if (!tags[i]) {
			continue;
		}
		if (typeof tags[i]  === "string" || tags[i] instanceof String) {
			saveHumdrumText(tags[i]);
			// convert a tag to an element:
			let s = tags[i];
			if (!tags[i].match(/-humdrum$/)) {
				s += "-humdrum";
			}
			let thing = document.querySelector("#" + s);
			if (thing) {
				tags[i] = thing;
			} else {
				continue;
			}
		}
		// Collect the Humdrum file text of the element.
		if (tags[i] instanceof Element) {
			let segmentname = tags[i].id.replace(/-humdrum$/, "");
			if (!segmentname.match(/\.[.]*$/)) {
				segmentname += ".krn";
			}
			humtext = tags[i].textContent.trim()
					// remove any pre-existing SEGMENT marker:
					.replace(/^!!!!SEGMENT\s*:[^\n]*\n/m, "");
			if (humtext.match(/^\s*$/)) {
				// Ignore empty elements.
				continue;
			}
			outputtext += "!!!!SEGMENT: " + segmentname + "\n";
			outputtext += humtext + "\n";
		}
	}
	// save all extracted Humdrum content in a single file:
	saveHumdrumText(null, null, outputtext);
}



//////////////////////////////
//
// cloneObject -- Make a deep copy of an object, preserving arrays.
//

function cloneObject(obj) {
	var output, v, key;
	output = Array.isArray(obj) ? [] : {};
	for (key in obj) {
		v = obj[key];
		if (v instanceof HTMLElement) {
			continue;
		}
		output[key] = (typeof v === "object") ? cloneObject(v) : v;
	}
	return output;
}





//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/HumdrumNotationPluginEntry.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
// This file contains the HumdrumNotationPluginEntry class for 
// the Humdrum notation plugin.  This class is the used to store 
// options and elements for each notation example on a webpage.
//


//////////////////////////////
//
// HumdrumNotationPluginEntry::initializer --
//

function HumdrumNotationPluginEntry(baseid, opts) {
	this.baseId = baseid;
	if (opts instanceof Object) {
		this.options = cloneObject(opts);
	} else {
		this.options   = {};   // storage for options (both HNP and Verovio);
	}

	// Primary HTML elements related to entry:
	this.container = null; // container element for notation
	this.humdrum   = null; // storage for Humdrum data
	this.svg       = null; // storage for SVG image
	this.humdrumOutput = null; // storage for Humdrum after filtering to create SVG image
	this.pages     = [];   // storage buffer for SVG of each page (multi-page examples)

	return this;
}



//////////////////////////////
//
// HumdrumNotationPluginEntry::convertFunctionNamesToRealFunctions --
//

HumdrumNotationPluginEntry.prototype.convertFunctionNamesToRealFunctions = function () {
	if (!this.options) {
		console.log("Error: options not defined in entry:", this);
		return;
	}
	if (this.options.postFunction) {
		if (typeof this.options.postFunction === "string") {
			if ({}.toString.call(this.options.postFunction) === '[object Function]') {
				this.options.postFunction = functionName(this.options.postFunction);
			}
		}
	}
}



//////////////////////////////
//
// HumdruNotationPluginEntry::createContainer -- Create a target location
//     for the Humdrum notation content.  First check if there is an element
//     with the given ID, and return that element if it exists.  If it does not
//     exist, then create a div element with the given containerid used as the
//     ID for the div.

HumdrumNotationPluginEntry.prototype.createContainer = function () {
	if (this.container) {
		console.log("Error: container already initialize:", this.container);
	}
	var container = document.querySelector("#" + this.baseId + "-container");
	if (container) {
		// Recycle this container for use with the plugin.  Typically the
		// container is predefined to reserve vertical space for the notation
		// that will be placed inside of it.
		this.container = container;
	} else {
		// the container needs to be created, and it will be placed
		// just above the source script.

		var target = document.querySelector("#" + this.baseId);
		if (!target) {
			console.log("Error: need a target to place container before:", this.baseId);
			return null;
		}
		this.container = document.createElement('div');
		this.container.id = this.baseId + "-container";
		target.parentNode.insertBefore(this.container, target);
	}
	this.container.className = "humdrum-notation-plugin";
	return this.container;
};



//////////////////////////////
//
// HumdrumNotationPluginEntry::copyContentToContainer --
//

HumdrumNotationPluginEntry.prototype.copyContentToContainer = function () {
	if (!this.options) {
		console.log("Error: options required for entry:", this);
		return;
	}
	if (!this.options.source) {
		console.log("Error: Source property required for options:", this.options);
		return;
	}
	
	if (!this.humdrum) {
		console.log("Error: Humdrum container target not initialized:", this);
		return;
	}
	

	var source = document.querySelector("#" + this.options.source);

	if (!source) {
		console.log("Error: No Humdrum source for", this.baseId);
		
		console.log("ID that is empty:", this.options.source);
		
		return;
	}
	if (!this.container) {
		console.log("Error: No container for storing data from ID", this.baseId);
		return;
	}
	var content = source.textContent.trim();

	var initial = content.substr(0, 600);
	// Probably use the real plugin options here later:
	var poptions = {};
	var options;
/*
	if (initial.match(/^\s*</)) {
		// some sort of XML junk, so convert to Humdrum
		var ctype = "unknown";
		if (initial.match(/<mei /)) {
			ctype = "mei";
		} else if (initial.match(/<mei>/)) {
			ctype = "mei";
		} else if (initial.match(/<music>/)) {
			ctype = "mei";
		} else if (initial.match(/<music /)) {
			ctype = "mei";
		} else if (initial.match(/<pages>/)) {
			ctype = "mei";
		} else if (initial.match(/<pages /)) {
			ctype = "mei";
		} else if (initial.match(/<score-partwise>/)) {
			ctype = "musicxml";
		} else if (initial.match(/<score-timewise>/)) {
			ctype = "musicxml";
		} else if (initial.match(/<opus>/)) {
			ctype = "musicxml";
		} else if (initial.match(/<score-partwise /)) {
			ctype = "musicxml";
		} else if (initial.match(/<score-timewise /)) {
			ctype = "musicxml";
		} else if (initial.match(/<opus /)) {
			ctype = "musicxml";
		}
		if (ctype === "musicxml") {
			// convert MusicXML data into Humdrum data
			options = {
				inputFrom: "musicxml-hum"
			};
			
			convertMusicXmlToHumdrum(this.humdrum, content, options, poptions);
			
		} else if (ctype === "mei") {
			// convert MEI data into Humdrum data
			options = {
				inputFrom: "mei-hum"
			};
			
			convertMeiToHumdrum(this.humdrum, content, options, poptions);
			
		} else {
			console.log("Warning: given some strange XML data:", content);
		}
*/
	
//	} else {
		this.humdrum.textContent = content;
//	}
	
}



//////////////////////////////
//
// HumdrumNotationPluginEntry::initializeContainer --  Generate contents for
//      the main humdrum-plugin div that is used to hold the verovio options,
//      the input humdrum text and the output verovio SVG image.
//
// The main container is a div element with an ID that matches the ID of the
// source Humdrum data script followed by an optional variant tag and then
// the string "-container".
//
// Inside the main target div there are two elements of interest:
//    (1) a div element with an similar ID that ends in "-options" rather
//        than "-container".
//    (2) a table element that contains the potentially visible Humdrum text
//        that create the SVG image in one cell, and another cell that contains
//        the SVG rendering of the Humdrum data.
//
//        The Humdrum data is stored within a pre element (may be changed later)
//        that has an ID in the form of the container div, but with "-humdrum" as
//        the extension for the ID.
//
//        The SVG image is stored in a div that has an ID that is similar to the
//        containing element, but has "-svg" as an extension rather than "-container".
//
// How the humdrum and svg containers are stored in the table will be dependend on how
// the layout of the two elements are set, with the Humdrum data either above, below,
// to the left or two the right of the SVG image.
//
// So a typical organization of the resulting code from this function might be:
//
// <div class="humdrum-plugin" id="bach-container">
//    <div id="bach-options">[Options for rendering with verovio]</div>
//    <table class="humdrum-verovio">
//       <tbody>
//       <tr>
//          <td>
//          <div>
//             <script type="text/x-humdrum" class="humdrum-notation-plugin" id="bach-humdrum">[Humdrum contents]</text>
//          </div>
//          </td>
//          <td>
//             <div class="verovio-svg" id="bach-svg">[SVG image of music notation]</div>
//          </td>
//       </tr>
//       </tbody>
//    </table>
// </div>
//
// Also notice the class names which can be used for styling the notation or humdrum text:
//    humdrum-plugin  == The main div container for the musical example.
//    humdrum-verovio == The class name of the table that contains the humdrum and rendered svg.
//    humdrum-text    == The potentially visible Humdrum text for the example.
//    verovio-svg     == The div container that holes the verovio-generated SVG image.
//

HumdrumNotationPluginEntry.prototype.initializeContainer = function () {
	if (!this.container) {
		console.log("Error: Container must first be created:", this);
		return;
	}

	var output = "";
	var hvisible = false;
	if ((this.options["humdrumVisible"] === "true") || 
	    (this.options["humdrumVisible"] === true) || 
	    (this.options["humdrumVisible"] === 1)) {
		hvisible = true;
	}

	output += "<div style='display:none' class='PREHTML'></div>\n";
	output += "<table class='humdrum-verovio'";
	output += " style='border:0; border-collapse:collapse;'";
	output += ">\n";
	output += "   <tbody>\n";
	output += "   <tr style='border:0' valign='top'>\n";
	if (hvisible) {
		output += "<td";
		if (this.options["humdrumMinWidth"]) {
			output += " style='border:0; min-width: " + this.options["humdrumMinWidth"] + ";'";
		} else {
			output += " style='border:0;'";
		}
		output += ">\n";
	} else {
		output += "<td style='border:0; display:none;'>\n";
	}

	output += "<div>\n";
	output += "<script type='text/x-humdrum' style='display:none;' class='humdrum-text'";
	output += " contenteditable='true' id='";
	output += this.baseId + "-humdrum'></script>\n";
	output += "</div>\n";
	output += "</td>\n";

	output += "<td style='border:0;'>\n";
	output += "<div class='verovio-svg'";
	output += " id='" + this.baseId + "-svg'></div>\n";
	output += "</td>\n";
	output += "</tr>\n";
	output += "</tbody>\n";
	output += "</table>\n";
	output += "<div style='display:none' class='POSTHTML'></div>\n";

	var oldcontent = this.container.innerHTML;
	this.container.innerHTML = output;

	this.humdrum = this.container.querySelector("#" + this.baseId + "-humdrum");
	this.svg = this.container.querySelector("#" + this.baseId + "-svg");
	// Move any previous content to the svg container.  This may contain
	// a pre-image that needs to be preserved a little longer so that the
	// final SVG image can be calculated.
	this.svg.innerHTML = oldcontent;
}



//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/HumdrumNotationPluginDatabase.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
// This file contains the HumdrumNotationPluginDatabase class for
// the Humdrum notation plugin.  This class is the main database for
// keeping track of options and locations of examples on a webpage.
//


//////////////////////////////
//
// HumdrumNotationPluginDatabase::prepareOptions --
//

HumdrumNotationPluginDatabase.prototype.prepareOptions = function () {
	var list = this.verovioOptions.OPTION;
	for (var i=0; i<list.length; i++) {
		if (list[i].CLI_ONLY) {
			continue;
		}
		this.verovioOptions[list[i].NAME] = list[i];
	}
};



HumdrumNotationPluginDatabase.prototype.verovioOptions = {
   "OPTION": [
      {
         "NAME": "help",
         "ABBR": "?",
         "INFO": "Display help message.",
         "ARG": "boolean",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "allPages",
         "ABBR": "a",
         "INFO": "Output all pages.",
         "ARG": "boolean",
         "CLI_ONLY": "true?"
      },
      {
         "NAME": "inputFrom",
         "ABBR": "f",
         "INFO": "Select input data type.",
         "ARG": "string",
         "DEF": "mei",
         "ALT": [
            "auto",
            "darms",
            "pae",
            "xml",
            "humdrum",
            "humdrum-xml"
         ],
         "CLI_ONLY": "true?"
      },
      {
         "NAME": "outfile",
         "ABBR": "o",
         "INFO": "Output file name (use \"-\" for standard output).",
         "ARG": "string",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "page",
         "ABBR": "p",
         "INFO": "Select the page to engrave.",
         "ARG": "integer",
         "DEF": "1",
         "MIN": "1",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "resources",
         "ABBR": "r",
         "INFO": "Path to SVG resources.",
         "ARG": "string",
         "DEF": "/usr/local/share/verovio",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "scale",
         "ABBR": "s",
         "INFO": "Scale percentage",
         "ARG": "integer",
         "DEF": "100",
         "MIN": "1"
      },
      {
         "NAME": "minLastJustification",
         "INFO": "Minimum length of last system which can be stretched to 100% width of page.",
         "ARG": "float",
         "DEF": "0.8",
         "MIN": "0.0",
         "MAX": "1.0"
      },
      {
         "NAME": "outputTo",
         "ABBR": "t",
         "INFO": "Select output data format",
         "ARG": "string",
         "DEF": "svg",
         "ALT": [
            "mei",
            "midi"
         ]
      },
      {
         "NAME": "version",
         "ABBR": "v",
         "INFO": "Display verovio version number.",
         "ARG": "boolean",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "xmlIdSeed",
         "ABBR": "x",
         "INFO": "Seed the random number generator for XML IDs.",
         "ARG": "integer"
      },
      {
         "NAME": "adjustPageHeight",
         "CAT": "Input and page layout options",
         "INFO": "Crop the page height to the actual height of the content.",
         "ARG": "boolean"
      },
      {
         "NAME": "adjustPageWidth",
         "CAT": "Input and page layout options.",
         "INFO": "Crop the page width to the actual width of the content.",
         "ARG": "boolean"
      },
      {
         "NAME": "breaks",
         "CAT": "Input and page layout options",
         "INFO": "Define page and system breaks layout.",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "line",
            "smart",
            "encoded"
         ]
      },
      {
         "NAME": "breaksSmartSb",
         "CAT": "Input and page layout options",
         "INFO": "In smart breaks mode, the portion of the system width usage\n\tat which an encoded system break will be used.",
         "ARG": "float",
         "DEF": "0.66",
         "MIN": "0.00",
         "MAX": "1.00"
      },
      {
         "NAME": "condense",
         "CAT": "Input and page layout options",
         "INFO": "Control condensed score layout.",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "encoded"
         ]
      },
      {
         "NAME": "condenseFirstPage",
         "CAT": "Input and page layout options",
         "INFO": "When condensing a score, also condense the first page.",
         "ARG": "boolean"
      },
      {
         "NAME": "condenseTempoPages",
         "CAT": "Input and page layout options",
         "INFO": "When condensing a score, also condense pages with a tempo.",
         "ARG": "boolean"
      },
      {
         "NAME": "evenNoteSpacing",
         "CAT": "Input and page layout options",
         "INFO": "Specify the linear spacing factor.  This is useful for mensural notation display.",
         "ARG": "boolean"
      },
      {
         "NAME": "expand",
         "CAT": "Input and page layout options",
         "INFO": "Expand all referenced elements in the expanion.  Input is an xml:id of the expansion list.",
         "ARG": "string"
      },
      {
         "NAME": "humType",
         "CAT": "Input and page layout options",
         "INFO": "Include type attributes when importing rom Humdrum",
         "ARG": "boolean"
      },
      {
         "NAME": "justifyVertically",
         "CAT": "Input and page layout options",
         "INFO": "Justify spacing veritcally to fill a page.",
         "ARG": "boolean"
      },
      {
         "NAME": "landscape",
         "CAT": "Input and page layout options",
         "INFO": "The landscape paper orientation flag.",
         "ARG": "boolean"
      },
      {
         "NAME": "mensuralToMeasure",
         "CAT": "Input and page layout options",
         "INFO": "Convert mensural sections to measure-based MEI.",
         "ARG": "boolean"
      },
      {
         "NAME": "mmOutput",
         "CAT": "Input and page layout options",
         "INFO": "Specify that the output in the SVG is given in mm (default is px).",
         "ARG": "boolean"
      },
      {
         "NAME": "footer",
         "CAT": "Input and page layout options",
         "INFO": "Do not add any footer, add a footer, use automatic footer.",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "encoded",
            "always"
         ]
      },
      {
         "NAME": "header",
         "CAT": "Input and page layout options",
         "INFO": "Do not add any header, add a header, use automatic header.",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "encoded"
         ]
      },
      {
         "NAME": "noJustification",
         "CAT": "Input and page layout options",
         "INFO": "Do not justify the system.",
         "ARG": "boolean"
      },
      {
         "NAME": "openControlEvents",
         "CAT": "Input and page layout options",
         "INFO": "Render open control events.",
         "ARG": "boolean"
      },
      {
         "NAME": "outputIndent",
         "CAT": "Input and page layout options",
         "INFO": "Output indent value for MEI and SVG.",
         "ARG": "integer",
         "DEF": "3",
         "MIN": "1",
         "MAX": "10"
      },
      {
         "NAME": "outputFormatRaw",
         "CAT": "Input and page layout options",
         "INFO": "Output MEI with no line indents or non-content newlines. See svgFormatRaw.",
         "ARG": "boolean"
      },
      {
         "NAME": "outputIndentTab",
         "CAT": "Input and page layout options",
         "INFO": "Use tabs rather than spaces for indenting XML output.",
         "ARG": "boolean"
      },
      {
         "NAME": "outputSmuflXmlEntities",
         "CAT": "Input and page layout options",
         "INFO": "Output SMuFL characters as XML entities instead of hex byte codes.",
         "ARG": "boolean"
      },
      {
         "NAME": "pageHeight",
         "CAT": "Input and page layout options",
         "INFO": "The page height.",
         "ARG": "integer",
         "DEF": "2970",
         "MIN": "100",
         "MAX": "60000"
      },
      {
         "NAME": "pageMarginBottom",
         "CAT": "Input and page layout options",
         "INFO": "Bottom margin of pages.",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginLeft",
         "CAT": "Input and page layout options",
         "INFO": "Left margin of pages.",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginRight",
         "CAT": "Input and page layout options",
         "INFO": "Right margin of pages.",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginTop",
         "CAT": "Input and page layout options",
         "INFO": "Top margin of pages.",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageWidth",
         "CAT": "Input and page layout options",
         "INFO": "Page width.",
         "ARG": "integer",
         "DEF": "2100",
         "MIN": "100",
         "MAX": "60000"
      },
      {
         "NAME": "preserveAnalyticalMarkup",
         "CAT": "Input and page layout options",
         "INFO": "Preserves the analytical markup in MEI.",
         "ARG": "boolean"
      },
      {
         "NAME": "removeIDs",
         "CAT": "Input and page layout options",
         "INFO": "Remove XML IDs in the MEI output when not referenced.",
         "ARG": "boolean"
      },
      {
         "NAME": "shrinkToFit",
         "CAT": "Input and page layout options",
         "INFO": "Scale down page content to fit the page height if needed.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgBoundingBoxes",
         "CAT": "Input and page layout options",
         "INFO": "Include bounding boxes in SVG output.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgViewBox",
         "CAT": "Input and page layout options",
         "INFO": "Use viewbox on SVG root element for easy scaling of document.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgHtml5",
         "CAT": "Input and page layout options",
         "INFO": "Write data-id and data-class attributes for JS usage and ID clash avoidance.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgFormatRaw",
         "CAT": "Input and page layout options",
         "INFO": "Writes SVG with no line indenting or non-content newlines. See outputFormatRaw.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgRemoveXlink",
         "CAT": "Input and page layout options",
         "INFO": "Removes the \"xlink:\" prefix from href attributes for compatibility with some newer browsers.",
         "ARG": "boolean"
      },
      {
         "NAME": "unit",
         "CAT": "Input and page layout options",
         "INFO": "The MEI unit (1/2 of the distance between the staff lines).",
         "ARG": "integer",
         "DEF": "9",
         "MIN": "6",
         "MAX": "20"
      },
      {
         "NAME": "useBraceGlyph",
         "CAT": "Input and page layout options",
         "INFO": "Use brace glyph from current font.",
         "ARG": "boolean"
      },
      {
         "NAME": "useFacsimile",
         "CAT": "Input and page layout options",
         "INFO": "Use information in the facsimile element to control the layout.",
         "ARG": "boolean"
      },
      {
         "NAME": "usePgFooterForAll",
         "CAT": "Input and page layout options",
         "INFO": "Use the pgFooter element for all pages.",
         "ARG": "boolean"
      },
      {
         "NAME": "usePgHeaderForAll",
         "CAT": "Input and page layout options",
         "INFO": "Use the pgHeader element for all pages.",
         "ARG": "boolean"
      },
      {
         "NAME": "midiTempoAdjustment",
         "CAT": "General layout",
         "INFO": "MIDI tempo adjustment factor.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.20",
         "MAX": "4.00"
      },
      {
         "NAME": "barLineSeparation",
         "CAT": "General layout",
         "INFO": "Default distance between multiple barlines when locked together.",
         "ARG": "float",
         "DEF": "0.80",
         "MIN": "0.50",
         "MAX": "2.00"
      },
      {
         "NAME": "barLineWidth",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "The width of a barline.",
         "DEF": "0.30",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "beamMaxSlope",
         "INFO": "The maximum beam slope.",
         "CAT": "General layout",
         "ARG": "integer",
         "DEF": "10",
         "MIN": "1",
         "MAX": "20"
      },
      {
         "NAME": "beamMinSlope",
         "INFO": "The minimum beam slope.",
         "CAT": "General layout",
         "ARG": "integer",
         "DEF": "0",
         "MIN": "0",
         "MAX": "0"
      },
      {
         "NAME": "bracketThickness",
         "INFO": "Thickness of the system bracket.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "1.0",
         "MIN": "0.5",
         "MAX": "2.0"
      },
      {
         "NAME": "dynamDist",
         "INFO": "Default distance from staff to dynamic marks.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.50",
         "MAX": "16.00"
      },
      {
         "NAME": "engravingDefaults",
         "INFO": "JSON describing defaults for engraving SMuFL elements.",
         "CAT": "General layout",
         "ARG": "string"
      },
      {
         "NAME": "engravingDefaultsFile",
         "INFO": "Path to JSON file describing defaults for engraving SMuFL elements.",
         "CAT": "General layout",
         "ARG": "string"
      },
      {
         "NAME": "font",
         "INFO": "Set the music font.",
         "CAT": "General layout",
         "ARG": "string",
         "DEF": "Leipzig",
         "ALT": [
            "Bravura",
            "Gootville",
            "Leland"
         ]
      },
      {
         "NAME": "graceFactor",
         "INFO": "The grace size ratio numerator.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.75",
         "MIN": "0.50",
         "MAX": "1.00"
      },
      {
         "NAME": "graceRhythmAlign",
         "INFO": "Align grace notes rhythmically with all staves.",
         "CAT": "General layout",
         "ARG": "boolean"
      },
      {
         "NAME": "graceRightAlign",
         "INFO": "Align the right position of a grace group with all staves.",
         "CAT": "General layout",
         "ARG": "boolean"
      },
      {
         "NAME": "hairpinSize",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Size of hairpins (crescendo lines).",
         "DEF": "3.00",
         "MIN": "1.00",
         "MAX": "8.00"
      },
      {
         "NAME": "hairpinThickness",
         "CAT": "General layout",
         "INFO": "Hairpin thickness (crescendo lines).",
         "ARG": "float",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "harmDist",
         "CAT": "General layout",
         "INFO": "Default distance from haromonic labels to the staff.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.50",
         "MAX": "16.00"
      },
      {
         "NAME": "justificationStaff",
         "CAT": "General layout",
         "INFO": "Staff justification.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "justificationSystem",
         "CAT": "General layout",
         "INFO": "Vertical system spacing justification.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "justificationBracketGroup",
         "CAT": "General layout",
         "INFO": "Space between staves inside a bracket group justification.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "justificationBraceGroup",
         "CAT": "General layout",
         "INFO": "Space between staves inside a brace group justification.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "ledgerLineThickness",
         "CAT": "General layout",
         "INFO": "Thickness of ledger lines.",
         "ARG": "float",
         "DEF": "0.25",
         "MIN": "0.10",
         "MAX": "0.50"
      },
      {
         "NAME": "ledgerLineExtension",
         "CAT": "General layout",
         "INFO": "Amount by which ledger lines should extend on either side of a notehead.",
         "ARG": "float",
         "DEF": "0.54",
         "MIN": "0.20",
         "MAX": "1.00"
      },
      {
         "NAME": "lyricSize",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Size of lyric text.",
         "DEF": "4.50",
         "MIN": "2.00",
         "MAX": "8.00"
      },
      {
         "NAME": "lyricHyphenLength",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Lyric hyphen and dash lengths.",
         "DEF": "1.20",
         "MIN": "0.50",
         "MAX": "3.00"
      },
      {
         "NAME": "lyricLineThickness",
         "CAT": "General layout",
         "INFO": "Lyric extender line thicknesses.",
         "ARG": "float",
         "DEF": "0.25",
         "MIN": "0.10",
         "MAX": "0.50"
      },
      {
         "NAME": "lyricNoStartHyphen",
         "CAT": "General layout",
         "INFO": "Do not show hyphens at system beginnings.",
         "ARG": "boolean"
      },
      {
         "NAME": "lyricTopMinMargin",
         "CAT": "General layout",
         "INFO": "The minmal margin above the lyrics",
         "ARG": "float",
         "DEF": "3.00",
         "MIN": "3.00",
         "MAX": "8.00"
      },
      {
         "NAME": "lyricWordSpace",
         "CAT": "General layout",
         "INFO": "Minimum width of spaces separating lyric text.",
         "ARG": "float",
         "DEF": "1.20",
         "MIN": "0.50",
         "MAX": "3.00"
      },
      {
         "NAME": "mnumInterval",
         "INFO": "Repeat measure numbers at the given cycle size.",
         "CAT": "General layout",
         "ARG": "integer"
      },
      {
         "NAME": "multiRestStyle",
         "INFO": "Rendering style of multiple measure rests.",
         "CAT": "General layout",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "default",
            "block",
            "symbols"
         ]
      },
      {
         "NAME": "repeatBarLineDotSeparation",
         "INFO": "Default horizontal distance between dots and inner repeat barline.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.30",
         "MIN": "0.10",
         "MAX": "1.00"
      },
      {
         "NAME": "repeatEndingLineThickness",
         "INFO": "Repeat and endling line thickness.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.15",
         "MIN": "0.10",
         "MAX": "2.00"
      },
      {
         "NAME": "slurMaxSlope",
         "INFO": "Maximum slur slope in degrees.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "60",
         "MIN": "30",
         "MAX": "85"
      },
      {
         "NAME": "slurEndpointThickness",
         "INFO": "Slur endpoint thickness.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.10",
         "MIN": "0.05",
         "MAX": "0.25"
      },
      {
         "NAME": "slurMidpointThickness",
         "INFO": "Slur midpoint thickness.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.60",
         "MIN": "0.20",
         "MAX": "1.20"
      },
      {
         "NAME": "spacingBraceGroup",
         "INFO": "Minimum space between staves inside of a braced group.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "12",
         "MIN": "0",
         "MAX": "48"
      },
      {
         "NAME": "spacingBracketGroup",
         "INFO": "Minimum space between staves inside a bracketed group.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "12",
         "MIN": "0",
         "MAX": "48"
      },
      {
         "NAME": "spacingDurDetection",
         "INFO": "Detect long duration for adjusting spacing.",
         "CAT": "General layout",
         "ARG": "boolean"
      },
      {
         "NAME": "octaveAlternativeSymbols",
         "INFO": "Use alternative symbols for displaying octaves.",
         "CAT": "General layout",
         "ARG": "boolean"
      },
      {
         "NAME": "octaveLineThickness",
         "INFO": "Octave line thickness.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "1.00"
      },
      {
         "NAME": "spacingLinear",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Specify the linear spacing factor",
         "DEF": "0.25",
         "MIN": "0.00",
         "MAX": "1.00"
      },
      {
         "NAME": "spacingNonLinear",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Specify the non-linear spacing factor.",
         "DEF": "0.60",
         "MIN": "0.00",
         "MAX": "1.00"
      },
      {
         "NAME": "spacingStaff",
         "ARG": "integer",
         "INFO": "The staff minimal spacing",
         "CAT": "General layout",
         "DEF": "12",
         "MIN": "0",
         "MAX": "48"
      },
      {
         "NAME": "spacingSystem",
         "ARG": "integer",
         "INFO": "The system minimal spacing",
         "CAT": "General layout",
         "DEF": "12",
         "MIN": "0",
         "MAX": "48"
      },
      {
         "NAME": "staffLineWidth",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "The staff line width in unit",
         "DEF": "0.15",
         "MIN": "0.10",
         "MAX": "0.30"
      },
      {
         "NAME": "stemWidth",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "The stem width",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.50"
      },
      {
         "NAME": "subBracketThickness",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Thickness of system sub-brackets.",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "2.00"
      },
      {
         "NAME": "systemDivider",
         "CAT": "General layout",
         "INFO": "Display style of system dividers",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "left",
            "left-right"
         ]
      },
      {
         "NAME": "systemMaxPerPage",
         "CAT": "General layout",
         "INFO": "Maximum number of systems per page",
         "ARG": "integer"
      },
      {
         "NAME": "textEnclosureThickness",
         "CAT": "General layout",
         "INFO": "Thickness of text-enclosing boxes.",
         "ARG": "float",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "thickBarlineThickness",
         "CAT": "General layout",
         "INFO": "Thickness of thick barlines.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.50",
         "MAX": "2.00"
      },
      {
         "NAME": "tieEndpointThickness",
         "CAT": "General layout",
         "INFO": "Endpoint tie thickenesses",
         "ARG": "float",
         "DEF": "0.10",
         "MIN": "0.05",
         "MAX": "0.25"
      },
      {
         "NAME": "tieMidpointThickness",
         "CAT": "General layout",
         "INFO": "Tie midpoint thickenesses",
         "ARG": "float",
         "DEF": "0.50",
         "MIN": "0.20",
         "MAX": "1.00"
      },
      {
         "NAME": "tupletBracketThickness",
         "CAT": "General layout",
         "INFO": "Tuplet bracket thicknesses.",
         "ARG": "float",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "tupletNumHead",
         "CAT": "General layout",
         "INFO": "Placement of tuplet number on the notehead-side.",
         "ARG": "boolean"
      },
      {
         "NAME": "defaultBottomMargin",
         "CAT": "element margins",
         "INFO": "Default bottom margin",
         "ARG": "float",
         "DEF": "0.50",
         "MIN": "0.00",
         "MAX": "5.00"
      },
      {
         "NAME": "defaultLeftMargin",
         "CAT": "element margins",
         "INFO": "Default left margin.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "defaultRightMargin",
         "CAT": "element margins",
         "INFO": "The default right margin",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "defaultTopMargin",
         "CAT": "element margins",
         "INFO": "The default top margin",
         "ARG": "float",
         "DEF": "0.50",
         "MIN": "0.00",
         "MAX": "6.00"
      },
      {
         "NAME": "leftMarginAccid",
         "CAT": "element margins",
         "INFO": "The margin for accid",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "bottomMarginArtic",
         "CAT": "element margins",
         "INFO": "Bottom margin for articulations.",
         "ARG": "float",
         "DEF": "0.75",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "bottomMarginHarm",
         "CAT": "element margins",
         "INFO": "Bottom margin for harmony labels.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "bottomMarginHeader",
         "CAT": "element margins",
         "INFO": "Bottom margin for page headers.",
         "ARG": "float",
         "DEF": "8.00",
         "MIN": "0.00",
         "MAX": "24.00"
      },
      {
         "NAME": "leftMarginBarLine",
         "CAT": "element margins",
         "INFO": "Left margin for barLines.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginBeatRpt",
         "CAT": "element margins",
         "INFO": "Left margin for beatRpt.",
         "ARG": "float",
         "DEF": "2.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginChord",
         "CAT": "element margins",
         "INFO": "Left margin for chords.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginClef",
         "CAT": "element margins",
         "INFO": "Left margin for clefs.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginKeySig",
         "CAT": "element margins",
         "INFO": "Left margin for key signatures.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginLeftBarLine",
         "CAT": "element margins",
         "INFO": "Left margin for left barLines.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMensur",
         "CAT": "element margins",
         "INFO": "Left margin for mensur.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMeterSig",
         "CAT": "element margins",
         "INFO": "Left margin for meterSig.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMRest",
         "CAT": "element margins",
         "INFO": "Left margin for mRest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMRpt2",
         "CAT": "element margins",
         "INFO": "Left margin for mRpt2.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMultiRest",
         "CAT": "element margins",
         "INFO": "Left margin for multiRest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMultiRpt",
         "CAT": "element margins",
         "INFO": "Left  margin for multiRpt.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginNote",
         "CAT": "element margins",
         "INFO": "Right margin for note.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginRest",
         "CAT": "element margins",
         "INFO": "Left margin for rest.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginRightBarLine",
         "CAT": "element margins",
         "INFO": "Margin for right barLine.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginTabDurSym",
         "CAT": "element margins",
         "INFO": "Margin for tabDurSym.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginAccid",
         "CAT": "element margins",
         "INFO": "Right margin for accid.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginBarLine",
         "CAT": "element margins",
         "INFO": "Right margin for barLine.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginBeatRpt",
         "CAT": "element margins",
         "INFO": "Right margin for beatRpt.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginChord",
         "CAT": "element margins",
         "INFO": "Right margin for chord.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginClef",
         "CAT": "element margins",
         "INFO": "Right margin for clef.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginKeySig",
         "CAT": "element margins",
         "INFO": "Right margin for keySig.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginLeftBarLine",
         "CAT": "element margins",
         "INFO": "Right margin for left barLine.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMensur",
         "CAT": "element margins",
         "INFO": "Right margin for mensur.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMeterSig",
         "CAT": "element margins",
         "INFO": "Right margin for meterSig.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMRest",
         "CAT": "element margins",
         "INFO": "Right margin for mRest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMRpt2",
         "CAT": "element margins",
         "INFO": "Right margin for mRpt2.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMultiRest",
         "CAT": "element margins",
         "INFO": "Right margin for multiRest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMultiRpt",
         "CAT": "element margins",
         "INFO": "Right margin for multiRpt.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginNote",
         "CAT": "element margins",
         "INFO": "The right margin for note.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginRest",
         "CAT": "element margins",
         "INFO": "The right margin for rest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginRightBarLine",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for right barLine.",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginTabDurSym",
         "CAT": "element margins",
         "INFO": "Right margin for tabDurSym.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "topMarginArtic",
         "CAT": "element margins",
         "INFO": "Top margin for articulations.",
         "ARG": "float",
         "DEF": "0.75",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "topMarginHarm",
         "CAT": "element margins",
         "INFO": "Top margin for harmony labels.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      }
   ]
}
;



//////////////////////////////
//
// HumdrumNotationPluginDatabase::initializer --
//

function HumdrumNotationPluginDatabase() {
	this.entries = {};  // Hash of notation ids and their related information.
	this.mutex = 0;
	this.waiting = [];  // Notation entries to process after verovio has loaded.
	this.ready = 0;     // Set to 1 when verovio toolkit is loaded
	HumdrumNotationPluginDatabase.prototype.prepareOptions();
	return this;
}


var HNP = new HumdrumNotationPluginDatabase();



///////////////////////////////////////////////////////////////////////////


function getContainer(baseid) {
	var entry = HNP.entries[baseid];
	if (!entry) {
		return null;
	}
	return entry.container;
}

///////////////////////////////////////////////////////////////////////////

//////////////////////////////
//
// HumdrumNotationPluginDatabase::displayWaiting --
//

HumdrumNotationPluginDatabase.prototype.displayWaiting = function () {
	// maybe check to see if document is ready (otherwise maybe infinite loop).
	for (var i=0; i<this.waiting.length; i++) {
		(function(that, j, obj) {
			setTimeout(function() {
				that.displayHumdrumNow(obj);
			}, j*250);
		}(this, i, this.waiting[i]));
	}
	this.waiting = [];
}



//////////////////////////////
//
// HumdrumNotationPluginDatabase::setErrorScore --
//

HumdrumNotationPluginDatabase.prototype.setErrorScore = function (baseid) {
	var element = document.querySelector("#" + baseid);
	if (!element) {
		console.log("Warning: Cannot find error score for ID", baseid);
		return;
	}
	var text = element.textContent.trim();
	this.errorScore = text;
	return this;
}



//////////////////////////////
//
// HumdrumNotationPluginDatabase::createEntry --
//

HumdrumNotationPluginDatabase.prototype.createEntry = function (baseid, options) {
	if (typeof baseid !== "string" && !(baseid instanceof String)) {
		console.log("Error: baseid must be a string, but it is:", baseid);
		return null;
	}
	if (!(options instanceof Object)) {
		console.log("Error: options must be an object:", options);
		return null;
	}
	if (!baseid) {
		console.log("Error: baseid cannot be empty");
		return null;
	}
	var entry = this.entries[baseid];
	if (entry) {
		console.log("Error: entry already exists:", entry);
		return entry;
	}
	var entry = new HumdrumNotationPluginEntry(baseid, options);
	this.entries[baseid] = entry;
	entry.convertFunctionNamesToRealFunctions();
	entry.createContainer();
	entry.initializeContainer();
	return entry;
};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::displayHumdrumNow -- Don't wait, presumably since
//     the page has finished loading.
//

HumdrumNotationPluginDatabase.prototype.displayHumdrumNow = function (opts) {

	if (opts instanceof Element) {
		// Currently not allowed, but maybe allow the container element, and then
		// extract the options from the container (from the *-options element).
		return;
	}

	var entry = null;

	if (typeof opts === "string" || opts instanceof String) {
		// This is a base ID for a Humdrum example to display.
		entry = this.entries[opts];
		if (!entry) {
			console.log("Error: trying to create notation for an uninitialized ID");
			return;
		}
	} else if (opts instanceof Object) {
		var id = opts.target;
		if (!id) {
			id = opts.source;
		}
		if (!id) {
			console.log("Error: source ID for Humdrum element required in options");
			return;
		}
		entry = this.entries[id];
		if (!entry) {
			entry = this.createEntry(id, opts);
		}
		// copy input options into existing entry's option (in case of updates in
		// options).  This is only adding options, but there should probably be a way
		// of removing unwanted options as well...
		for (property in opts) {
			entry.options[property] = opts[property];
		}
	}

	if (!entry) {
		console.log("Error: cannot create notation for", opts);
	}

	var sourceid = entry.options["source"];
	if (!sourceid) {
		console.log("Error: Missing Humdrum data source ID:", sourceid, "in options", opts);
		return;
	}
	var source = document.querySelector("#" + sourceid);
	if (!source) {
		console.log("Error: Humdrum source location " +
				sourceid + " cannot be found.");
		return;
	}

	if (entry.options.hasOwnProperty("uri")) {
		this.downloadUriAndDisplay(entry.baseId);
	} else if (entry.options.hasOwnProperty("url")) {
		this.downloadUrlAndDisplay(entry.baseId);
	} else {
		if (entry._timer) {
			clearTimeout(entry._timer);
		}
		entry._timer = setTimeout(function() {
			entry.copyContentToContainer();
			HNP.displayHumdrumSvg(entry.baseId)
		}, 100);
	}
};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::downloadUriAndDisplay --
//

HumdrumNotationPluginDatabase.prototype.downloadUriAndDisplay = function (baseid) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: Cannot find entry for URI download:", baseid);
		return;
	}

	if (entry.options.uri) {
		entry.options.processedUri = entry.options.uri;
		delete entry.options.uri;
	} else {
		console.log("Warning: No URL to download data from, presuming already downloaded", entry);
		displayHumdrumNow(entry.baseId);
		return;
	}

	var uri = entry.options.processedUri;
	var url = "";
	if (uri.match(/^(g|gh|github):\/\//i)) {
		url = this.makeUrlGithub(uri);
	} else if (uri.match(/^(h|hum|humdrum):\/\//i)) {
		url = this.makeUrlHumdrum(uri);
	} else if (uri.match(/^(j|jrp):\/\//i)) {
		url = this.makeUrlJrp(uri);
	} else if (uri.match(/^(nifc):\/\//i)) {
		url = this.makeUrlNifc(uri);
	} else if (uri.match(/^(https?):\/\//i)) {
		url = uri;
	} else {
		// Assume local file URL:
		url = uri;
	}
	if (url) {
		entry.options.url = url;
		this.downloadUrlAndDisplay(baseid);
	} else {
		console.log("Warning: No URL for URI:", uri);
	}
}



//////////////////////////////
//
// HumdrumNotationPluginDatabase::downloadUrlAndDisplay --
//

HumdrumNotationPluginDatabase.prototype.downloadUrlAndDisplay = function (baseid) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: Cannot find entry for URL download:", baseid);
		return;
	}

	if (entry.options.url) {
		entry.options.processedUrl = entry.options.url;
		delete entry.options.url;
	} else {
		console.log("Warning: No URL to download data from, presuming already downloaded", entry);
		displayHumdrumNow(entry.baseId);
		return;
	}

	var source = document.querySelector("#" + baseid);
	if (!source) {
		console.log("Error: no element for ID", baseid);
		return;
	}

	// download from url, otherwise try urlFallback:
	downloadHumdrumUrlData(source, entry.options);

};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::getEmbeddedOptions --
//

HumdrumNotationPluginDatabase.prototype.getEmbeddedOptions = function (humdrumfile) {
	var lines = humdrumfile.match(/[^\r\n]+/g);
	var output = {};
	for (var i=0; i<lines.length; i++) {
		if (!lines[i].match(/^!!!/)) {
			continue;
		}
		var matches = lines[i].match(/^!!!hnp-option\s*:\s*([^\s:]+)\s*:\s*(.*)\s*$/);
		if (matches) {
			var option = matches[1];
			var value = matches[2];
			output[option] = value;
		}
	}
	return output;
};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::displayHumdrumSvg -- Add default settings to
//     options and then render and show the Humdrum data as an SVG image on the page.
//

HumdrumNotationPluginDatabase.prototype.displayHumdrumSvg = function (baseid) {
	var that2 = this;
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: Notation entry is not defined for ID:", baseid);
		return;
	}

	if (!entry.toolkit) {
		// search for the verovio toolkit if not explicitly specified
		
		if (typeof vrvWorker !== "undefined") {
			entry.toolkit = vrvWorker;
		}
		
	}
	var toolkit = entry.toolkit;
	var sourcetext = entry.humdrum.textContent.trim();
	if (sourcetext.match(/^\s*$/)) {
		if (entry.options.errorScore) {
			var errorscore = document.querySelector("#" + entry.options.errorScore);
			if (errorscore) {
				sourcetext = errorscore.textContent.trim();
			} else {
				console.log("Error: No humdrum content in", entry.humdrum);
				console.log("For ID", baseid, "ENTRY:", entry);
				return;
			}
		} else if (this.errorScore) {
			sourcetext = this.errorScore;
			console.log("Error: No humdrum content in", entry.humdrum);
			console.log("For ID", baseid, "ENTRY:", entry);
		}
	}

	// Cannot display an empty score, since this will cause verovio to display the
	// previously prepared score.
	if (sourcetext.match(/^\s*$/)) {
		
		//console.log("Error: No humdrum content in", entry.humdrum);
		//console.log("For ID", baseid, "ENTRY:", entry);
		// Sleep for a while and try again.
		// This is now necessary since verovio
		// is in a separate thread, and data being
		// converted from MusicXML or MEI may not
		// yet be ready (it will be converted into Humdrum
		// data which this function is waiting for).
		// Maybe later change this function to be called
		// after the MusicXML/MEI data has been converted.
		// Maybe have a counter to limit the waiting time.
		var that = this;
		setTimeout(function() {
			that.displayHumdrumSvg(baseid);
		}, 100)
		
		return;
	}

	var preventRendering = false;
	if (entry.options.suppressSvg) {
		preventRendering = true;
		// Maybe set entry.options.suppressSvg to false here.

		entry.container.style.display = "none";
		entry.options._processedSuppressSvg = entry.options.suppressSvg;
		delete entry.options.suppressSvg;
		entry.container.style.display = "none";
		return;
	} else {
		entry.container.style.display = "block";
	}

	var pluginOptions = this.getEmbeddedOptions(sourcetext);
	for (var property in entry.options) {
		if (!entry.options.hasOwnProperty(property)) {
			// not a real property of object
			continue;
		}
		pluginOptions[property] = entry.options[property];
	}

	var vrvOptions = this.extractVerovioOptions(baseid, pluginOptions);
	vrvOptions = this.insertDefaultOptions(baseid, vrvOptions);

	sourcetext += "\n" + getFilters(pluginOptions);

	if (pluginOptions.appendText) {
		var text = pluginOptions.appendText;
		if (Array.isArray(text)) {
			for (var i=0; i<text.length; i++) {
				if (typeof text[i] === "string" || text[i] instanceof String) {
					sourcetext += "\n" + text.trim()
				}
			}
		} else if (typeof text === "string" || text instanceof String) {
			sourcetext += "\n" + text.trim()
		}
	}

	if (pluginOptions.prepareData) {
		try {
			sourcetext = pluginOptions.prepareData(baseid, sourcetext);
		} catch (error) {
			sourcetext = executeFunctionByName(pluginOptions.prepareData, window, [baseid, sourcetext]);
		}
	}

	
	vrvWorker.resetOptions();
	vrvWorker.renderData(vrvOptions, sourcetext)
	.then(function(svg) {
		entry.svg.innerHTML = svg;
		// clear the height styling which may have been given as a placeholder:
		entry.container.style.height = "";

		if (pluginOptions.postFunction) {
			// Need to run a function after the image has been created or redrawn
			try {
				pluginOptions.postFunction(baseid, that2);
			} catch (error) {
				executeFunctionByName(pluginOptions.postFunction, window, [baseid, that2]);
			}
			pluginOptions._processedPostFunction = pluginOptions.postFunction;
			delete pluginOptions.postFunction;
		}
		pluginOptions._currentPageWidth = vrvOptions.pageWidth;

		processHtml(that2.entries[baseid]);

		// Update stored options
		var autoresize = pluginOptions.autoResize === "true" ||
	                 	pluginOptions.autoResize === true ||
	                 	pluginOptions.autoResize === 1;

		if (autoresize && !pluginOptions._autoResizeInitialize) {
			// need to inialize a resize callback for this image.
			pluginOptions._autoResizeInitialize = true;
			var aridelement = entry.container.parentNode;

			if (aridelement && (!entry._resizeObserver || entry._resizeCallback)) {
				try {

					var _debounce = function(ms, fn) {
  						return function() {
							if (entry._timer) {
    							clearTimeout(entry._timer);
							}
    						var args = Array.prototype.slice.call(arguments);
    						args.unshift(this);
    						entry._timer = setTimeout(fn.bind.apply(fn, args), ms);
  						};
					};

					entry._resizeObserver = new ResizeObserver(_debounce(500, function(event) {
						(function(bid) {
							displayHumdrum(bid);
						})(baseid);
					}));
					entry._resizeObserver.observe(aridelement);

				} catch (error) {

					// ResizeObserver is not present for this browser, use setInterval instead.
					var refreshRate = 250; // milliseconds
					entry._resizeCallback = setInterval(function() {
						(function(bid) {
							checkParentResize(bid);
						})(baseid)
					}, refreshRate);

				}
			} else if (!aridelement) {
				window.addEventListener("resize", function(event) {
					(function(bid) {
						displayHumdrum(bid);
					})(baseid);
				});
			}
		}
	})
	.catch((message) => {
		console.log("PROBLEM RENDERING DATA WITH VEROVIO WORKER, ERROR:", message);
	})
	.then(function() {
		vrvWorker.getHumdrum()
		.then(function(humdrumdata) {
			this.humdrumOutput
			entry.humdrumOutput = humdrumdata;
			if (pluginOptions.postFunctionHumdrum) {
				// Need to run a function after the image has been created or redrawn
				try {
					pluginOptions.postFunctionHumdrum(entry.humdrumOutput, baseid, that2);
				} catch (error) {
					executeFunctionByName(pluginOptions.postFunctionHumdrum, window, [entry.humdrumOutput, baseid, that2]);
				}
				pluginOptions._processedPostFunction = pluginOptions.postFunctionHumdrum;
				delete pluginOptions.postFunctionHumdrum;
			}

		});
	});
	
};



//////////////////////////////
//
// HumdrumNotationPluginEntry::insertDefaultOptions --
//

HumdrumNotationPluginDatabase.prototype.insertDefaultOptions = function (baseid, vrvOptions) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: need an entry for baseid:", baseid);
		return vrvOptions;
	}
	if (entry.options.header === "true" ||
       entry.options.header === true ||
       entry.options.header === 1) {
		vrvOptions.header = "encoded";
	}

	if (!vrvOptions.hasOwnProperty("scale")) {
		// scale must be set before automatic pageWidth calculations
		vrvOptions.scale = 40;
	}

	if (!vrvOptions.hasOwnProperty("pageMarginTop")) {
		vrvOptions.pageMarginTop = 100;
	}

	if (!vrvOptions.hasOwnProperty("justifyVertically")) {
		vrvOptions.justifyVertically = 0;
	}

	if (!vrvOptions.pageWidth) {
		// set the width of the notation automatically to the width of the parent element
		var style = window.getComputedStyle(entry.container, null);
		var width = parseInt(style.getPropertyValue("width"));
		vrvOptions.pageWidth = width;
		if (vrvOptions.scale) {
			vrvOptions.pageWidth /= (parseInt(vrvOptions.scale)/100.0);
		}
	}

	if (!vrvOptions.hasOwnProperty("pageHeight")) {
		vrvOptions.pageHeight = 60000;
	}
	if (entry.options.incipit === "true" ||
       entry.options.incipit === 1 ||
		 entry.options.incipit === true) {
		vrvOptions.pageHeight = 100;
	}

	if (!vrvOptions.hasOwnProperty("staffLineWidth")) {
		vrvOptions.staffLineWidth = 0.12;
	}
	if (!vrvOptions.hasOwnProperty("barLineWidth")) {
		vrvOptions.barLineWidth = 0.12;
	}
	if (!vrvOptions.hasOwnProperty("Inputfrom")) {
		vrvOptions.inputFrom = "auto";
	}
	if (!vrvOptions.hasOwnProperty("Inputfrom")) {
		vrvOptions.inputFrom = "auto";
	}
	if (vrvOptions.hasOwnProperty("from")) {
		vrvOptions.inputFrom = vrvOptions.from;
		delete vrvOptions.from;
	}

	// Need to superimpose default options since verovio will keep old
	// options persistent from previously generated examples.
	if (this.verovioOptions) {
		for (var i=0; i<this.verovioOptions.OPTION.length; i++) {
			var option = this.verovioOptions.OPTION[i];
			var name = option.NAME;
			if (option.CLI_ONLY === "true" ||
			    option.CLI_ONLY === true ||
				 option.CLI_ONLY === 1) {
				continue;
			}
			if (vrvOptions.hasOwnProperty(name)) {
				// Option is already set, so do not give a default.
				// Probably check if it is in valid range here, though.
				continue;
			}
			// Ignore previously dealt-with options:
			if (name === "scale")          { continue; }
			if (name === "pageWidth")      { continue; }
			if (name === "pageHeight")     { continue; }
			if (name === "staffLineWidth") { continue; }
			if (name === "barLineWidth")   { continue; }
			if (name === "inputFrom")      { continue; }
			if (name === "from")           { continue; }

			// Fill in default values for parameters that are not set:
			if ((option.ARG === "integer") && (typeof option.DEF !== 'undefined')) {
				vrvOptions[name] = parseInt(option.DEF);
			} else if ((option.ARG === "float") && (typeof option.DEF !== 'undefined')) {
				vrvOptions[name] = parseFloat(option.DEF);
			}
			// Maybe add string and boolean options here.

		}
	}

	// Deal with default options for boolean and string cases:
	if (!vrvOptions.hasOwnProperty("adjustPageHeight")) {
		vrvOptions.adjustPageHeight = 1;
	}
	if (!vrvOptions.hasOwnProperty("breaks")) {
		vrvOptions.breaks = "auto";
	}
	if (!vrvOptions.hasOwnProperty("font")) {
		vrvOptions.font = "Leipzig";
	}
	if (!vrvOptions.hasOwnProperty("humType")) {
		vrvOptions.humType = 1;
	}
	if (!vrvOptions.hasOwnProperty("footer")) {
		vrvOptions.footer = "none";
	}
	if (!vrvOptions.hasOwnProperty("header")) {
		vrvOptions.header = "none";
	}

	return vrvOptions;
};



//////////////////////////////
//
// HumdrumNotationPluginDatabase::extractVerovioOptions -- Extract all of the verovio options
//   from the Humdrum plugin options object.
//

HumdrumNotationPluginDatabase.prototype.extractVerovioOptions = function (baseid, opts) {
	var entry = this.entries[baseid];
	if (!entry) {
		console.log("Error: Need entry for creating verovio options:", baseid);
		return;
	}

	var output = {};

	if (!opts) {
		opts = entry.options;
	}

	if (opts.scale) {
		var scale = parseFloat(opts.scale);
		if (scale < 0.0) {
			scale = -scale;
		}
		if (scale <= 1.0) {
			scale = 100.0 * scale;
		}
		output.scale = scale;
	}

	for (var property in opts) {
		if (property === "scale") {
			// scale option handled above
			continue;
		}
		if (typeof this.verovioOptions[property] === 'undefined') {
			// not a verovio option
			continue;
		}
		// Do error-checking of prameters here.
		output[property] = opts[property];
	}

	return output;
}



//////////////////////////////
//
// HumdrumNotationPluginDatabase::makeUrlGithub --
//

HumdrumNotationPluginDatabase.prototype.makeUrlGithub = function (uri, opts) {
	var url = uri;
	var matches = uri.match(/^(g|gh|github):\/\/([^\/]+)\/([^\/]+)\/(.*)\s*$/);
	if (matches) {
		var account = matches[2];
		var repo    = matches[3];
		var file    = matches[4];
		var variant;
		if (opts && opts.commitHash && (typeof opts.commitHash === "string" || text instanceof String)) {
			variant = opts.commitHash;
		} else {
			variant = "master";
		}
		url = "https://raw.githubusercontent.com/" + account + "/" + repo + "/" + variant + "/" + file;
	}
	return url;
};



///////////////////////////////
//
// HumdrumNotationPluginDatabase::makeUrlHumdrum -- Convert a (kernScores) Humdrum URI into a URL.
//

HumdrumNotationPluginDatabase.prototype.makeUrlHumdrum = function (uri, opts) {
	var url = uri;
	var matches = uri.match(/^(h|hum|humdrum):\/\/(.*)\s*$/);
	if (matches) {
		url = "https://kern.humdrum.org/data?s=" + matches[2];
	}
	return url;
}



///////////////////////////////
//
// HumdrumNotationPluginDatabase::makeUrlJrp -- Convert a (kernScores) JRP URI into a URL.
//

HumdrumNotationPluginDatabase.prototype.makeUrlJrp = function (uri, opts) {
	var url = uri;
	var composerid;
	var jrpid;
	var filename;
	var composerid;
	var matches = uri.match(/^(j|jrp):\/\/([a-z]{3})(\d{4}[a-z]*)-?(.*)$\s*$/i);
	if (matches) {
		composerid = matches[2].toLowerCase();
		composerid = composerid.charAt(0).toUpperCase() + composerid.substr(1);
		jrpid = composerid + matches[3].toLowerCase();
		filename = matches[4];
		if (filename) {
			jrpid += "-" + filename;
		}
		url = "https://jrp.ccarh.org/cgi-bin/jrp?a=humdrum&f=" + jrpid;
	}
	return url;
}



///////////////////////////////
//
// HumdrumNotationPluginDatabase::makeUrlNifc -- Convert a NIFC URI into a URL.
//

HumdrumNotationPluginDatabase.prototype.makeUrlNifc = function (uri, opts) {
	var url = uri;
	var matches = uri.match(/^(?:nifc):\/\/(.*)$/i);
	if (matches) {
		var filename = matches[1];
		url = "https://humdrum.nifc.pl/" + filename;
	}
	return url;
}





//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/ReferenceRecords.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
//	This file contains the ReferenceRecord class for 
// the Humdrum notation plugin.  This class is used by
// the ReferenceRecords class to store a particular
// reference record.
//


//////////////////////////////
//
// ReferenceRecords::initializer --
//

function ReferenceRecord(lineindex, linetext) {
	clear();
	setLineIndex(lineindex);
	setLineText(linetext);
	return this;
}



//////////////////////////////
//
// ReferenceRecords::clear --
//

ReferenceRecord.prototype.clear = function () {
	this.line         = -1;  // line index: offset from 0 for first line in file.
	this.text         = "";
	clearParsedData();
	return this;
}



//////////////////////////////
//
// ReferenceRecords::clearParsedData --
//

ReferenceRecord.prototype.clearParsedData = function () {
	this.key          = "";
	this.keyBase      = "";
	this.keyAt        = "";
	this.keyVariant   = "";
	this.keyCount     = "";
	this.value        = "";
	return this;
};



//////////////////////////////
//
// ReferenceRecords::setLineIndex --
//
ReferenceRecord.prototype.setLineIndex = function (lineindex) {
	try {
		this.line = parseInt(lineindex);
	} catch (error) {
		this.line = -1;
	}
	return this;
};



//////////////////////////////
//
// ReferenceRecords::setLineText --
//

ReferenceRecord.prototype.setLineText = function (linetext) {
	if (typeof linetext === "string" || linetext instanceof String) {
		this.text = linetext;
		parseTextLine();
	} else {
		clear();
	}
	return this;
}



//////////////////////////////
//
// ReferenceRecords::parseTextLine --
//

ReferenceRecord.prototype.parseTextLine = function () {
	// this.key          = The complete reference key.
	// this.keyBase      = The reference key without langauge, count or variant qualifiers.
	// this.keyAt        = The language qualification, including the @ signs.
	// this.keyVariant = The variant qualification (a dash followed by text).
	// this.keyCount     = A Number following a keyBase, before keyAt or keyQual.
	clearParsedData();
	var matches = text.match(/^!!![^!:]+\s*:\s*(.*)\s*$/);
	if (matches) {
		this.keyBase = matches[1];
		this.key     = matches[1];
		this.value   = matches[2];
	}
	matches = this.keyBase.match(/^([^@]+)(@+.*)$/);
	if (matches) {
		this.keyBase = matches[1];
		this.keyAt = matches[2];
	}
	matches = this.keyBase.match(/^([^-]+)-(.+)$/);
	if (matches) {
		this.keyBase    = matches[1];
		this.keyVariant = matches[2];
	}
	// order of language and variant is not defined (so allow either to be first).
	matches = this.keyAt.match(/^([^-]+)-(.+)$/);
	if (matches) {
		this.keyAt      = matches[1];
		this.keyVariant = matches[2];
	}
	return this;
}




//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Sun Dec 23 01:47:54 EST 2018
// Last Modified: Sun Dec 23 01:47:57 EST 2018
// Filename:      _includes/code/ReferenceRecords.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
//	This file contains the ReferenceRecords class for 
// the Humdrum notation plugin.  This class is used to access
// the reference records in a Humdrum file.
//


//////////////////////////////
//
// ReferenceRecords::initializer --
//

function ReferenceRecords(humdrumfile) {
	this.sequence = [];  // The order that the Humdrum records are found in the file
	this.database = {};  // Hash of the records by ReferenceRecord::keyBase
	parseReferenceRecords(humdrumfile);
	return this;
}



//////////////////////////////
//
// ReferenceRecords::parseReferenceRecords --
//

ReferenceRecords.prototype.parseReferenceRecords = function (humdrumfile) {
	var lines = [];
	if (typeof linetext === "string" || linetext instanceof String) {
		lines = humdrumfile.match(/[^\r\n]+/g);
	} else if (Object.prototype.toString.call(humdrumfile) === '[object Array]') {
		if (humdrumfile[0] === "string" || humdrumfile[0] instanceof String) {
			line = humdrumfile;
		}
	} else {
		// check if an HTML element and load text from there.
		var ishtml = false;
  		try {
			ishtml = obj instanceof HTMLElement ? true : false;
  		}
  		catch(e){
    		//Browsers not supporting W3 DOM2 don't have HTMLElement and
    		//an exception is thrown and we end up here. Testing some
    		//properties that all elements have (works on IE7)
    		if ((typeof obj === "object") &&
      			(obj.nodeType === 1) && (typeof obj.style === "object") &&
      			(typeof obj.ownerDocument ==="object")) {
				ishtml = true;
			}
		}
		if (ishtml) {
			lines = humdrumfile.innerHTML.match(/[^\r\n]+/g);
		}
	}
	for (i=0; i<lines.length; i++) {
		if (!lines[i].match(/^!!![^!:]/)) {
			var record = new HumdrumRecord(i, lines[i]);
			this.sequence.push(record);
			var key = record.keyBase;
			if (!this.database[key]) {
				this.database[key] = [ record ];
			} else {
				this.database[key].push(record);
			}
		}
	}
	return this;
}



//////////////////////////////
//
// ReferenceRecords::getReferenceFirst -- Get the first reference record
//    which matches the given key.  This function will ignore qualifiers,
//    counts or variants on the key (KEY2 will map to KEY, KEY@@LANG will map
//    to KEY, KEY-variant will map to KEY).
//

ReferenceRecords.prototype.getReferenceFirst = function (keyBase) {
	// return the first keyBase record
	var items  = this.database[keyBase];
	if (!items) {
		return "";
	} else if (items.length > 0) {
		return items[0];
	} else {
		return "";
	}
}



//////////////////////////////
//
// ReferenceRecords::getReferenceAll -- Get all reference records that match to key.
//

ReferenceRecords.prototype.getReferenceAll = function (keyBase) {
	// if keyBase is empty, then return all records:
	if (!keyBase) {
		return this.sequence;
	}
	// return all keyBase records
	var items  = this.database[keyBase];
	if (!items) {
		return [];
	} else if (items.length > 0) {
		return items[0];
	} else {
		return [];
	}
}



//////////////////////////////
//
// ReferenceRecords::getReferenceFirstExact -- 
//

ReferenceRecords.prototype.getReferenceFirstExact = function (key) {
	// return first matching key record
	var list = getReferenceAll(key)
	for (var i=0; i<list.length; i++) {
		if (list[i].key === key) {
			return list[i];
		}
	}
	return "";
}



//////////////////////////////
//
// ReferenceRecords::getReferenceAllExact -- 
//

ReferenceRecords.prototype.getReferenceAllExact = function (key) {
	// return all matching key record
	var list = getReferenceAll(key)
	var output = [];
	for (var i=0; i<list.length; i++) {
		if (list[i].key === key) {
			output.push(list[i]);
		}
	}
	return output;
}






	// vim: ts=3
// This is the Web Worker interface for the verovio toolkit.  These functions are
// interfaced through the verovio-calls.js functions.
//


//////////////////////////////
//
// vrvInterface::vrvInterface --
//

function vrvInterface(use_worker, onReady) {
	this.WIDTH = 0;
	this.HEIGHT = 0;
	this.page = 1;
	this.pageCount = 0;
	this.options = {};

	this.initialized = false;
	this.usingWorker = use_worker;

	if (use_worker) {
		this.createWorkerInterface(onReady);
	} else {
		this.createDefaultInterface(onReady);
	};
}



//////////////////////////////
//
// vrvInterface::createWorkerInterface --
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
					if (vrv.promises[vrv.resolvedIdx].method === "renderData") {
						vrv.renderDataPending--;
						if (vrv.renderDataPending === 0) vrv.handleWaitingRenderData();
					};
					delete vrv.promises[vrv.resolvedIdx];
					vrv.resolvedIdx++;
				};
		};
	};

	console.log("creating verovio worker interface");
	this.promises = {};
	this.promiseIdx = 0;
	this.resolvedIdx = 0;
	this.renderDataPending = 0;
	this.renderDataWaiting = null;

	// var workerUrl = "https://verovio-script.humdrum.org/scripts/verovio-worker.js";
	var workerUrl = "/scripts/local/verovio-worker.js";
	console.log("LOADING", workerUrl);
	this.worker = null;
	var that = this;
	try {
		that.worker = new Worker(workerUrl);
		that.worker.addEventListener("message", handleEvent);

		that.worker.onerror = function (event) {
			event.preventDefault();
			that.worker = createWorkerFallback(workerUrl);
			that.worker.addEventListener("message", handleEvent);
		};
	} catch (e) {
		that.worker = createWorkerFallback(workerUrl);
		that.worker.addEventListener("message", handleEvent);
	}
};



//////////////////////////////
//
// createWorkerFallback -- Cross-origin worker
//

function createWorkerFallback(workerUrl) {
	console.log("Getting cross-origin worker");
	var worker = null;
	try {
		var blob;
		try {
			blob = new Blob(["importScripts('" + workerUrl + "');"], { "type": 'application/javascript' });
		} catch (e) {
			var blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
			blobBuilder.append("importScripts('" + workerUrl + "');");
			blob = blobBuilder.getBlob('application/javascript');
		}
		var url = window.URL || window.webkitURL;
		var blobUrl = url.createObjectURL(blob);
		worker = new Worker(blobUrl);
	} catch (e1) {
		//if it still fails, there is nothing much we can do
	}
	return worker;
}



//////////////////////////////
//
// vrvInterface::createDefaultInterface --
//

vrvInterface.prototype.createDefaultInterface = function (onReady) {

/*  No longer needed?


	var url = 'https://verovio-script.humdrum.org/scripts/verovio-toolkit.js';


	console.log("create default interface")
	var vrv = this;
	this.verovio = new verovioCalls();

	var script = document.createEleent('script');
	script.onload = function () {
		vrv.verovio.vrvToolkit = new verovio.toolkit();
		vrv.initialized = true;
		onReady();
	};
	script.src = url;
	document.head.appendChild(script);

/* verovio toolkit is larger than allowed by localStorage (5 MB limit), so 
 * using basket to store it between sessions is not useful to use:

	basket
	.require(
		{url: url, expire: 500, unique: BasketVersion}
		// loaded as an include:
		// {url: "scripts/ace/humdrumValidator.js", skipCache: true}
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
*/




};



//////////////////////////////
//
// vrvInterface::checkInitialized --
//

vrvInterface.prototype.checkInitialized = function () {
	if (!this.initialized) throw("Verovio toolkit not (yet) initialized");
};



//////////////////////////////
//
// vrvInterface::filterData --
//

vrvInterface.prototype.filterData = function (opts, data, type) {
	// Don't store options when filtering data.
	return this.execute("filterData", arguments);
};



//////////////////////////////
//
// vrvInterface::renderData --
//

vrvInterface.prototype.renderData = function (opts, data, page) {
	// console.log("%cvrvInterface.renderData", "color: #aa8800; font-weight: bold");
	this.options = opts;
	return this.execute("renderData", arguments);
};



//////////////////////////////
//
// vrvInterface::resetOptions -- Clear old option settings
//

vrvInterface.prototype.resetOptions = function () {
	return this.execute("resetOptions", arguments);
};



//////////////////////////////
//
// vrvInterface::getHumdrum --
//

vrvInterface.prototype.getHumdrum = function () {
	// console.log("%cvrvInterface.getHumdrum", "color: #aa8800; font-weight: bold");
	var value = this.execute("getHumdrum", arguments);
	return value;
};



//////////////////////////////
//
// vrvInterface::redoLayout --
//

vrvInterface.prototype.redoLayout = function (opts, redo, measure) {
	// console.log("%cvrvInterface.redoLayout", "color: #8800aa; font-weight: bold");
	this.options = opts;
	return this.execute("redoLayout", arguments);
};



//////////////////////////////
//
// vrvInterface::renderPage --
//

vrvInterface.prototype.renderPage = function (page) {
	return this.execute("renderPage", arguments);
};



//////////////////////////////
//
// vrvInterface::renderAllPages --
//

vrvInterface.prototype.renderAllPages = function (data, opts) {
	return this.execute("renderAllPages", arguments);
};



//////////////////////////////
//
// vrvInterface::gotoPage --
//

vrvInterface.prototype.gotoPage = function (page) {
	var vrv = this;
	return this.execute("gotoPage", arguments)
	.then(function (obj) {
		vrv.page = obj.page;
		vrv.pageCount = obj.pageCount;
		return page;
	});
};



//////////////////////////////
//
// vrvInterface::getMEI --
//

vrvInterface.prototype.getMEI = function (page) {
	return this.execute("getMEI", arguments);
};



//////////////////////////////
//
// vrvInterface::renderToMidi --
//

vrvInterface.prototype.renderToMidi = function () {
	var value = this.execute("renderToMidi", arguments);
	return value;
};



//////////////////////////////
//
// vrvInterface::renderToTimemap --
//

vrvInterface.prototype.renderToTimemap = function () {
	// console.log("%cvrvInterface.renderToTimemap", "color: #aa8800; font-weight: bold");
	let result = this.execute("renderToTimemap", arguments);
	return result;
};



//////////////////////////////
//
// vrvInterface::getElementsAtTime --
//

vrvInterface.prototype.getElementsAtTime = function (vrvTime) {
	return this.execute("getElementsAtTime", arguments);
};



//////////////////////////////
//
// vrvInterface::getTimeForElement --
//

vrvInterface.prototype.getTimeForElement = function (id) {
	return this.execute("getTimeForElement", arguments);
};



//////////////////////////////
//
// vrvInterface::execute --
//

vrvInterface.prototype.execute = function (method, args) {
	var vrv = this;
	if (this.usingWorker) {
		var arr = Array.prototype.slice.call(args);
		switch(method) {
			case "renderData":
				return vrv.postRenderData(method, arr);
			default:
				vrv.handleWaitingRenderData();
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
// vrvInterface::handleWaitingRenderData --
//

vrvInterface.prototype.handleWaitingRenderData = function () {
	if (this.renderDataWaiting) {
		this.postDeferredMessage("renderData",
				this.renderDataWaiting.args,
				this.renderDataWaiting.deferred);
		this.renderDataWaiting = null;
		this.renderDataPending++;
	};
};



//////////////////////////////
//
// vrvInterface::postRenderData --
//

vrvInterface.prototype.postRenderData = function (method, args) {
	// squash pending renderings:
	if (this.renderDataPending > 0) {
		if (!this.renderDataWaiting) {
			this.renderDataWaiting = {
				deferred: new RSVP.defer(),
			};
		};
		this.renderDataWaiting.args = args;
		return this.renderDataWaiting.deferred.promise;
	} else {
		this.renderDataPending++;
		this.renderDataWaiting = null;
		return this.post(method, args);
	};
};



//////////////////////////////
//
// vrvInterface::post --
//

vrvInterface.prototype.post = function (method, args) {
	return this.postDeferredMessage(method, args, new RSVP.defer());
};



//////////////////////////////
//
// vrvInterface::postDeferredMessage --
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




	/*!
* basket.js
* v0.5.2 - 2015-02-07
* http://addyosmani.github.com/basket.js
* (c) Addy Osmani;  License
* Created by: Addy Osmani, Sindre Sorhus, Andrée Hansson, Mat Scales
* Contributors: Ironsjp, Mathias Bynens, Rick Waldron, Felipe Morais
* Uses rsvp.js, https://github.com/tildeio/rsvp.js
*/
(function(){"use strict";function a(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1}function b(a){var b=a._promiseCallbacks;return b||(b=a._promiseCallbacks={}),b}function c(a,b){return"onerror"===a?void rb.on("error",b):2!==arguments.length?rb[a]:void(rb[a]=b)}function d(a){return"function"==typeof a||"object"==typeof a&&null!==a}function e(a){return"function"==typeof a}function f(a){return"object"==typeof a&&null!==a}function g(){}function h(){setTimeout(function(){for(var a,b=0;b<wb.length;b++){a=wb[b];var c=a.payload;c.guid=c.key+c.id,c.childGuid=c.key+c.childId,c.error&&(c.stack=c.error.stack),rb.trigger(a.name,a.payload)}wb.length=0},50)}function i(a,b,c){1===wb.push({name:a,payload:{key:b._guidKey,id:b._id,eventName:a,detail:b._result,childId:c&&c._id,label:b._label,timeStamp:ub(),error:rb["instrument-with-stack"]?new Error(b._label):null}})&&h()}function j(){return new TypeError("A promises callback cannot return that same promise.")}function k(){}function l(a){try{return a.then}catch(b){return Bb.error=b,Bb}}function m(a,b,c,d){try{a.call(b,c,d)}catch(e){return e}}function n(a,b,c){rb.async(function(a){var d=!1,e=m(c,b,function(c){d||(d=!0,b!==c?q(a,c):s(a,c))},function(b){d||(d=!0,t(a,b))},"Settle: "+(a._label||" unknown promise"));!d&&e&&(d=!0,t(a,e))},a)}function o(a,b){b._state===zb?s(a,b._result):b._state===Ab?(b._onError=null,t(a,b._result)):u(b,void 0,function(c){b!==c?q(a,c):s(a,c)},function(b){t(a,b)})}function p(a,b){if(b.constructor===a.constructor)o(a,b);else{var c=l(b);c===Bb?t(a,Bb.error):void 0===c?s(a,b):e(c)?n(a,b,c):s(a,b)}}function q(a,b){a===b?s(a,b):d(b)?p(a,b):s(a,b)}function r(a){a._onError&&a._onError(a._result),v(a)}function s(a,b){a._state===yb&&(a._result=b,a._state=zb,0===a._subscribers.length?rb.instrument&&xb("fulfilled",a):rb.async(v,a))}function t(a,b){a._state===yb&&(a._state=Ab,a._result=b,rb.async(r,a))}function u(a,b,c,d){var e=a._subscribers,f=e.length;a._onError=null,e[f]=b,e[f+zb]=c,e[f+Ab]=d,0===f&&a._state&&rb.async(v,a)}function v(a){var b=a._subscribers,c=a._state;if(rb.instrument&&xb(c===zb?"fulfilled":"rejected",a),0!==b.length){for(var d,e,f=a._result,g=0;g<b.length;g+=3)d=b[g],e=b[g+c],d?y(c,d,e,f):e(f);a._subscribers.length=0}}function w(){this.error=null}function x(a,b){try{return a(b)}catch(c){return Cb.error=c,Cb}}function y(a,b,c,d){var f,g,h,i,k=e(c);if(k){if(f=x(c,d),f===Cb?(i=!0,g=f.error,f=null):h=!0,b===f)return void t(b,j())}else f=d,h=!0;b._state!==yb||(k&&h?q(b,f):i?t(b,g):a===zb?s(b,f):a===Ab&&t(b,f))}function z(a,b){var c=!1;try{b(function(b){c||(c=!0,q(a,b))},function(b){c||(c=!0,t(a,b))})}catch(d){t(a,d)}}function A(a,b,c){return a===zb?{state:"fulfilled",value:c}:{state:"rejected",reason:c}}function B(a,b,c,d){this._instanceConstructor=a,this.promise=new a(k,d),this._abortOnReject=c,this._validateInput(b)?(this._input=b,this.length=b.length,this._remaining=b.length,this._init(),0===this.length?s(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&s(this.promise,this._result))):t(this.promise,this._validationError())}function C(a,b){return new Db(this,a,!0,b).promise}function D(a,b){function c(a){q(f,a)}function d(a){t(f,a)}var e=this,f=new e(k,b);if(!tb(a))return t(f,new TypeError("You must pass an array to race.")),f;for(var g=a.length,h=0;f._state===yb&&g>h;h++)u(e.resolve(a[h]),void 0,c,d);return f}function E(a,b){var c=this;if(a&&"object"==typeof a&&a.constructor===c)return a;var d=new c(k,b);return q(d,a),d}function F(a,b){var c=this,d=new c(k,b);return t(d,a),d}function G(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function H(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function I(a,b){this._id=Jb++,this._label=b,this._state=void 0,this._result=void 0,this._subscribers=[],rb.instrument&&xb("created",this),k!==a&&(e(a)||G(),this instanceof I||H(),z(this,a))}function J(){this.value=void 0}function K(a){try{return a.then}catch(b){return Lb.value=b,Lb}}function L(a,b,c){try{a.apply(b,c)}catch(d){return Lb.value=d,Lb}}function M(a,b){for(var c,d,e={},f=a.length,g=new Array(f),h=0;f>h;h++)g[h]=a[h];for(d=0;d<b.length;d++)c=b[d],e[c]=g[d+1];return e}function N(a){for(var b=a.length,c=new Array(b-1),d=1;b>d;d++)c[d-1]=a[d];return c}function O(a,b){return{then:function(c,d){return a.call(b,c,d)}}}function P(a,b){var c=function(){for(var c,d=this,e=arguments.length,f=new Array(e+1),g=!1,h=0;e>h;++h){if(c=arguments[h],!g){if(g=S(c),g===Mb){var i=new Kb(k);return t(i,Mb.value),i}g&&g!==!0&&(c=O(g,c))}f[h]=c}var j=new Kb(k);return f[e]=function(a,c){a?t(j,a):void 0===b?q(j,c):b===!0?q(j,N(arguments)):tb(b)?q(j,M(arguments,b)):q(j,c)},g?R(j,f,a,d):Q(j,f,a,d)};return c.__proto__=a,c}function Q(a,b,c,d){var e=L(c,d,b);return e===Lb&&t(a,e.value),a}function R(a,b,c,d){return Kb.all(b).then(function(b){var e=L(c,d,b);return e===Lb&&t(a,e.value),a})}function S(a){return a&&"object"==typeof a?a.constructor===Kb?!0:K(a):!1}function T(a,b){return Kb.all(a,b)}function U(a,b,c){this._superConstructor(a,b,!1,c)}function V(a,b){return new U(Kb,a,b).promise}function W(a,b){return Kb.race(a,b)}function X(a,b,c){this._superConstructor(a,b,!0,c)}function Y(a,b){return new Rb(Kb,a,b).promise}function Z(a,b,c){this._superConstructor(a,b,!1,c)}function $(a,b){return new Z(Kb,a,b).promise}function _(a){throw setTimeout(function(){throw a}),a}function ab(a){var b={};return b.promise=new Kb(function(a,c){b.resolve=a,b.reject=c},a),b}function bb(a,b,c){return Kb.all(a,c).then(function(a){if(!e(b))throw new TypeError("You must pass a function as map's second argument.");for(var d=a.length,f=new Array(d),g=0;d>g;g++)f[g]=b(a[g]);return Kb.all(f,c)})}function cb(a,b){return Kb.resolve(a,b)}function db(a,b){return Kb.reject(a,b)}function eb(a,b,c){return Kb.all(a,c).then(function(a){if(!e(b))throw new TypeError("You must pass a function as filter's second argument.");for(var d=a.length,f=new Array(d),g=0;d>g;g++)f[g]=b(a[g]);return Kb.all(f,c).then(function(b){for(var c=new Array(d),e=0,f=0;d>f;f++)b[f]&&(c[e]=a[f],e++);return c.length=e,c})})}function fb(a,b){gc[_b]=a,gc[_b+1]=b,_b+=2,2===_b&&Tb()}function gb(){var a=process.nextTick,b=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);return Array.isArray(b)&&"0"===b[1]&&"10"===b[2]&&(a=setImmediate),function(){a(lb)}}function hb(){return function(){vertxNext(lb)}}function ib(){var a=0,b=new dc(lb),c=document.createTextNode("");return b.observe(c,{characterData:!0}),function(){c.data=a=++a%2}}function jb(){var a=new MessageChannel;return a.port1.onmessage=lb,function(){a.port2.postMessage(0)}}function kb(){return function(){setTimeout(lb,1)}}function lb(){for(var a=0;_b>a;a+=2){var b=gc[a],c=gc[a+1];b(c),gc[a]=void 0,gc[a+1]=void 0}_b=0}function mb(){try{var a=require("vertx");return a.runOnLoop||a.runOnContext,hb()}catch(b){return kb()}}function nb(a,b){rb.async(a,b)}function ob(){rb.on.apply(rb,arguments)}function pb(){rb.off.apply(rb,arguments)}var qb={mixin:function(a){return a.on=this.on,a.off=this.off,a.trigger=this.trigger,a._promiseCallbacks=void 0,a},on:function(c,d){var e,f=b(this);e=f[c],e||(e=f[c]=[]),-1===a(e,d)&&e.push(d)},off:function(c,d){var e,f,g=b(this);return d?(e=g[c],f=a(e,d),void(-1!==f&&e.splice(f,1))):void(g[c]=[])},trigger:function(a,c){var d,e,f=b(this);if(d=f[a])for(var g=0;g<d.length;g++)(e=d[g])(c)}},rb={instrument:!1};qb.mixin(rb);var sb;sb=Array.isArray?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)};var tb=sb,ub=Date.now||function(){return(new Date).getTime()},vb=Object.create||function(a){if(arguments.length>1)throw new Error("Second argument not supported");if("object"!=typeof a)throw new TypeError("Argument must be an object");return g.prototype=a,new g},wb=[],xb=i,yb=void 0,zb=1,Ab=2,Bb=new w,Cb=new w,Db=B;B.prototype._validateInput=function(a){return tb(a)},B.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},B.prototype._init=function(){this._result=new Array(this.length)},B.prototype._enumerate=function(){for(var a=this.length,b=this.promise,c=this._input,d=0;b._state===yb&&a>d;d++)this._eachEntry(c[d],d)},B.prototype._eachEntry=function(a,b){var c=this._instanceConstructor;f(a)?a.constructor===c&&a._state!==yb?(a._onError=null,this._settledAt(a._state,b,a._result)):this._willSettleAt(c.resolve(a),b):(this._remaining--,this._result[b]=this._makeResult(zb,b,a))},B.prototype._settledAt=function(a,b,c){var d=this.promise;d._state===yb&&(this._remaining--,this._abortOnReject&&a===Ab?t(d,c):this._result[b]=this._makeResult(a,b,c)),0===this._remaining&&s(d,this._result)},B.prototype._makeResult=function(a,b,c){return c},B.prototype._willSettleAt=function(a,b){var c=this;u(a,void 0,function(a){c._settledAt(zb,b,a)},function(a){c._settledAt(Ab,b,a)})};var Eb=C,Fb=D,Gb=E,Hb=F,Ib="rsvp_"+ub()+"-",Jb=0,Kb=I;I.cast=Gb,I.all=Eb,I.race=Fb,I.resolve=Gb,I.reject=Hb,I.prototype={constructor:I,_guidKey:Ib,_onError:function(a){rb.async(function(b){setTimeout(function(){b._onError&&rb.trigger("error",a)},0)},this)},then:function(a,b,c){var d=this,e=d._state;if(e===zb&&!a||e===Ab&&!b)return rb.instrument&&xb("chained",this,this),this;d._onError=null;var f=new this.constructor(k,c),g=d._result;if(rb.instrument&&xb("chained",d,f),e){var h=arguments[e-1];rb.async(function(){y(e,f,h,g)})}else u(d,f,a,b);return f},"catch":function(a,b){return this.then(null,a,b)},"finally":function(a,b){var c=this.constructor;return this.then(function(b){return c.resolve(a()).then(function(){return b})},function(b){return c.resolve(a()).then(function(){throw b})},b)}};var Lb=new J,Mb=new J,Nb=P,Ob=T;U.prototype=vb(Db.prototype),U.prototype._superConstructor=Db,U.prototype._makeResult=A,U.prototype._validationError=function(){return new Error("allSettled must be called with an array")};var Pb=V,Qb=W,Rb=X;X.prototype=vb(Db.prototype),X.prototype._superConstructor=Db,X.prototype._init=function(){this._result={}},X.prototype._validateInput=function(a){return a&&"object"==typeof a},X.prototype._validationError=function(){return new Error("Promise.hash must be called with an object")},X.prototype._enumerate=function(){var a=this.promise,b=this._input,c=[];for(var d in b)a._state===yb&&b.hasOwnProperty(d)&&c.push({position:d,entry:b[d]});var e=c.length;this._remaining=e;for(var f,g=0;a._state===yb&&e>g;g++)f=c[g],this._eachEntry(f.entry,f.position)};var Sb=Y;Z.prototype=vb(Rb.prototype),Z.prototype._superConstructor=Db,Z.prototype._makeResult=A,Z.prototype._validationError=function(){return new Error("hashSettled must be called with an object")};var Tb,Ub=$,Vb=_,Wb=ab,Xb=bb,Yb=cb,Zb=db,$b=eb,_b=0,ac=fb,bc="undefined"!=typeof window?window:void 0,cc=bc||{},dc=cc.MutationObserver||cc.WebKitMutationObserver,ec="undefined"!=typeof process&&"[object process]"==={}.toString.call(process),fc="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,gc=new Array(1e3);if(Tb=ec?gb():dc?ib():fc?jb():void 0===bc&&"function"==typeof require?mb():kb(),rb.async=ac,"undefined"!=typeof window&&"object"==typeof window.__PROMISE_INSTRUMENTATION__){var hc=window.__PROMISE_INSTRUMENTATION__;c("instrument",!0);for(var ic in hc)hc.hasOwnProperty(ic)&&ob(ic,hc[ic])}var jc={race:Qb,Promise:Kb,allSettled:Pb,hash:Sb,hashSettled:Ub,denodeify:Nb,on:ob,off:pb,map:Xb,filter:$b,resolve:Yb,reject:Zb,all:Ob,rethrow:Vb,defer:Wb,EventTarget:qb,configure:c,async:nb};"function"==typeof define&&define.amd?define(function(){return jc}):"undefined"!=typeof module&&module.exports?module.exports=jc:"undefined"!=typeof this&&(this.RSVP=jc)}).call(this),function(a,b){"use strict";var c=b.head||b.getElementsByTagName("head")[0],d="basket-",e=5e3,f=[],g=function(a,b){try{return localStorage.setItem(d+a,JSON.stringify(b)),!0}catch(c){if(c.name.toUpperCase().indexOf("QUOTA")>=0){var e,f=[];for(e in localStorage)0===e.indexOf(d)&&f.push(JSON.parse(localStorage[e]));return f.length?(f.sort(function(a,b){return a.stamp-b.stamp}),basket.remove(f[0].key),g(a,b)):void 0}return}},h=function(a){var b=new RSVP.Promise(function(b,c){var d=new XMLHttpRequest;d.open("GET",a),d.onreadystatechange=function(){4===d.readyState&&(200===d.status||0===d.status&&d.responseText?b({content:d.responseText,type:d.getResponseHeader("content-type")}):c(new Error(d.statusText)))},setTimeout(function(){d.readyState<4&&d.abort()},basket.timeout),d.send()});return b},i=function(a){return h(a.url).then(function(b){var c=j(a,b);return a.skipCache||g(a.key,c),c})},j=function(a,b){var c=+new Date;return a.data=b.content,a.originalType=b.type,a.type=a.type||b.type,a.skipCache=a.skipCache||!1,a.stamp=c,a.expire=c+60*(a.expire||e)*60*1e3,a},k=function(a,b){return!a||a.expire-+new Date<0||b.unique!==a.unique||basket.isValidItem&&!basket.isValidItem(a,b)},l=function(a){var b,c,d;if(a.url)return a.key=a.key||a.url,b=basket.get(a.key),a.execute=a.execute!==!1,d=k(b,a),a.live||d?(a.unique&&(a.url+=(a.url.indexOf("?")>0?"&":"?")+"basket-unique="+a.unique),c=i(a),a.live&&!d&&(c=c.then(function(a){return a},function(){return b}))):(b.type=a.type||b.originalType,b.execute=a.execute,c=new RSVP.Promise(function(a){a(b)})),c},m=function(a){var d=b.createElement("script");d.defer=!0,d.text=a.data,c.appendChild(d)},n={"default":m},o=function(a){return a.type&&n[a.type]?n[a.type](a):n["default"](a)},p=function(a){return a.map(function(a){return a.execute&&o(a),a})},q=function(){var a,b,c=[];for(a=0,b=arguments.length;b>a;a++)c.push(l(arguments[a]));return RSVP.all(c)},r=function(){var a=q.apply(null,arguments),b=this.then(function(){return a}).then(p);return b.thenRequire=r,b};a.basket={require:function(){for(var a=0,b=arguments.length;b>a;a++)arguments[a].execute=arguments[a].execute!==!1,arguments[a].once&&f.indexOf(arguments[a].url)>=0?arguments[a].execute=!1:arguments[a].execute!==!1&&f.indexOf(arguments[a].url)<0&&f.push(arguments[a].url);var c=q.apply(null,arguments).then(p);return c.thenRequire=r,c},remove:function(a){return localStorage.removeItem(d+a),this},get:function(a){var b=localStorage.getItem(d+a);try{return JSON.parse(b||"false")}catch(c){return!1}},clear:function(a){var b,c,e=+new Date;for(b in localStorage)c=b.split(d)[1],c&&(!a||this.get(c).expire<=e)&&this.remove(c);return this},isValidItem:null,timeout:5e3,addHandler:function(a,b){Array.isArray(a)||(a=[a]),a.forEach(function(a){n[a]=b})},removeHandler:function(a){basket.addHandler(a,void 0)}},basket.clear(!0)}(this,document);
//# sourceMappingURL=basket.full.min.js.map


//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Fri Jan  9 11:19:47 PST 2015
// Last Modified: Thu Jan 22 21:45:50 PST 2015
// Filename:      aton.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
// Description:   AT Object Notation library.  An alternate JavaScript
//                object packing notation to JSON that allows for
//                multi-line property values.
//
// Todo:
//

'use strict';

//////////////////////////////
//
// ATON constructor -- The ATON object is used to manage options for
//    parsing of AT Notation Object strings and stringifying JavaScript
//    objects into ATON strings.
//

function ATON () {
	this.options = {};
	return this;
}



//////////////////////////////
//
// ATON.prototype.defaultOptions -- Defaults for parsing/stringifying ATON
//    strings.  Preparing for a future version of parser, currently mostly
//    inactive.
//

ATON.prototype.defaultOptions = {

	// recordTerminator: String which marks the end of each data record
	// in the incoming/outgoing data.  By default this is the newline character.
	recordTerminator: '\n',

	// metaMarker: String which marks the start of a control record, such as
	// the start/stop of an object value.  This must always occur at the
	// start of an incoming record.
	metaMarker: '@@',

	// objectBegin: The meta key used to indicate the start of a property
	// object value.  This can be an array of strings, with the first one
	// being the control parameter name for starting an object when using
	// stringify().
	objectBegin: ['BEGIN', 'START'],

	// objectEnd: The meta key used to indicate the end of a property
	// object value.  This can be an array of stings, with the first one
	// being the control parameter name for ending an object when using
	// stringify().
	objectEnd: ['END', 'STOP'],

	// commentMarker: Regular expression which indicates a comment record.
	commentMarker: '^@{5,}|^@{1,4}[^@]|^@{,4}$',

	// keyMarker: String which indicates the start of a property key/name.
	// This must always occur at the start of an incoming record.
	keyMarker: '@',

	// keyTerminator: Regular expression which indicates the separator between
	// a property key/name and the property value.
	keyTerminator: '\s*:\s*',

	// keyTerminatorOut: The string used to separate key/value pairs when
	// stringifying an object to ATON.
	keyTerminatorOut: ':\t',

	// forceKeyCase: Set the case of the property name characters.
	//   '' = do not alter case of property name characters.
	//   'lc' = force property name characters to lower case.
	//   'uc' = force property name characters to upper case.
	forceKeyCase: '',

	// forceType: When reading in an ATON file, convert property values
	// matching the given key to the given type.  The types are case
	// insensitive and globally affect all property names in any object.
	// Use "@@TYPE:key:type" records in the ATON file to locally adjust
	// the type if the conversions should not apply globally in the file.
	// Strinified ATON content only contains string types, so "@@TYPE"
	// records can be used to force the type when parsing the ATON string
	// again.  The forceType property value is an object containing
	// sub-properties indexed by a property name.  The allowed types are:
	// 	String	=	default type.
	// 	Number	=	convert to a JavaScript Number.
	//    Integer  =  convert to a JavaScript Number with parseInt().
	forceType: undefined,

   // onlyChildToRoot: If the parsed output contains a single property whose
	// value is an object, then return that property value rather than the
	// root object.  This will convert:
   //    @BEGIN:X
	//    @Y:Z
   //    @END:X
   // into '{"Y":"Z"}' rather than '{"X":{"Y":"Z"}}'
   onlyChildToRoot: false
};



//////////////////////////////
//
// ATON.prototype.getOption -- Return the value of the given option name.
//    First search this.options for the property, then if not found, try
//    the ATON.prototype.defaultOptions object.
//

ATON.prototype.getOption = function (name) {
	if ((typeof this.options === 'undefined')
			|| (this.options[name] === 'undefined')) {
		return this.defaultOptions[name];
	} else if ((typeof this.options === 'object')
			&& (typeof this.options[name] === 'undefined')) {
		return this.defaultOptions[name];
	} else {
		return this.options[name];
	}
}



//////////////////////////////
//
// ATON.prototype.setOption -- Set the value of a particular option.
//

ATON.prototype.setOption = function (name, value) {
   if (typeof this.options === 'undefined') {
			this.options = {};
	}
	this.options[name] = value;
	return this;
}

//
// Alias methods for setOption:
//

// convert all input keys into lower case.
ATON.prototype.setLCKeys = function () { this.setOption('forceKeyCase', 'lc'); return this; }
// convert all input keys into upper case.
ATON.prototype.setUCKeys = function () { this.setOption('forceKeyCase', 'uc'); return this; }
// OC = original case (don't alter case of key letters).
ATON.prototype.setOCKeys = function () { this.setOption('forceKeyCase', ''); return this; }
ATON.prototype.unsetKeyCase = function ()  { this.setOCKeys(); }

ATON.prototype.setOnlyChildRoot = function () { 
	this.setOption('onlyChildToRoot', true);
}
ATON.prototype.unsetOnlyChildRoot = function () { 
	this.setOption('onlyChildToRoot', false);
}



//////////////////////////////
//
// ATON.prototype.getOptionString -- Return the value of the given option
//    name, guaranteeing that it is a string.  If the value is an array,
//		return the first element.  If the value is undefined then return an
//    empty string.
//

ATON.prototype.getOptionString = function (name) {
	var value = this.getOption(name);
	if (typeof value === 'string') {
		return value;
	} else if (value instanceof Array) {
		return value.length ? value[0].toString() : '';
	} else if (typeof value === 'number') {
		return String(value);
	} else {
		return '';
	}
}



//////////////////////////////
//
// ATON.prototype.resetOptions --
//

ATON.prototype.resetOptions = function () {
	this.options = {};
};



//////////////////////////////
//
// ATON.prototype.parse -- parse ATON content and return the JavaScript
//   object that it describes.
//

ATON.prototype.parse = function (string) {
	var output = this.parseRecordArray(string.split(/\n/));
	if (this.getOption('onlyChildToRoot')) {
		var keys = Object.keys(output);
		if ((keys.length === 1) && (typeof output[keys[0]] === 'object')) {
			return output[keys[0]];
		}
	} 
	return output;
};



//////////////////////////////
//
// ATON.prototype._initializeParsingStateVariables -- Initalize
//    ATON string parsing variables.  This is a pseudo private member
//    of the ATON class and has no function outside of the class.
//

ATON.prototype._initializeParsingStateVariables = function () {
	return {
		action:     undefined,
		label:      undefined,
		labelbegin: undefined,
		labelend:   undefined,
		curobj:     undefined,
		curobjname: undefined,
		curkey:     undefined, // name of current property being processed
		ocurkey:    undefined, // same as curkey, but not case adjustments
		newkey:     undefined, // name of next property to be processed
		onewkey:    undefined, // same as newkey, no case adjustment
		newvalue:   undefined, // initial value of next property to be processed
		linenum:    undefined, // Current line parsing, 1-indexed.
		node:       [],        // Object parsing hierarchy.
		typer:      {},        // Database of properties to typecast.
		output:     {},         // Final output from parser.
		// options:
		keycase:    this.getOptionString('forceKeyCase')
	};
}



//////////////////////////////
//
// ATON.prototype.parseRecordArray -- Parse ATON data from a list of
//   individual records.
//

ATON.prototype.parseRecordArray = function (records) {
	if (!(records instanceof Array) || (records.length === 0) ||
			(typeof records[0] !== 'string')) {
		return {};
	}

	var parsingVariables = this._initializeParsingStateVariables();
	parsingVariables.curobj = parsingVariables.output;

	for (var i=0; i<records.length; i++) {
		parsingVariables.linenum = i+1;
		try {
			this._parseRecord(records[i], parsingVariables);
		} catch(error) {
			console.log(error);
			process.exit(1);
		}
	}

	// Remove whitespace around last property value:
	var v = parsingVariables;
	this._cleanParameter(v);

	return v.output;
};



//////////////////////////////
//
// ATON.prototype._parseRecord -- read an individual ATON record and process
//    according to the variable object given as the second parameter.  This
//    is a pseudo-private method which is only useful inside of the ATON
//    object.
//

ATON.prototype._parseRecord = function (line, v) {
	var matches;
	if (line.match(/^@{5,}|^@+\s|^@{1,4}$/)) {
		// Filter out comment lines.
		return;
	} else if ((typeof v.curkey === 'undefined') && line.match(/^[^@]|^$/)) {
		// Ignore unassociated text.
		return;
	} else if (matches = line.match(/^@@[^@ ]/)) {
		// Control message.
		// End current property.
		this._cleanParameter(v);
		v.curkey  = undefined;
		v.ocurkey = undefined;
		if (matches = line.match(/^@@(BEGIN|START)\s*:\s*(.*)\s*$/i)) {
			v.label  = matches[2];
			if (typeof v.curobj[v.label] === 'undefined') {
				// create a new object and enter into it
				v.curobj[v.label] = {};
				v.node.push({label:v.label, startline:v.linenum});
				v.curobj = v.curobj[v.label];
			} else if (v.curobj[v.label] instanceof Array) {
				// Append at end of array of objects with same v.label and
				// update the array index in the last v.node entry.
				v.curobj[v.label].push({});
				v.node.push({});
				v.node[v.node.length-1].index = v.curobj[v.label].length - 1;
				v.node[v.node.length-1].label = v.label;
				v.node[v.node.length-1].startline = v.linenum;
				v.curobj = v.curobj[v.label][v.curobj[v.label].length - 1];
			} else {
				// Single string value already exists. Convert it to an array
				// and then append new object and enter it.
				var temp = v.curobj[v.label];
				v.curobj[v.label] = [v.curobj[v.label], {}];
				v.node.push({});
				v.node[v.node.length-1].index = v.curobj[v.label].length - 1;
				v.node[v.node.length-1].label = v.label;
				v.node[v.node.length-1].startline = v.linenum;
				v.curobj = v.curobj[v.label][v.curobj[v.label].length - 1];
			}
		} else if (matches = line.match(/^@@(END|STOP)\s*:?\s*(.*)\s*$/i)) {
			// End an object, so go back to the parent.
			if (typeof v.curkey !== 'undefined') {
				// clean whitespace of last read property:
				v.curobj[v.curkey] = v.curobj[v.curkey].replace(/^\s+|\s+$/g, '');
				v.curkey = undefined;
				v.ocurkey = undefined;
			}
			v.action     = matches[1];
			v.labelend   = matches[2];
			v.labelbegin = v.node[v.node.length - 1].label;
			if (typeof v.node[v.node.length-1].startline === 'undefined') {
				throw new Error('No start for ' + v.action + ' tag on line '
					+ v.node[v.node.length-1].startline + ': ' + line);
				v.output = {};
				// return v.output;
			}
			if (typeof v.labelend !== 'undefined') {
				// ensure that the v.label begin/end tags match
				if ((v.labelbegin !== v.labelend) && (v.labelend !== "")) {
					throw new Error('Labels do not match on lines '
						+ v.node[v.node.length-1].startline + ' and '
						+ v.linenum + ': "' + v.labelbegin
						+ '" compared to "' + v.labelend + '".');
					v.output = {};
					// return v.output;
				}
			}
			// Go back to the parent object.
			if (!v.node) {
				throw new Error('Error on line ' + v.linenum +
					': already at object root.');
				v.output = {};
				// return v.output;
			}
			v.node.pop();
			v.curobj = v.node.reduce(function (obj, x) {
					return (obj[x.label] instanceof Array) ?
							obj[x.label][x.index] : obj[x.label];
				}, v.output);
		} else if (matches=line.match(/^@@TYPE\s*:\s*([^:]+)\s*:\s*(.*)\s*$/i)) {
			// Automatic property value conversion.
			v.typer[matches[1]] = matches[2];
		}
	} else if (matches = line.match(/^@([^\s:@][^:]*)\s*:\s*(.*)\s*$/)) {
		// New property
		v.newkey   = matches[1];
		v.onewkey  = v.newkey;
		v.newvalue = matches[2];
		this._cleanParameter(v);
		if (v.keycase === 'uc') {
			v.ocurkey = v.newkey;
			v.curkey  = v.newkey.toUpperCase();
		} else if (v.keycase === 'lc') {
			v.ocurkey = v.newkey;
			v.curkey  = v.newkey.toLowerCase();
		} else {
			v.ocurkey = v.newkey;
			v.curkey  = v.newkey;
		}
		if (typeof v.curobj[v.curkey] === 'undefined') {
			// create a new property
			v.curobj[v.curkey] = v.newvalue;
		} else if (v.curobj[v.curkey] instanceof Array) {
			// append next object to end of array
			v.curobj[v.curkey].push(v.newvalue);
		} else {
			// convert property value to array, and then append
			v.curobj[v.curkey] = [v.curobj[v.curkey], v.newvalue];
		}
	} else if (typeof v.curkey !== 'undefined') {
		// Continuing value from property started previously
		// If the line starts with a backslash, remove it since it is an
		//escape for the "@" sign or a literal "\" at the start of a line:
		// \@some data line   -=>  @some data line
		// \\@some data line  -=>  \@some data line
		// Only "@" and "\@" at the start of the line need to be esacaped;
		// otherwise, all other "@" and "\" characters are literal.
		// If another property marker is used other than "@", then that
		// character (or string) needs to be backslash escaped at the
		// start of a multi-line value line.
		if (line.charAt(0) !== '@') {
			if (line.slice(0,2) === '\\@') {
				line = line.slice(1);
			}
			if (line.slice(0,3) === '\\\\@') {
				line = line.slice(1);
			}
			if (v.curobj[v.curkey] instanceof Array) {
				v.curobj[v.curkey][v.curobj[v.curkey].length - 1] += '\n' + line;
			} else {
				v.curobj[v.curkey] += '\n' + line;
			}
		}
	}
};



//////////////////////////////
//
// ATON.prototype._cleanParameter -- Remove whitespace from beginning
//    and ending of value.  If the type should be cast to another form,
//    also do that.  This is a pseudo-private method of the ATON class.
//

ATON.prototype._cleanParameter = function (v) {
	if ((typeof v.curkey !== 'undefined') && v.curobj && v.curobj[v.curkey]) {
		var value;
		if (v.curobj[v.curkey] instanceof Array) {
			value = v.curobj[v.curkey][v.curobj[v.curkey].length-1];
		} else if (typeof v.curobj[v.curkey] === 'string') {
			value = v.curobj[v.curkey];
		}
		value = value.replace(/^\s+|\s+$/g, '');
		if (v.typer && (typeof v.typer[v.ocurkey] !== 'undefined')) {
			var newtype = v.typer[v.ocurkey];
			if (newtype.match(/number/i)) {
				value = Number(value);
			} else if (newtype.match(/integer/i)) {
				value = parseInt(value);
			} else if (newtype.match(/json/i)) {
				value = JSON.parse(value);
			}
		}
		if (v.curobj[v.curkey] instanceof Array) {
			v.curobj[v.curkey][v.curobj[v.curkey].length-1] = value;
		} else if (typeof v.curobj[v.curkey] === 'string') {
			v.curobj[v.curkey] = value;
		}
	}
}



//////////////////////////////
//
// ATON.prototype.stringify -- Convert a JavaScript object into an ATON
//    string.  If an array, then each element in the array must be an
//    object.
//

ATON.prototype.stringify = function (obj, nodelabel) {
	var output = '';
	if (typeof obj !== 'object') {
		// can only process objects, not plain strings or numbers
		return output;
	}

	if (obj instanceof Array) {
		for (var i=0; i<obj.length; i++) {
			output += this.stringify(obj[i], nodelabel);
		}
	} else {
		if (nodelabel) {
			output += this.getOptionString('metaMarker');
			output += this.getOptionString('objectBegin');
			output += this.getOptionString('keyTerminatorOut');
			output += nodelabel;
			output += this.getOptionString('recordTerminator');
		}

		Object.keys(obj).forEach(function (name) {
			var value = obj[name];
			if (value instanceof Function) {
				// ignoring functions (for now at least)
				return;
			} else if ((value instanceof Array) && value.length) {
				for (var j=0; j<value.length; j++) {
					if (typeof value[j] === 'object') {
						output += this.stringify(value[j], name);
					} else {
						output += this._printSingleParameter(name, value[j]);
					}
				}
			} else if (typeof value === 'object') {
				output += this.stringify(value, name);
			} else {
				output += this._printSingleParameter(name, value);
			}
		}, this);

		if (nodelabel) {
			output += this.getOptionString('metaMarker');
			output += this.getOptionString('objectEnd');
			output += this.getOptionString('keyTerminatorOut');
			output += nodelabel;
			output += this.getOptionString('recordTerminator');
		}
	}

	return output;
}



//////////////////////////////
//
// ATON.prototype._printSingleParameter -- A pseudo-private method which
//    is a helper function for ATON.prototype.stringify().  Prints a
//    simple ATON parameter (not an object or an array).
//

ATON.prototype._printSingleParameter = function (name, value) {
	var output = '';
	output += this.getOptionString('keyMarker');
	output += name;
	output += this.getOptionString('keyTerminatorOut');
	output += value;
	output += this.getOptionString('recordTerminator');
	return output;
};



///////////////////////////////////////////////////////////////////////////
//
// Export ATON constructor if running in node:
//

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
	module.exports = ATON;
};








