

//////////////////////////////
//
// getScaleFromPercentSize --  This is used to set the scale of the music
//    from a CGI parameter.  The default scale used for Verovio is 40,
//    so a parameter size of 100.0% will set the scale TO 40.  If the
//    scale is too small (< 5) or too large (>500), it will be limited
//    to those values.  A size of 0 will set scale to 40.  Currently
//    this function does not store the calculated SCALE value in
//    localStorage so that the music size can be returned to in a
//    later session.  This seems best, since any custom SCALE should
//    not be overridden by a scale for a particular work included in
//    the URL.
//

function getScaleFromPercentSize(string, baseScale) {
	if (!baseScale) {
		baseScale = 40;
	}
	if (!string) {
		return baseScale;
	}
	var mysize;
	try {
		mysize = parseFloat(string);
	} catch(err) {
		mysize = 100.0;
	}
	var scale = parseInt(baseScale * mysize / 100.0 + 0.5);
	if (scale < 15) {
		scale = 15;
	} else if (scale > 500) {
		scale = 500;
	}
	return scale;
}



//////////////////////////////
//
// humdrumToSvgOptions --
//
// Verovio options:
// # = number
// B = boolean (1, or 0)
// S = string
//
// border #           == border around SVG image (default 50)
// from S             == input data from (darms, mei, pae, xml)
// pageHeight #       == height of page (default 2970)
// pageWidth #        == width of page (default 2100)
// scale #            == scaling percent for image
// adjustPageHeight B == crop the page height to content
// adjustPageWidth  B == crop the page width to content
// evenNoteSpacing B  == space notes evenly and close regardless of durations
// font S             == Bravura, Gootville, (default Leipzig)
// ignoreLayout       == ignore any encoded layout and recalulate
// noLayout B         == ignore any encoded layout and display single system
// page #             == select page to engrave
// appXPathQuery S    == xpath query for selecting app
// spacingLinear #    == linear spacing factor (default 0.25)
// spacingNonLinear # == non-linear spacing factor (default 0.6)
// spacingStaff #     == spacing above each staff (MEI vu)
// spacigSystem #     == spacing above each system (MEI vu)
// humType            == embedd extra type/class attributes
//

function humdrumToSvgOptions() {
	var output = {
		adjustPageHeight     : 1,
		// adjustPageWidth      : 1,
		barLineWidth         : 0.12,
		breaks               : (BREAKS ? "line" : "auto"),
		font                 : FONT,
		from                 : "auto",
		humType              : 1,
		justifyVertically    : 0,
		leftMarginClef       : 1.50,
		lyricSize            : LYRIC_SIZE,
		minLastJustification : 0.5,
		footer               : "none",
		header               : "none",
		pageHeight           : 60000,
		pageMarginBottom     : 40,
		pageMarginLeft       : 30,
		pageMarginRight      : 20,
		pageMarginTop        : 100,
		pageWidth            : 2500,
		scale                : SCALE,
		spacingLinear        : 0.25,
		spacingNonLinear     : 0.6,
		spacingStaff         : SPACING_STAFF,
		spacingSystem        : SPACING_SYSTEM,
		staffLineWidth       : 0.12,
		outputIndent         : 1
	}
	if (OriginalClef) {
		// now done with modori filter.
		// output.appXPathQuery = "./rdg[contains(@label, 'original-clef')]";
	} else {
		// the xpath query may need to be cleared
		// out of the persistent object:
		// output.appXPathQuery = "./rdg[contains(@label, 'asiuahetlkj')]";
	}
	if (PAGED) {
		var tw = $("#input").outerWidth();
		if ($("#input").css("display") == "none") {
			tw = 0;
		}
		// output.pageHeight = ($(window).innerHeight() - $("#navbar").outerHeight()) / ZOOM - 100;
		// output.pageWidth = ($(window).innerWidth() - tw) / ZOOM - 100;
		// jQuery $window.innerHeight() not working properly (in Chrome).
		output.pageHeight = (window.innerHeight - $("#topnav").outerHeight()) / (ZOOM * SCALE / 40) - 50;
		output.pageWidth = (window.innerWidth - tw) / (ZOOM * SCALE / 40 ) - 100;
	} else {
		var tw = $("#input").outerWidth();
		if ($("#input").css("display") == "none") {
			tw = 0;
		}
		output.pageWidth = (window.innerWidth - tw) / (ZOOM * SCALE / 40 ) - 100;
	}
	if (CGI.tasso) {
		output.spacingNonLinear = 0.65;
	}

	var newLinearSpacing = SPACINGADJUSTMENT + output.spacingLinear;
	if (newLinearSpacing < 0.05) {
		newLinearSpacing = 0.05;
	}
	output.spacingLinear = newLinearSpacing;

	return output;
}

function humdrumToMeiOptions() {
	return {
		from              : "humdrum",
		adjustPageHeight  : 1,
		// adjustPageWidth   : 1,
		pageHeight        : 8000,
		pageMarginLeft    : 20,
		pageMarginRight   : 20,
		pageMarginTop     : 0,
		pageMarginBottom  : 20,
		pageWidth         : 2500,
		scale             : 40,
		footer            : "none",
		header            : "none",
		breaks            : "auto",
		spacingNonLinear	: 0.6,
		spacingLinear		: 0.25,
		barLineWidth		: 0.12,
		staffLineWidth		: 0.12,
		font              : "Leipzig",
		outputIndent      : 1
	}
}

function humdrumToHumdrumOptions() {
	return {
		from              : "humdrum"
	}
}

function musicxmlToHumdrumOptions() {
	return {
		from              : "musicxml-hum"
	}
}

function musedataToHumdrumOptions() {
	return {
		from              : "musedata-hum"
	}
}

function musicxmlToMeiOptions() {
	return {
		from              : "musicxml",
		breaks            : "auto"
	}
}

function meiToMeiOptions() {
	return {
		from              : "mei",
		breaks            : "encoded"
	}
}

function meiToHumdrumOptions() {
	return {
		from              : "mei-hum",
		breaks            : "auto"
	}
}

function esacToHumdrumOptions() {
	return {
		from              : "esac"
	}
}



//////////////////////////////
//
// loadEditorFontSizes -- Recover the last session's font size for the text editor.  If there is no previous
//     session, the use a size of 1.0;  Also the music size (SCALE = 40 default).
//

function loadEditorFontSizes() {
	var value = localStorage.INPUT_FONT_SIZE;
	if (!value) {
		value = 1.0;
	} else {
		value *= 1.0;
	}
	if (value < 0.25) {
		value = 0.25;
	}
	if (value > 3.0) {
		value = 3.0;
	}
	INPUT_FONT_SIZE = value;

	var value2 = localStorage.SCALE;
	if (!value2) {
		value2 = 40;
	} else {
		value2 *= 1;
	}
	if (value2 < 1) {
		value2 = 40;
	} else if (value2 > 1000) {
		value2 = 40;
	}
	SCALE = value2;
}
