


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



