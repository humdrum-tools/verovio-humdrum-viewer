

//////////////////////////////
//
// svgFontCallback -- substitute svg fonts with pdf fonts
//

function svgFontCallback(family, bold, italic, options) {
	if (family == "Leipzig") {
		return family;
	}
	if (family == "Leland") {
		return family;
	}
	if (family == "Bravura") {
		return family;
	}
	if (family == "Gootville") {
		return family;
	}
	if (family == "Petaluma") {
		return family;
	}
	if (family == "VerovioText") {
		// not used any more, probably remove
		return family;
	}

	if (family.match(/(?:^|,)\s*sans-serif\s*$/) || true) {
		if (bold) {
			return (italic) ? "TimesBoldItalic" : "TimesBold";
		} else {
			return (italic) ? "TimesItalic" : "Times";
		};
	}

	return family;
}

