


//////////////////////////////
//
// getFilenameBase --
//

function getFilenameBase(text) {
	if (!text) {
		text = getTextFromEditor();
	}
	if (!text) {
		return "";
	}
	var matches = text.match(/^!!!!SEGMENT:\s*([^\s'"!*]+)/);
	var output;
	if (matches) {
		output = matches[1];
		output = output.replace(/.*\//, "").replace(/\..*?$/, "");
		if (output.length > 0) {
			return output;
		}
	}
	// In the data was loaded from a repertory file, then use that
	// file as the filename base.
	if (FILEINFO) {
		if (FILEINFO.file) {
			output = FILEINFO.file;
			output = output.replace(/.*\//, "").replace(/\..*?$/, "");
			if (output.length > 0) {
				return output;
			}
		}
	}
	return "data";
}



//////////////////////////////
//
// getFilenameExtension --
//

function getFilenameExtension(text) {
	if (!text) {
		text = getTextFromEditorRaw();
	}
	if (!text) {
		return "txt";
	}
	var beginning = text.substring(0, 1000).replace(/^\s+/, "");
	if (beginning.match(/<meiHead/)) {
		return "mei";
	}
	if (beginning.match(/<score-(part|time)wise/)) {
		return "musicxml";
	}
	if (beginning.match(/<opus/)) {
		return "musicxml";
	}
	if (beginning.match(/^[A-Za-z0-9+\/\s]+$/)) {
		return "mime";
	}
	if (beginning.match(/^CUT\[/m)) {
		return "esac";
	}

	var matches;
	var ext;
	var fullname;
	if (beginning.match(/^[!*]/)) {
		// Humdrum file.
		matches = beginning.match(/^!!!!SEGMENT:\s*([^\s'"!*]+)/);
		if (matches) {
			fullname = matches[1];
			if (fullname.match(/\./)) {
				ext = fullname.replace(/.*\./, "");
				if (ext && (ext.length > 0)) {
					return ext;
				}
			}
		}
		if (FILEINFO) {
			if (FILEINFO.file) {
				fullname = FILEINFO.file.replace(/.*\//, "");
				ext = fullname.replace(/.*\./, "");
				if (ext && (ext.length > 0)) {
					return ext;
				}
			}
		}
		return "krn";
	}

	if (beginning.match(/group memberships:/i)) {
		// MuseData
		return ".msd";
	}

	return "txt";
}



//////////////////////////////
//
// dataIsHumdrum -- Returns true if the input text (or text from
//    the editor if no text given as input) is Humdrum data or not.
//

function dataIsHumdrum(data) {
	if (!data) {
		data = getTextFromEditor();
	}
	if (data.match(/^\s*[!*]/)) {
		return true;
	} else {
		return false;
	}
}



//////////////////////////////
//
// dataIsXml -- Returns true if the input text (or text from
//     the editor if no text given as input) is XML data or not.
//

function dataIsXml(data) {
	if (!data) {
		data = getTextFromEditor();
	}
	if (data.match(/^\s*<\?xml\b/)) {
		return true;
	} else {
		return false;
	}
}



//////////////////////////////
//
// trimTabs -- also removes blank lines and tabs from inside of reference records.
//

function trimTabs(data) {
	var lines = data.split(/\r?\n/);
	var output = "";
	for (var i=0; i<lines.length; i++) {
		let line = lines[i].replace(/\t+$/, "");
		if (line.match(/^\s*$/)) {
			// ignoring blank lines
			continue;
		}
		if (line.match(/^!!![^\s]+:\t/)) {
			line = line.replace(/\t/, " ");
		}
		output += line + "\n";
	}
	return output;
}



//////////////////////////////
//
// trimTabsInEditor -- remove trailing tabs on text lines in
//    editor.  Also removes empty lines.
//

function trimTabsInEditor(text) {
	if (!text) {
		text = getTextFromEditor();
	}
	if (!text) {
		console.log("No content to convert to Humdrum");
		return;
	}
	
	var newtext = trimTabs(text);
	setTextInEditor(newtext);
}



////////////////////////////////////////////////////////////////////////////
//
//  Base64 encode/decode: Fixes problems with atob and btoa with UTF-8 encoded text.
//
//  https://www.webtoolkit.info
//

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));

			if (i < input.length) {
				enc2 = this._keyStr.indexOf(input.charAt(i++));
			} else {
				enc2 = 64;
			}

			if (i < input.length) {
				enc3 = this._keyStr.indexOf(input.charAt(i++));
			} else {
				enc3 = 64;
			}

			if (i < input.length) {
				enc4 = this._keyStr.indexOf(input.charAt(i++));
			} else {
				enc4 = 64;
			}

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}



//////////////////////////////
//
// convertDataToTsv --
//

function convertDataToTsv(lines) {
	var output = "";
	for (var i=0; i<lines.length; i++) {
		output += convertLineToTsv(lines[i]) + "\n";
	}
	return output;
}



//////////////////////////////
//
// convertDataToCsv --
//

function convertDataToCsv(lines) {
	var output = "";
	for (var i=0; i<lines.length; i++) {
		output += convertLineToCsv(lines[i]) + "\n";
	}
	return output;
}



//////////////////////////////
//
// convertLineToTsv --
//

function convertLineToTsv(line) {
	var chars = line.split("");
	var output = "";
	if (chars.length < 1) {
		return output;
	}
	var inquote = 0;

	if ((chars.length >= 2) && (chars[0] == '!') && (chars[1] == '!')) {
		// Global commands and reference records which do not start with a
		// quote are considered to be literal.
		return line;
	}

	var separator = ",";

	for (var i=0; i<chars.length; i++) {

		if ((chars[i] == '"') && !inquote) {
			inquote = 1;
			continue;
		}
		if (inquote && (chars[i] == '"') && (chars[i+1] == '"')
				&& (i < chars.length-1)) {
			output += '"';
			i++;
			continue;
		}
		if (chars[i] == '"') {
			inquote = 0;
			continue;
		}
		if ((!inquote) && (line.substr(i, separator.length) == separator)) {
			output += '\t';
			i += separator.length - 1;
			continue;
		}
		output += chars[i];
	}
	return output;
}



//////////////////////////////
//
// convertLineToCsv --
//

function convertLineToCsv(line) {
	if (line.match(/^!!/)) {
		return line;
	}
	// Using \t rather than \t to preserve tabs
	var tokens = line.split(/\t/);
	var output = "";
	for (var i=0; i<tokens.length; i++) {
		output += convertTokenToCsv(tokens[i]);
		if (i<tokens.length-1) {
			output += ",";
		}
	}
	return output;
}



//////////////////////////////
//
// convertTokenToCsv --
//

function convertTokenToCsv(token) {
	var output = "";
	if (token.match(/,/) || token.match(/"/)) {
		output += '"';
		output += token.replace(/"/g, '""');
		output += '"';
		return output;
	} else {
		return token;
	}
}



