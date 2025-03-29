

//////////////////////////////
//
// goDownHarmonically --
//

function goDownHarmonically(current) {
	moveHarmonically(current, -1);
}



//////////////////////////////
//
// goUpHarmonically -- Move up harmonically in the SVG score. 
//

function goUpHarmonically(current) {
	moveHarmonically(current, +1);
}



//////////////////////////////
//
// moveHarmonically -- Move up (+1) or down (-1) harmonically in the SVG score.
//     Go to the next chord note or voice on the same staff, or go to the next
//     higher staff.  If at the top of the top staff, then wrap around to the bottom
//     chord of the bottom voice of the bottom staff in the system.
//

function moveHarmonically(current, direction) {
	if (!current) {
		return;
	}
	var startid = current.id;
	var nextid = getNextHarmonicNote(startid, direction)
	if (!nextid) {
		return;
	}
	unhighlightCurrentNote(current);
	highlightIdInEditor(nextid, "moveHarmonically");
}



//////////////////////////////
//
// inSvgImage -- Used to prevent processing clicks in the text
//      editor for the click event listener used in the SVG image.
//      Returns true if the node is inside of an SVG image, or
//      false otherwise.
//

function inSvgImage(node) {
	var current = node;
	while (current) {
		if (current.nodeName === "svg") {
			return true;
		}
		current = current.parentNode;
	}
	return false;
}



//////////////////////////////
//
// observeSVGContent --
//

function observeSvgContent() {
	var content = document.querySelector("#output");
	var i;
	var s;
	var callback = function(mList, observer) {
		var svg = content.querySelector("svg");
		if (svg) {

			// Mark encoding problem messages with red caution symbol.
			spans = svg.querySelectorAll("g.dir.problem tspan.rend tspan.text tspan.text");
			for (i=0; i<spans.length; i++) {
				s = spans[i];
				if (s.innerHTML === "P") {
					s.innerHTML = "&#xf071;";
					s.classList.add("p");
				}
			}

			// Mark encoding problem messages with green caution symbol.
			spans = svg.querySelectorAll("g.dir.sic tspan.rend tspan.text tspan.text");
			for (i=0; i<spans.length; i++) {
				s = spans[i];
				if (s.innerHTML === "S") {
					s.innerHTML = "&#xf071;";
					s.classList.add("s");
				}
			}

		}

		for (var mu in mList) {
			if (svg && svg.isSameNode(mList[mu].target)) {
				//remove busy class if svg changed
				document.body.classList.remove("busy");
			}
		}
	}
	var observer = new MutationObserver(callback);

	observer.observe(content, { childList: true, subtree: true });
}



//////////////////////////////
//
// turnOffAllHighlights -- Remove highlights from all svg elements.
//

function turnOffAllHighlights() {
	var svg = document.querySelector("svg");
	var highlights = svg.querySelectorAll(".highlight");
	for (var i=0; i<highlights.length; i++) {
		var cname = highlights[i].className.baseVal;
		cname = cname.replace(/\bhighlight\b/, "");
		highlights[i].className.className = cname;
		highlights[i].className.baseVal = cname;
		highlights[i].className.animVal = cname;
	}
}



//////////////////////////////
//
// getNextHarmonicNote --
//

function getNextHarmonicNote(startid, direction) {
	var match = startid.match(/^[^-]+-[^-]*L(\d+)/);
	var startline = -1;
	if (match) {
		startline = parseInt(match[1]);
	} else {
		return undefined;
	}
	if (startline == -1) {
		return undefined;
	}
	// Assuming one svg on the page, which is currently correct.
	var svg = document.querySelector('svg');
	var allids = svg.querySelectorAll('*[id]:not([id=""])');
	var regex = new RegExp("^[^-]+-[^-]*L" + startline + "(?!\\d)");
	var harmonic = [];
	var x;
	var i;
	for (i=0; i<allids.length; i++) {
		if (allids[i].id.match(regex)) {
			x = allids[i].id.replace(/-.*/, "");
			if (!((x == "note") || (x == "rest") || (x == "mrest"))) {
				// only keep track of certain types of elements
				// should chords be included or not? currently not.
				continue;
			}
			harmonic.push(allids[i]);
		}
	}
	harmonic.sort(function(a, b) {
		var aloc = getStaffAndLayerNumbersByElement(a);
		var bloc = getStaffAndLayerNumbersByElement(b);
		var astaff = aloc.staff | 0;
		var bstaff = bloc.staff | 0;
		var alayer = aloc.layer | 0;
		var blayer = bloc.layer | 0;

		if (astaff > bstaff) { return -1; }
		if (astaff < bstaff) { return +1; }
		if (alayer > blayer) { return -1; }
		if (alayer < blayer) { return +1; }

		// notes are in a chord so sort by pitch from low to high
		var match;
		var aoct = 0;
		var boct = 0;
		var ab40 = 0;
		var bb40 = 0;
		if (match = a.className.baseVal.match(/oct-(-?\d+)/)) {
			aoct = parseInt(match[1]);
		}
		if (match = b.className.baseVal.match(/oct-(-?\d+)/)) {
			boct = parseInt(match[1]);
		}
		if (match = a.className.baseVal.match(/b40c-(\d+)/)) {
			ab40 = aoct * 40 + parseInt(match[1]);
		}
		if (match = b.className.baseVal.match(/b40c-(\d+)/)) {
			bb40 = boct * 40 + parseInt(match[1]);
		}
		if (ab40 < bb40) { return -1; }
		if (ab40 > bb40) { return +1; }
		return 0;
	});
	if (harmonic.length == 1) {
		// nothing to do
		return undefined;
	}
	for (var j=0; j<harmonic.length; j++) {
		var oc = getStaffAndLayerNumbersByElement(harmonic[j]);
	}
	var startingindex = -1;
	for (i=0; i<harmonic.length; i++) {
		if (harmonic[i].id === startid) {
			startingindex = i;
			break;
		}
	}
	if (startingindex < 0) {
		return undefined;
	}
	var index = startingindex + direction;
	if (index < 0) {
		index = harmonic.length - 1;
	} else if (index >= harmonic.length) {
		index = 0;
	}
	return harmonic[index].id;
}



//////////////////////////////
//
// unhighlightCurrentNote --
//

function unhighlightCurrentNote(element) {
	if (element) {
		var classes = element.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		element.setAttribute("class", outclass);
	}
}



//////////////////////////////
//
// chooseBestId -- Match to the staff number and the layer number of the
//    original element.  The original element could be unattached from the
//    current SVG image, so its id is passed to this
//

function chooseBestId(elist, targetstaff, targetlayer) {
	var staffelements = [0,0,0,0,0,0,0,0,0,0,0,0];
	for (var i=0; i<elist.length; i++) {
		var location = getStaffAndLayerNumbers(elist[i].id);
		if (location.staff == targetstaff) {
			staffelements[location.layer] = elist[i];
			if ((location.layer == targetlayer) && (!elist[i].id.match(/space/))) {
				return elist[i].id;
			}
		}
	}
	// no exact match, so try a different layer on the same staff.
	if (staffelements.length == 1) {
		// only one choice so use it
		return staffelements[0].id;
	}

	// find a note/rest in a lower layer
	for (i=targetlayer; i>0; i--) {
		if (!staffelements[i]) {
			continue;
		}
		if (staffelements[i].id) {
			if (staffelements[i].id.match(/space/)) {
				continue;
			}
		}
		return staffelements[i].id;
	}

	// find a note/rest in a higher layer
	for (i=targetlayer; i<staffelements.length; i++) {
		if (!staffelements[i]) {
			continue;
		}
		if (staffelements[i].id) {
			if (staffelements[i].id.match(/space/)) {
				continue;
			}
		}
		return staffelements[i].id;
	}

	// go back and allow matching to invisible rests

	// find a note/rest in a lower layer
	for (i=targetlayer; i>0; i--) {
		if (!staffelements[i]) {
			continue;
		}
		return staffelements[i].id;
	}

	// find a note/rest in a higher layer
	for (i=targetlayer; i<staffelements.length; i++) {
		if (!staffelements[i]) {
			continue;
		}
		return staffelements[i].id;
	}

	// found nothing suitable
	return undefined;
}



//////////////////////////////
//
// getStaffPosition -- Return the nth position of a <staff> elemnet within a
//   measure.
//

function getStaffPosition(element) {
	var count = 0;
	var current = element;
	while (current) {
		if (current.className.baseVal.match(/staff/)) {
			count++;
		}
		current = current.previousElementSibling;
	}
	return count;
}



//////////////////////////////
//
// getLayerPosition -- Return the nth position of a <layer> elemnet within a
//   staff.
//

function getLayerPosition(element) {
	var count = 0;
	var current = element;
	while (current) {
		if (current.className.baseVal.match(/layer/)) {
			count++;
		}
		current = current.previousElementSibling;
	}
	return count;
}



//////////////////////////////
//
// getStaffAndLayerNumbers -- Return the staff and layer number of the
//   location of the given id's element.  The layer and staff numbers
//   are zero indexed to match MEI's enumeration (but this is not
//   necessary).
//

function getStaffAndLayerNumbers(id) {
	var element = document.querySelector("#" + id);
	return getStaffAndLayerNumbersByElement(element);
}


function getStaffAndLayerNumbersByElement(element) {
	if (!element) {
		return {};
	}
	var id = element.id;
	var staff = 0;
	var layer = 0;
	var current = element;

	current = current.parentNode;
	while (current && current.className.baseVal) {
		// console.log("CURRENT", current.className.baseVal);
		if (current.className.baseVal.match(/layer/)) {
			layer = getLayerPosition(current);
		} else if (current.className.baseVal.match(/staff/)) {
			staff = getStaffPosition(current);
		}
		current = current.parentNode;
	}
	return {
		layer: layer,
		staff: staff
	}

}



//////////////////////////////
//
// getOffClassElements --
//

function getOffClassElements(offclass) {
	var nlist = document.querySelectorAll("." + offclass);
	var rlist = document.querySelectorAll(".r" + offclass);
	var alist = [];
	for (var i=0; i<nlist.length; i++) {

		match = nlist[i].className.baseVal.match(/qon-([^\s]+)/);
		if (match) {
			qon = match[1];
		} else {
			qon = "xyz";
		}

		match = nlist[i].className.baseVal.match(/qoff-([^\s]+)/);
		if (match) {
			qoff = match[1];
		} else {
			qoff = "xyz";
		}
		if (qon === qoff) {
			// no grace notes
			continue;
		}

		alist.push(nlist[i]);
	}
	for (var i=0; i<rlist.length; i++) {
		alist.push(rlist[i]);
	}
	return alist;
}



//////////////////////////////
//
// getOnClassElements --
//

function getOnClassElements(onclass) {
	var nlist = document.querySelectorAll("." + onclass);
	var rlist = document.querySelectorAll(".r" + onclass);
	var alist = [];
	var match;
	var qon;
	var qoff;
	for (var i=0; i<nlist.length; i++) {

		match = nlist[i].className.baseVal.match(/qon-([^\s]+)/);
		if (match) {
			qon = match[1];
		} else {
			qon = "xyz";
		}

		match = nlist[i].className.baseVal.match(/qoff-([^\s]+)/);
		if (match) {
			qoff = match[1];
		} else {
			qoff = "xyz";
		}
		if (qon === qoff) {
			// no grace notes
			continue;
		}

		alist.push(nlist[i]);
	}
	for (var i=0; i<rlist.length; i++) {
		alist.push(rlist[i]);
	}
	return alist;
}



//////////////////////////////
//
// goToPreviousNoteOrRest --
//

function goToPreviousNoteOrRest(currentid) {
	var current = document.querySelector("#" + currentid);
	if (!current) {
		console.log("CANNOT FIND ITEM ", currentid);
		return;
	}
	var location = getStaffAndLayerNumbers(current.id);
	var matches = current.className.baseVal.match(/qon-([^\s]+)/);
	if (!matches) {
		console.log("CANNOT FIND QON IN", current.className);
		return;
	}
	var qon = matches[1];
	if (qon == 0) {
		// cannot go before start of work
		return;
	}
	offclass = "qoff-" + qon;
	var alist = getOffClassElements(offclass);
	var nextid;
	if (!alist) {
		return;
	}
	unhighlightCurrentNote(current);
	if (alist.length == 1) {
		highlightIdInEditor(alist[0].id, "goToPreviousNoteOrRest");
	} else if (alist.length == 0) {
		// gotoNextPage();
		if (vrvWorker.page == 1) {
			// at first page, so don't do anything.
			console.log("AT FIRST PAGE, so not continuing further");
			return;
		}
		vrvWorker.gotoPage(vrvWorker.page - 1)
		.then(function(obj) {
			// loadPage(vrvWorker.page);
			var page = obj.page || vrvWorker.page;
			$("#overlay").hide().css("cursor", "auto");
			$("#jump_text").val(page);
			vrvWorker.renderPage(page)
			.then(function(svg) {
				$("#output").html(svg);
				// adjustPageHeight();
				// resizeImage();
			})
			.then(function() {
				alist = getOnClassElements(offclass);
				if (alist.length == 1) {
					highlightIdInEditor(alist[0].id, "goToPreviousNoteOrRest2");
				} else {
					nextid = chooseBestId(alist, location.staff, location.layer);
					if (nextid) {
						EDITINGID = nextid;
						highlightIdInEditor(nextid, "goToPreviousNoteOrRest3");
					}
				}
			});
		});
	} else {
		nextid = chooseBestId(alist, location.staff, location.layer);
		if (nextid) {
			EDITINGID = nextid;
			highlightIdInEditor(nextid, "goToPreviousNoteOrRest4");
		}
	}
}



//////////////////////////////
//
// goToNextNoteOrRest -- current is the value of global variable CursorNote.
//    This function moves the cursor to the next note or rest in the spine
//    or subspine.  This is accomplished by examing the timestamps of the
//    notes and rests in the currently viewed SVG image generated by verovio.
//

function goToNextNoteOrRest(currentid) {
	var current = document.querySelector("#" + currentid);
	if (!current) {
		return;
	}
	var location = getStaffAndLayerNumbers(current.id);
	var matches = current.className.baseVal.match(/qoff-([^\s]+)/);
	if (!matches) {
		return;
	}
	var qoff = matches[1];
	var onclass = "qon-" + qoff;
	var alist = getOnClassElements(onclass);
	var nextid;
	if (!alist) {
		return;
	}
	unhighlightCurrentNote(current);

	if (alist.length == 1) {
		highlightIdInEditor(alist[0].id, "goToNextNoteOrRest");
	} else if (alist.length == 0) {
		// console.log("NO ELEMENT FOUND (ON NEXT PAGE?)");
		// gotoNextPage();
		if ((vrvWorker.pageCount > 0) && (vrvWorker.pageCount == vrvWorker.page)) {
			// at last page, so don't do anything.
			// console.log("AT LAST PAGE, so not continuing further");
			return;
		}
		vrvWorker.gotoPage(vrvWorker.page + 1)
		.then(function(obj) {
			// loadPage(vrvWorker.page);
			var page = obj.page || vrvWorker.page;
			$("#overlay").hide().css("cursor", "auto");
			$("#jump_text").val(page);
			vrvWorker.renderPage(page)
			.then(function(svg) {
				$("#output").html(svg);
				// adjustPageHeight();
				// resizeImage();
			})
			.then(function() {
				alist = getOnClassElements(onclass);
				if (alist.length == 1) {
					highlightIdInEditor(alist[0].id, "goToNextNoteOrRest2");
				} else {
					nextid = chooseBestId(alist, location.staff, location.layer);
					if (nextid) {
						EDITINGID = nextid;
						highlightIdInEditor(nextid, "goToNextNoteOrRest3");
					}
				}
			});
		});
	} else {
		nextid = chooseBestId(alist, location.staff, location.layer);
		if (nextid) {
			EDITINGID = nextid;
			highlightIdInEditor(nextid, "goToNextNoteOrRest4");
		}
	}
}



//////////////////////////////
//
// toggleAppoggiaturaColoring -- turn appoggiatura color highlighting on/off.
//

function toggleAppoggiaturaColoring() {
	var sylesheet;
	stylesheet = document.querySelector("#appoggiatura-color-stylesheet");
	if (stylesheet) {
		var parentElement = stylesheet.parentNode;
		parentElement.removeChild(stylesheet);
		return;
	}
	stylesheet = document.createElement('style');
	var text = "";
	text += "g.appoggiatura-start { fill: limegreen; }";
	text += "g.appoggiatura-stop { fill: forestgreen; }";
	stylesheet.innerHTML = text;
	stylesheet.id = "appoggiatura-color-stylesheet";
	document.body.appendChild(stylesheet);
}



//////////////////////////////
//
// toggleCautionaryAccidentalColoring --
//

function toggleCautionaryAccidentalColoring() {
	var sylesheet;
	stylesheet = document.querySelector("#cautionary-accidental-color-stylesheet");
	if (stylesheet) {
		var parentElement = stylesheet.parentNode;
		parentElement.removeChild(stylesheet);
		return;
	}
	stylesheet = document.createElement('style');
	var text = "";
	text += "g.accid.caution[id^='accid-'] { fill: hotpink; }\n";
	stylesheet.innerHTML = text;
	stylesheet.id = "cautionary-accidental-color-stylesheet";
	document.body.appendChild(stylesheet);
}



//////////////////////////////
//
// toggleLayerColoring -- turn layer color highlighting on/off.
//

function toggleLayerColoring() {
	var sylesheet;
	stylesheet = document.querySelector("#layer-color-stylesheet");
	if (stylesheet) {
		var parentElement = stylesheet.parentNode;
		parentElement.removeChild(stylesheet);
		return;
	}
	stylesheet = document.createElement('style');
	var text = "";
	text += "g[id^='layer-'][id*='N2'] { fill: #00cc00; }\n";
	text += "g[id^='layer-'][id*='N3'] { fill: #cc00aa; }\n";
	text += "g[id^='layer-'][id*='N4'] { fill: #0088cc; }\n";
	text += "g[id^='layer-'][id*='N5'] { fill: #0000cc; }\n";
	text += "g[id^='layer-'][id*='N6'] { fill: #cc0000; }\n";
	text += "g[id^='layer-'][id*='N7'] { fill: #00cc00; }\n";
	// Disable highlighting of clefs in layers:
	text += "g.clef { fill: black !important; }";
	stylesheet.innerHTML = text;
	stylesheet.id = "layer-color-stylesheet";
	document.body.appendChild(stylesheet);
}



//////////////////////////////
//
// togglePlaceColoring -- turn explicitly placed item highlighting on/off.
//

function togglePlaceColoring() {
	var sylesheet;
	stylesheet = document.querySelector("#placed-color-stylesheet");
	if (stylesheet) {
		var parentElement = stylesheet.parentNode;
		parentElement.removeChild(stylesheet);
		return;
	}
	stylesheet = document.createElement('style');
	var text = "g.placed { fill: orange; } ";
	text += "g.placed path { stroke: orange; } ";
	stylesheet.innerHTML = text;
	stylesheet.id = "placed-color-stylesheet";
	document.body.appendChild(stylesheet);
}



///////////////////////////////////
//
// restoreSelectedSvgElement -- Need to generalize to multiple pages.
//

function restoreSelectedSvgElement(id) {
	if (!id) {
		return;
	}
	var item = document.querySelector("#" + id);
	if (!item) {
		return;
	}
	var line;
	var matches = id.match(/L(\d+)/);
	if (matches) {
		line = parseInt(line);
	} else {
		return;
	}
	markItem(item, line);
}



//////////////////////////////
//
// markItem -- Used by highlightNoteInScore.
//

function markItem(item, line) {
	if (!item) {
		item = CursorNote;
	}
	if (!item) {
		return;
	}
	EditorLine = line;
	// This case is not good for editing a note:
	//if (CursorNote && item && (CursorNote.id == item.id)) {
	//	console.log("THE SAME NOTE");
	//	return;
	//}
	if (CursorNote) {
		// console.log("TURNING OFF OLD NOTE", CursorNote);
		/// CursorNote.setAttribute("fill", "#000");
		// CursorNote.removeAttribute("fill");

		var classes = CursorNote.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		outclass = outclass.replace(/^\s+/, "");
		CursorNote.setAttribute("class", outclass);

	}
	if (item) {
		setCursorNote(item, "markItem");
	}
	if (CursorNote) {
		// console.log("TURNING ON NEW NOTE", CursorNote);
		// CursorNote.setAttribute("fill", "#c00");

		var classes = CursorNote.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		outclass += " highlight";
		CursorNote.setAttribute("class", outclass);
	}
}



//////////////////////////////
//
// unhighlightAllElements --
//

function unhighlightAllElements() {
	if (!CursorNote) {
		return;
	}
	var hilights = document.querySelectorAll("svg .highlight");
	for (var i=0; i<hilights.length; i++) {
		var classes = CursorNote.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		outclass = outclass.replace(/^\s+/, "");
		CursorNote.setAttribute("class", outclass);
	}
}



//////////////////////////////
//
// highlightIdInEditor --
//

function highlightIdInEditor(id, source) {

	unhighlightAllElements(id);

	if (!id) {
		// no element (off of page or outside of musical range
		console.log("NO ID so not changing to another element");
		return;
	}
	matches = id.match(/^([^-]+)-[^-]*L(\d+)F(\d+)/);
	if (!matches) {
		return;
	}

	var etype = matches[1];
	var row   = matches[2];
	var field = matches[3];
	var subtoken = 0;
	if (matches = id.match(/-.*L\d+F\d+S(\d+)/)) {
		subtoken = matches[1];
	}

	var linecontent = EDITOR.session.getLine(row-1);

	var col = 0;
	if (field > 1) {
		var tabcount = 0;
		for (i=0; i<linecontent.length; i++) {
			col++;
			if (linecontent[i] == '\t') {
				if ((i > 0) && (linecontent[i-1] != '\t')) {
					tabcount++;
				}
			}
			if (tabcount == field - 1) {
				break;
			}
		}
	}

	if (subtoken >= 1) {
		var scount = 1;
		while ((col < linecontent.length) && (scount < subtoken)) {
			col++;
			if (linecontent[col] == " ") {
				scount++;
				if (scount == subtoken) {
					col++;
					break;
				}
			}
		}
	}

	col2 = col;
	var searchstring = linecontent[col2];
	while (col2 < linecontent.length) {
		col2++;
		if (linecontent[col2] == " ") {
			break;
		} else if (linecontent[col2] == "\t") {
			break;
		} else {
			searchstring += linecontent[col2];
		}
	}

	CursorNote = document.querySelector("#" + id);
	MENU.showCursorNoteMenu(CursorNote);
	EDITOR.gotoLine(row, col);

	// 0.5 = center the cursor vertically:
	EDITOR.renderer.scrollCursorIntoView({row: row-1, column: col}, 0.5);
	centerCursorHorizontallyInEditor();

}

