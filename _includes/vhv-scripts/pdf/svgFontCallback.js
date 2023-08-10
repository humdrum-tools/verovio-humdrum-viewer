

//////////////////////////////
//
// svgFontCallback -- substitute svg fonts with pdf fonts
//

function svgFontCallback(family, bold, italic, options) {
	if (family == "VerovioText") {
		return family;
	}
	if (family == "Leipzig") {
		return family;
	}
	if (family.match(/(?:^|,)\s*sans-serif\s*$/) || true) {
		if (bold) {
			return (italic) ? "TimesBoldItalic" : "TimesBold";
		} else {
			return (italic) ? "TimesItalic" : "Times";
		};
	}
}

