

//////////////////////////////
//
// generatePdfFull -- Write a multi-page PDF of the full score in the text editor.
//

function generatePdfFull(format, orientation) {
	let oldOptions = vrvWorker.options;
	// need to explicitly disable mmOutput = 1 set by the printing process.
	oldOptions.mmOutput = 0;

	$('html').css('cursor', 'wait');
	format = format ? format : PDFOPTIONS.format;
	orientation = orientation ? orientation : PDFOPTIONS.orientation;

	let width = 2159;
	let height = 2794;
	// let height = 2920;

	if (format === "A4") {
		width = 2100;
		height = 2970;
	} else if (format === "B3") {
		width = 2500;
		height = 3530;
	}

	if (orientation === "landscape") {
		let temp = width;
		width = height;
		height = temp;
	}

	let pdfOptions = {};
	pdfOptions.fontCallback = svgFontCallback;

	let pdf = new PDFDocument({
		useCSS:        true,
		compress:      true,
		autoFirstPage: false,
		layout:        orientation
	});
	let stream = pdf.pipe(blobStream());
	stream.on('finish', function() {
		let blob = stream.toBlob('application/pdf');
		let pdfFilebase = getFilenameBase();
		let pdfFilename = pdfFilebase;
		if (pdfFilename) {
			pdfFilename += ".pdf";
		} else {
			pdfFilename = "data.pdf";
		}
		saveAs(blob, pdfFilename);

		$('html').css('cursor', 'auto');
	});

	let scale = PDFOPTIONS.scale;
	if (!scale) {
		scale = 100;
	}

	let vrvOptions = JSON.parse(JSON.stringify(PDFOPTIONS));
	if (vrvOptions.hasOwnProperty("orientation")) {
		delete vrvOptions.orientation;
	}
	if (vrvOptions.hasOwnProperty("format")) {
		delete vrvOptions.format;
	}

	// vrvOptions.pageHeight     = height - pageMarginTop;
	vrvOptions.pageHeight        = height / (scale/100);
	vrvOptions.pageWidth         = width / (scale/100);
	vrvOptions.scale             = scale;
	vrvOptions.adjustPageHeight  = 0;
	vrvOptions.justifyVertically = 1;
	vrvOptions.breaks            = (BREAKS ? "line" : "auto");
	vrvOptions.mmOutput          = 1;
	vrvOptions.header            = "auto";
	vrvOptions.footer            = "encoded";
	vrvOptions.usePgFooterForAll = 1;
	vrvOptions.barLineWidth      = 0.12;
	vrvOptions.staffLineWidth    = 0.12;
	vrvOptions.font              = FONT;

	let scoredata = EDITOR.getValue().replace(/^\s+/, "");

	let staffcount = getStaffCount(scoredata);
	if (staffcount == 2) {
		//vrvOptions.justifySystemsOnly = 1;
		//vrvOptions.justifyIncludeLastPage = 1;
	}

	if (GLOBALFILTER) {
		scoredata += "\n!!!filter: " + GLOBALFILTER + "\n";
	}

	vrvOptions = cleanOptions2(scoredata, vrvOptions);

	// store the options for debugging PDF files:
	PDFOPTIONS = JSON.parse(JSON.stringify(vrvOptions));

	PDFOPTIONS.format = format;
	PDFOPTIONS.orientation = orientation;

	RSVP.hash({
		fonts: loadPdfFonts(pdf),
		svglist: vrvWorker.renderAllPages(scoredata, vrvOptions)
	})
	.then(function(data) {
		for (let i=0; i < data.svglist.length; i++) {
			pdf.addPage({size: format, layout: orientation});
			let x = 0;
			let y = 0;
			SVGtoPDF(pdf, data.svglist[i], x, y, pdfOptions);
		}
		pdf.end();
		return true;
	})
	.finally(function() {
		// restore the old layout for the VHV  webpage:
		let force = false;
		let page = vrvWorker.page;
		let cleanoldoptions = cleanOptions2(scoredata, oldOptions);
		vrvWorker.redoLayout(oldOptions, true);
		vrvWorker.options = oldOptions;
	});
}



