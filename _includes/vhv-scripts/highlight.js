

// <svg>
//   <defs>
//      <clipPath id="round-corner">
//         <rect x="0" y="0" width="10" height="56" rx="5" ry="5"/>
//      </clipPath>
//   </defs>
// 
//    <!-- if you want to use x="35" y="-135" put clip-path on a `g` element --> 
//    <rect width="10" 
//       height="51" 
//       clip-path="url(#round-corner)"
//       style="stroke: rgb(255, 255, 255); opacity: 0.8; fill: rgb(255, 122, 0);"></rect>
// </svg>


//////////////////////////////
//
// highlightMeasures --
//
// Options:
//     start = the starting measure # to highlight
//     end   = the ending measure # to highlight
//     opacity = 0.0 = invislbe, 1.0 = opaque

function highlightMeasures(options) {
	let starting = options.start;
	let ending = options.end;
	let color = options.color || "goldenrod";
	let opacity = options.opacity || 0.25;
	let padding = options.padding || 1;
	// let paddingTop = options.padding || 0;
	// let paddingBottom = options.padding || 0;
	// let paddingLeft = options.padding || 0;
	// let paddingRight = options.padding || 0;
	if (starting <= 0) {
		return;
	}
	let measure = document.querySelector("svg .m-" + starting);
	let mbbox = measure.getBBox();
	let stafflines = measure.querySelectorAll(".staff path");
	if (stafflines.length <= 0) {
		return;
	}
	let sbbox = stafflines[0].getBBox();
	let box = document.createElementNS("http://www.w3.org/2000/svg","rect");
	let x = mbbox.x;
	let y = mbbox.y;
	let width = sbbox.width;
	let height = mbbox.height;
	if (padding > 0) {
		let padunit = getPaddingUnit(stafflines);
		x = x - padding * padunit;
		y = y - padding* padunit;
		width = width + 2 * padding * padunit;
		height = height + 2 * padding * padunit;
	}
	// box.classList, box.className.baseVal, box.className.animVal
	// box.setAttribute("id",      "highlight-measure-" + starting);
	box.setAttribute("x",       x);
	box.setAttribute("y",       y);
	box.setAttribute("width",   width);
	box.setAttribute("height",  height);
	box.setAttribute("fill",    color);
	box.setAttribute("opacity", opacity);

	let svg = document.querySelector("svg .page-margin");
	svg.prepend(box);
	if (MEASURE_SCROLL) {
		MEASURE_SCROLL = false;
		// box.scrollIntoView();
		let scroller = document.querySelector("#output");
		let viewport = box.getBoundingClientRect();
		let scrolly = viewport.y - 100;
		scroller.scrollTo(0, scrolly)
	}
}



//////////////////////////////
//
// checkForHashMeasureScroll --  When loading a score, of #m13 is given in the URL,
//     move to measure 13.
//

function checkForHashMeasureScroll(starting) {
	if (!starting) {
		starting = CGI.hash_m;
		try {
			starting = parseInt(starting)
		} catch (err) {
			return;
		}
	}
	if (!MEASURE_SCROLL) {
		return;
	}
	MEASURE_SCROLL = false;

	let measure = document.querySelector("svg .m-" + starting);
	if (!measure) {
		return;
	}
	let box = measure.getBBox();
	let y = box.y;
	let scroller = document.querySelector("#output");
	let viewport = measure.getBoundingClientRect();
	let scrolly = viewport.y - 100;
	scroller.scrollTo(0, scrolly)
}



//////////////////////////////
//
// displayMeasureHighlighting --
//

function displayMeasureHighlighting() {
	for (let i=0; i<MEASURE_HIGHLIGHTS.length; i++) {
		highlightMeasures(MEASURE_HIGHLIGHTS[i]);
	}
}



//////////////////////////////
//
// getPaddingUnit -- return 1/2 of the distance between lines on the first staff.
//

function getPaddingUnit(stafflines) {
	if (stafflines.length <= 0) {
		return 0.0;
	}
	let path1 = stafflines[0].getAttribute("d");
	let y1; 
	let y2; 
	var matches = path1.match(/M\d+\s+(\d+)/);
	if (!matches) {
		return 0.0;
	} else {
		y1 = parseInt(matches[1]);
	}
	let path2 = stafflines[1].getAttribute("d");
	matches = path2.match(/M\d+\s+(\d+)/);
	if (!matches) {
		return 0.0;
	} else {
		y2 = parseInt(matches[1]);
	}
	let difference = Math.abs(y2 - y1);
	return difference;
}




//////////////////////////////
//
// setupHighlighting -- store highlights in buffer to be read after (re)generating notation.
//

function setupHighlighting(params) {
	// need to check if 0, which is possible:
	if (params.hash_mh) {
		MEASURE_HIGHLIGHTS = [];
		let barnum = -1;
		try {
			barnum = parseInt(params.hash_mh);
		} catch (err) {
			barnum = -1;
		}
		if (barnum >= 0) {
			let obj = {};
			obj.start = barnum;
			MEASURE_HIGHLIGHTS.push(obj);
		}
	}
}



//////////////////////////////
//
// displayMeasureHighlighting --
//

function displayMeasureHighlighting() {
	for (let i=0; i<MEASURE_HIGHLIGHTS.length; i++) {
		highlightMeasures(MEASURE_HIGHLIGHTS[i]);
	}
}



