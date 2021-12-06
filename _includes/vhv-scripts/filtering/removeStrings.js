
//////////////////////////////
//
// removeStrings -- Used to remove option strings for filter commands
//    so that pipe characters in strings are not confused with
//    pipe special characters.
//

function removeStrings(input) {
	let output = "";
	let singleQuote = 0;
	let doubleQuote = 0;
	let lastchar = "";
	let currchar = "";
	for (let i=0; i<input.length; i++) {
		lastchar = currchar;
		currchar = input.charAt(i);
		if (singleQuote) {
			if (currchar === "'") {
				if (lastchar !== "\\") {
					singleQuote = 0;
				}
			}
			continue;
		}
		if (doubleQuote) {
			if (currchar === "'") {
				if (lastchar !== "\\") {
					doubleQuote = 0;
				}
			}
			continue;
		}
		if ((currchar === "'") && (lastchar !== "\\")) {
			singleQuote = 1;
			continue;
		}
		if ((currchar === '"') && (lastchar !== "\\")) {
			doubleQuote = 1;
			continue;
		}
		output += currchar;
	}
	return output;
}


