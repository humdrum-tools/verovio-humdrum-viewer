

//////////////////////////////
//
// loadPdfFonts -- load all default fonts used by Verovio
//

function loadPdfFonts(pdf) {
	return RSVP.all([
		// Text font used on VHV:
		loadFontResource(pdf, 'Times', '/scripts/pdfkit/EBGaramond-Regular.ttf'),
		loadFontResource(pdf, 'TimesItalic', '/scripts/pdfkit/EBGaramond-Italic.ttf'),
		loadFontResource(pdf, 'TimesBold', '/scripts/pdfkit/EBGaramond-Bold.ttf'),
		loadFontResource(pdf, 'TimesBoldItalic', '/scripts/pdfkit/EBGaramond-BoldItalic.ttf'),

		// no longer used:
		loadFontResource(pdf, 'VerovioText', '/scripts/pdfkit/VerovioText-1.0.ttf'),

		// SMuFL fonts that are available in VHV:
		loadFontResource(pdf, 'Leipzig', '/scripts/pdfkit/Leipzig.ttf'),
		loadFontResource(pdf, 'Leland', '/scripts/pdfkit/Leland.ttf'),
		loadFontResource(pdf, 'Bravura', '/scripts/pdfkit/Bravura.ttf'),
		loadFontResource(pdf, 'Gootville', '/scripts/pdfkit/Gootville.ttf'),
		loadFontResource(pdf, 'Petaluma', '/scripts/pdfkit/Petaluma.ttf'),
	]);
}

