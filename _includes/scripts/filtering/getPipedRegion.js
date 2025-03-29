

//////////////////////////////
//
// getPipedRegion --
//

function getPipedRegion(ftext, fstart) {
	if (!ftext) {
		return "";
	}
	let pstart = -1;
	let pend = -1;
	for (let i=fstart; i>=0; i--) {
		if (ftext.charAt(i) === "|") {
			pstart = i+1;
			break;
		}
	}
	let text = ftext;
	if (pstart >= 0) {
		text = text.substring(pstart);
	}
	text = text.replace(/\|.*/, "");
	return text;
}


