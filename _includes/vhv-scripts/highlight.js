//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sat Jan  9 19:54:31 PST 2021
// Last Modified:  Sun Jan 10 16:01:24 PST 2021
// Filename:       highlight.js
// Syntax:         ECMAScript 6
// vim:            ts=3:nowrap:ft=javascript
//
// Description:    Interface to highlight SVG notation created from Humdrum
//                 files.
//


///////////////////////////////////////////////////////////////////////////
//
// HnpMarkup class -- Interface to highlight and markup regions of a
//                 verovio-generated SVG image.
//

//////////////////////////////
//
// HnpMarkup constructor -- Creat an HnpMarkup object.
//    to create an object:
//        let highligher = new HnpMarkup();
//    to load an SVG image (an SVG element or a selector for an SVG element):
//        highlighter.loadSvg(svg)
//    functions starting with "m_" should be treated as private to the class.
//

function HnpMarkup() {
	this.clear();
	return this;
}



//////////////////////////////
//
// HnpMarkup.prototype.clear -- Clear the contents of the highlighter.
//

HnpMarkup.prototype.clear = function() {
	this.clearSvgInfo();
};



//////////////////////////////
//
// HnpMarkup.prototype.clearSvgInfo -- Clear information about
//    the stored SVG image.  Does not clear highlighting database.
//

HnpMarkup.prototype.clearSvgInfo = function() {
	this.m_svg = new HnpSvg();
};



//////////////////////////////
//
// HnpMarkup.prototype.loadSvg --
//

HnpMarkup.prototype.loadSvg = function (svg) {
	let status = this.m_svg.loadSvg(svg);
	if (!status) {
		console.warn("Warning: could not load SVG image");
	}
	return status;
}



//////////////////////////////
//
// HnpMarkup.prototype.getMeasure --
//

HnpMarkup.prototype.getMeasure = function (barnum) {
	if (!this.m_svg) {
		return null;
	}
	return this.m_svg.getMeasure(barnum);
};



//////////////////////////////
//
// HnpMarkup.prototype.getMeasureElement --
//

HnpMarkup.prototype.getMeasureElement = function (barnum) {
	if (!this.m_svg) {
		return null;
	}
	let measure  = this.m_svg.getMeasure(barnum);
	if (!measure) {
		return null;
	}
	if (typeof measure.element === "undefined") {
		return null;
	}
	return measure.element;
};



//////////////////////////////
//
// HnpMarkup.prototype.getLowerSystemMarkupElement --
//

HnpMarkup.prototype.getLowerSystemMarkupElement = function () {
	return this.m_svg.getLowerSystemMarkupElement();
};



//////////////////////////////
//
// HnpMarkup.prototype.getLowerMeasureMarkupElement --
//

HnpMarkup.prototype.getLowerMeasureMarkupElement = function () {
	return this.m_svg.getLowerMeasureMarkupElement();
};



//////////////////////////////
//
// HnpMarkup.prototype.highlightMeasure --
//
// Options:
//     measure : the measure # to highlight
//     opacity : 0.0 == transparent, 1.0 == opaque
//     padding : units of 1/2 space between stafflines

HnpMarkup.prototype.highlightMeasure = function (options) {
	let measure;
	let color;
	let opacity;
	let padding;

	if (typeof options === "number") {
		measure = options;
		color    = "goldenrod";
		opacity  = 0.25;
		padding  = 1;
	} else if (typeof options === "string") {
		measure  = parseInt(options);
		color    = "goldenrod";
		opacity  = 0.25;
		padding  = 1;
	} else {
		measure  = options.measure || 1;
		color    = options.color   || "goldenrod";
		opacity  = options.opacity || 0.25;
		if (typeof options.padding !== "undefined") {
			padding = options.padding;
		} else {
			padding = 1;
		}
	}
	if (measure < 0) {
		return null;
	}

	let measureobj = this.getMeasure(measure);
	if (!measureobj) {
		return null;
	}
	let x = measureobj.getX();
	let y = measureobj.getY();
	let width = measureobj.getWidth();
	let height = measureobj.getHeight();
	let vu = measureobj.getVuScale();

	if ((padding > 0.0) && (vu > 0.0)) {
		x = x - padding * vu;
		y = y - padding * vu;
		width = width + 2 * padding * vu;
		height = height + 2 * padding * vu;
	}

	let mbox = document.createElementNS("http://www.w3.org/2000/svg","rect");
	mbox.setAttribute("x",       x);
	mbox.setAttribute("y",       y);
	mbox.setAttribute("width",   width);
	mbox.setAttribute("height",  height);
	mbox.setAttribute("fill",    color);
	mbox.setAttribute("opacity", opacity);

	let markupLayer = this.getLowerMeasureMarkupElement();
	if (!markupLayer) {
		return null;
	}
	markupLayer.appendChild(mbox);
	return mbox;
}



///////////////////////////////////////////////////////////////////////////
//
// HnpSvg class -- Interface to verovio-generated SVG image of music notation.
//


//////////////////////////////
//
// HnpSvg constructor -- Creat an HnpSvg object.  This is used by the
//    HnpMarkup class to interact with verovio-generated SVG image.
//

function HnpSvg() {
	this.clear();
	return this;
}



//////////////////////////////
//
// HnpSvg.prototype.clear -- Remove link to SVG image.
//

HnpSvg.prototype.clear = function () {
	this.element = null;

	// List of SVG system elements in image:
	this.svgSystems = [];

	// List of list of measure elements in each system:
	this.svgSystemMeasures = [];

	// List of all measures on the page (with other information added
	// such as the measure number and bounding box of the measure).
	this.svgMeasures = [];

	///////////////////////////
	//
	// Clear attributes relatd to the SVG image:
	//

	// pagemargin == element for the page region of the SVG image:
	this.pagemargin = null;

	// lowerMarkupLayer == element for storing highlights in SVG
	// (behind the notation):
	this.lowerMarkupElement = null;

	// lowerSystemMarkups == element containing system highlights:
	this.lowerSystemMarkupElement = null;

	// lowerMeasureMarkupElement == element containing measure highlights:
	this.lowerMeasureMarkupElement = null;

};



//////////////////////////////
//
// HnpSvg.prototype.loadSvg -- Load an svg image for later processing.
//   Returns false if cannot load SVG.
//

HnpSvg.prototype.loadSvg = function (svg) {
	this.clear();

	// Verify the SVG image being loaded:
	if (typeof svg === "string") {
		// Assume selector to SVG object:
		let element = document.querySelector(svg);
		if (!element) {
			console.warn("Warning: Selector for SVG element is invalid", svg);
			return false;
		}
		svg = element;
	}
	if (!svg) {
		console.warn("Warning: SVG element not found");
		return false;
	}
	let nodename = svg.nodeName;
	if (nodename !== "svg") {
		console.warn("Warning: SVG element is not an SVG element:", svg);
		return false;
	}
	this.element = svg;

	// Create a list of systems in the SVG image:
	let systems = svg.querySelectorAll('g[id^="system-"].system');
	if (!systems) {
		console.warn("Warning: no systems in SVG image");
		return false;
	}
	this.svgSystems = [];
	for (let i=0; i<systems.length; i++) {
		let obj = {};
		obj.element = systems[i];
		this.svgSystems.push(obj);
	}

	// Create a 2D list of the measrues in the image.
	// this.svgSystemMeasures indexes measures by system index, then measure
	// index on that system.
	this.svgSystemMeasures = [];
	for (let i=0; i<this.svgSystems.length; i++) {
		let system = this.svgSystems[i].element;
		let measures = system.querySelectorAll('g[id^="measure-"].measure');
		let m = [];
		this.svgSystemMeasures.push(m);
		if (!measures) {
			continue;
		}
		for (let j=0; j<measures.length; j++) {
			let obj = new HnpSvgMeasure();
			obj.element = measures[j];
			obj.systemIndex = i;
			obj.systemMeasureIndex = j;
			obj.m_setMeasureNumber();
			// Other measure information will be calculated
			// when needed by .m_setMeasureInfo().
			m.push(obj);
		}

	}

	// Now create a 1D list of the measures in the SVG image
	this.svgMeasures = [];
	for (let i=0; i<this.svgSystemMeasures.length; i++) {
		let mlist = this.svgSystemMeasures[i];
		for (let j=0; j<mlist.length; j++) {
			mlist[j].measureIndex = this.svgMeasures.length;
			this.svgMeasures.push(mlist[j]);
		}
	}

	// And create a lookup table by measure number.  Each measure
	// index contains a list of measures with a given number
	// (in case there are multiple measures with the same number).
	this.measures = {};
	for (let i=0; i<this.svgMeasures.length; i++) {
		let item = this.svgMeasures[i];
		let number = item.number;
		let obj = this.measures[number];
		if (!obj) {
			this.measures[number] = [];
		}
		obj = this.measures[number];
		obj.push(item);
	}

	this.m_insertLowerMarkupLayer();

	return true;
};



/////////////////////////////
//
// HnpSvg.prototype.m_insertLowerMarkupLayer = function () {
//

HnpSvg.prototype.m_insertLowerMarkupLayer = function () {
	if (!this.element) {
		console.warn("Error: no SVG image");
		return;
	}
	let svg = this.element;
	let pagemargin = svg.querySelector(".page-margin");
	if (!pagemargin) {
		console.warn("Error: invalid SVG image", svg);
		return;
	}
	this.pagemargin = pagemargin;
	let child = pagemargin.firstElementChild;
	let classlist = child.classList;
	let hasLayer = false;
	for (let i=0; i<classlist.length; i++) {
		if (classlist[i] === "lowerMarkupLayer") {
			hasLayer = true;
			break;
		}
	}
	if (hasLayer) {
		this.lowerMarkupElement = child;
	} else {
		let element = document.createElementNS("http://www.w3.org/2000/svg","g");
		let parent = child.parentNode;
		parent.prepend(element);
		element.classList.add("lowerMarkupLayer");
		this.lowerMarkupElement = element;
	}

	// fill in lowerMarkupLayer with sublayers:
	this.lowerMarkupElement.innerHTML = "";
	let subelement;

	subelem = document.createElementNS("http://www.w3.org/2000/svg","g");
	subelem.classList.add("lowerSystemMarkups");
	this.lowerMarkupElement.appendChild(subelem);
	this.lowerSystemMarkupElement = subelem;

	subelem = document.createElementNS("http://www.w3.org/2000/svg","g");
	subelem.classList.add("lowerMeasureMarkups");
	this.lowerMarkupElement.appendChild(subelem);
	this.lowerMeasureMarkupElement = subelem;
};



//////////////////////////////
//
// HnpSvg.prototype.getLowerSystemMarkupElement --
//

HnpSvg.prototype.getLowerSystemMarkupElement = function () {
	if (this.lowerSystemMarkupElement) {
		return this.lowerSystemMarkupElement;
	} else {
		return null;
	}
};



//////////////////////////////
//
// HnpSvg.prototype.getLowerMeasureMarkupElement --
//

HnpSvg.prototype.getLowerMeasureMarkupElement = function () {
	if (this.lowerMeasureMarkupElement) {
		return this.lowerMeasureMarkupElement;
	} else {
		return null;
	}
};



//////////////////////////////
//
// HnpSvg.prototype.getMeasure --
//

HnpSvg.prototype.getMeasure = function (barnum) {
	if (typeof barnum === "undefined") {
		console.log("Warning: no bar number given as input.");
		return;
	}
	if (!this.measures) {
		return null;
	}
	if (typeof barnum === "string") {
		barnum = parseInt(barnum);
	}
	let output = this.measures[barnum][0];
	return output;
};



///////////////////////////////////////////////////////////////////////////
//
// HnpSvgMeasure class -- Interface to measure element int
//     verovio-generated SVG image of music notation.
//



//////////////////////////////
//
// HnpSvgMeasure constructor -- Creat an HnpSvgMeasure object.
//    to create an object:
//        let measure = new HnpSvgMeasure();
//

function HnpSvgMeasure() {
	this.clear();
	return this;
}



//////////////////////////////
//
// HnpSvgMeasure.prototype.clear --
//

HnpSvgMeasure.prototype.clear = function () {
	delete this.element; // measure element in SVG image.
	delete this.number;  // measure number extracted from element.
}



//////////////////////////////
//
// HnpSvgMeasure.prototype.getMeasureNumber --
//

HnpSvgMeasure.prototype.getMeasureNumber = function () {
	if (typeof this.number !== "undefined") {
		return this.number;
	}
	this.m_setMeasureNumber();
	return this.number;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getMeasureElement --
//

HnpSvgMeasure.prototype.getMeasureElement = function () {
	if (typeof this.element !== "undefined") {
		return this.element;
	}
	return null;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.m_setMeasureNumber --  Extract measure number
//   from measure element.  It is stored as a class element in the form
//   m-#.
//

HnpSvgMeasure.prototype.m_setMeasureNumber = function () {
	if (typeof this.number !== "undefined") {
		return this.number;
	}
	let output = - 1;
	let measure = this.element;
	if (!measure) {
		return output;
	}
	let classlist = measure.classList;
	for (let i=0; i<classlist.length; i++) {
		let matches = classlist[i].match(/m-(\d+)/);
		if (matches) {
			output = parseInt(matches[1]);
			break;
		}
	}
	this.number = output;
	return output;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getX -- Return the top left corner horizontal
//   position of the bounding box for a measure (positiver direction is
//   to the right).  The X value may be influenced by a measure number,
//   so this function will set the X position to the left barline instead.
//

HnpSvgMeasure.prototype.getX = function () {
	if (typeof this.x !== "undefined") {
		return this.x;
	}
	this.m_setMeasureInfo();
	return this.x;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getY -- Return the top left corner vertical
//    position of the bounding box for a measure (positive direction
//    is down).
//

HnpSvgMeasure.prototype.getY = function () {
	if (typeof this.y !== "undefined") {
		return this.y;
	}
	this.m_setMeasureInfo();
	return this.y;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getHeight --
//

HnpSvgMeasure.prototype.getHeight = function () {
	if (typeof this.height !== "undefined") {
		return this.height;
	}
	this.m_setMeasureInfo();
	return this.height;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getWidth --
//

HnpSvgMeasure.prototype.getWidth = function () {
	if (typeof this.width !== "undefined") {
		return this.width;
	}
	this.m_setMeasureInfo();
	return this.width;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getVuScale -- Return 1/2 the distance
//   between staff lines.
//

HnpSvgMeasure.prototype.getVuScale = function () {
	if (typeof this.vu !== "undefined") {
		return this.vu;
	}
	this.m_setMeasureInfo();
	return this.vu;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.m_setMeasureInfo --
//

HnpSvgMeasure.prototype.m_setMeasureInfo = function () {
	if (typeof this.x !== "undefined") {
		// Already have measure dimensions, do not recalculate.
		return false;
	}
	if (!this.element) {
		// No SVG element to process
		console.log("NO SVG ELEMENT");
		return false;
	}

	let bbox = this.element.getBBox();
	let lines = this.element.querySelectorAll(".staff path");
	if (lines.length <= 0) {
		this.width = bbox.width;
		console.warn("Warning: NO STAFF LINES IN MEASURE");
		return false;
	}
	this.stafflines = lines;
	this.m_setX();
	this.y = bbox.y;
	this.height = bbox.height;

	let sbbox = this.stafflines[0].getBBox();
	this.width = sbbox.width;

	let status = this.m_setVuScale();
	return status;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.m_setX -- The measure X position may be pushed
//    to the left because of a measure number.  This function will instead
//    look at the X position of the staff lines in the measure.
//


HnpSvgMeasure.prototype.m_setX = function () {
	let stafflines = this.stafflines;
	if (stafflines.length <= 0) {
		console.log("STAFFLINES NOT FOUND");
		this.x = 0.0;
		return false;
	}
	let path1 = stafflines[0].getAttribute("d");
	let y1;
	let y2;
	var matches = path1.match(/M([\d.+-]+)/);
	if (!matches) {
		this.x = 0.0;
		console.log("STAFFLINES NOT FOUND B");
		return false;
	} else {
		this.x = parseFloat(matches[1]);
		return true;
	}
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.m_setVuScale -- 1/2 of the distance between stafflines.
//     Checking only the to staff of a system, and assuming all staves
//     are the same size.
//

HnpSvgMeasure.prototype.m_setVuScale = function () {
	let stafflines = this.stafflines;
	if (stafflines.length <= 0) {
		this.vu = 0.0;
		return false;
	}
	let path1 = stafflines[0].getAttribute("d");
	let y1;
	let y2;
	var matches = path1.match(/M[\d.+-]+\s+([\d.+-]+)/);
	if (!matches) {
		this.vu = 0.0;
		return false;
	} else {
		y1 = parseInt(matches[1]);
	}
	let path2 = stafflines[1].getAttribute("d");
	matches = path2.match(/M[\d.+-]+\s+([\d.+-]+)/);
	if (!matches) {
		this.vu = 0.0;
		return false;
	} else {
		y2 = parseInt(matches[1]);
	}
	let difference = Math.abs(y2 - y1);
	this.vu = difference;
	return true;
};


//////////////////////////////////////////////////////////////////////////


//////////////////////////////
//
// processMeasureHash --  When loading a score, if #m13 is
//     given in the URL, move to measure 13.
//
// Delete CGI.hash_m and CGI.hash_mh if the repertory file changes, or
//     if alt-e is pressed.
//

function processMesaureHash() {
	if (typeof CGI.hash_m !== "undefined") {
		scrollToMeasure(CGI.hash_m, "#output");
	}
	if (typeof CGI.hash_mh !== "undefined") {
		let options = {};
		options.measure = CGI.hash_mh;
		options.padding = 1;
		let measure = MARKUP.highlightMeasure(options);
		if (measure) {
	 		scrollToMeasure(CGI.hash_mh, "#output");
		}
	}
}



//////////////////////////////
//
// scrollToMeasure -- Bring a particular measure into view at the
//   top of the selected element.
//

function scrollToMeasure(number, selector) {
	if (!SCROLL_HASH) {
		return;
	}
	SCROLL_HASH = false;
	let scroller = document.querySelector("#output");
	let element = MARKUP.getMeasureElement(number);
	if (scroller && element) {
		let viewport = element.getBoundingClientRect();
		let topmargin = 100;
		let scrolly = viewport.y - topmargin;
		if (scrolly < 0) {
			scrolly = 0;
		}
		scroller.scrollTo(0, scrolly);
	}
}



