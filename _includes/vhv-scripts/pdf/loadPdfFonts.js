

//////////////////////////////
//
// loadPdfFonts -- load all default fonts used by Verovio
//

function loadPdfFonts(pdf) {
	return RSVP.all([
		loadFontResource(pdf, 'Times', '/scripts/pdfkit/EBGaramond-Regular.ttf'),
		loadFontResource(pdf, 'TimesItalic', '/scripts/pdfkit/EBGaramond-Italic.ttf'),
		loadFontResource(pdf, 'TimesBold', '/scripts/pdfkit/EBGaramond-Bold.ttf'),
		loadFontResource(pdf, 'TimesBoldItalic', '/scripts/pdfkit/EBGaramond-BoldItalic.ttf'),
		loadFontResource(pdf, 'VerovioText', '/scripts/pdfkit/VerovioText-1.0.ttf'),
		loadFontResource(pdf, 'Leipzig', '/scripts/pdfkit/Leipzig.ttf'),
	]);
}

