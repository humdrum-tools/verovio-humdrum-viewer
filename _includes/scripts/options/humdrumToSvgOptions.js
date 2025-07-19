

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
// inputFrom S        == input data from (darms, mei, pae, xml)
// pageHeight #       == height of page (default 2970)
// pageWidth #        == width of page (default 2100)
// scale #            == scaling percent for image
// adjustPageHeight B == crop the page height to content
// adjustPageWidth  B == crop the page width to content
// evenNoteSpacing B  == space notes evenly and close regardless of durations
// font S             == Bravura, Gootville, Leland (default Leipzig)
// ignoreLayout       == ignore any encoded layout and recalulate
// noLayout B         == ignore any encoded layout and display single system
// page #             == select page to engrave
// appXPathQuery S    == xpath query for selecting app
// spacingLinear #    == linear spacing factor (default 0.25)
// spacingNonLinear # == non-linear spacing factor (default 0.6)
// spacingStaff #     == spacing above each staff (MEI vu)
// spacigSystem #     == spacing above each system (MEI vu)
// humType            == embedd extra type/class attributes
// tupletNumHead      == display tuplets on note-head side of notes by default.
//

function humdrumToSvgOptions() {
	var output = getVerovioDefaultOptions();

	output.adjustPageHeight     = 1;
	// output.adjustPageWidth   = 1;
	output.barLineWidth         = 0.12;
	output.breaks               = (BREAKS ? "line" : "auto");
	output.font                 = FONT;
	output.inputFrom            = "auto";
	output.humType              = 1;
	output.tupletNumHead        = 0;
	output.justifyVertically    = 0;
	output.leftMarginClef       = 1.50;
	output.lyricSize            = LYRIC_SIZE;
	output.minLastJustification = 0.5;
	output.footer               = "none";
	output.header               = "none";
	output.pageHeight           = 60000;
	output.pageMarginBottom     = 40;
	output.pageMarginLeft       = 30;
	output.pageMarginRight      = 20;
	output.pageMarginTop        = 100;
	output.pageWidth            = 2500;
	output.scale                = SCALE;
	output.spacingLinear        = 0.25;
	output.spacingNonLinear     = 0.6;
	output.spacingStaff         = SPACING_STAFF;
	output.spacingSystem        = SPACING_SYSTEM;
	output.staffLineWidth       = 0.12;
	output.outputIndent         = 1;
	output.lyricElision         = "narrow";
	/* output.mensuralToMeasure    = 1; */

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
		output.pageHeight = (window.innerHeight - $("#navbar").outerHeight()) / (ZOOM * SCALE / 40) - 50;
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
		inputFrom         : "humdrum",
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
		font              : FONT,
		outputIndent      : 1
	}
}



