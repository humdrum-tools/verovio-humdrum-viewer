


//////////////////////////////
//
// getTassoUrl --
//

function getTassoUrl(file, measures) {
	var filename = file.replace(/\.krn$/, "");;

	var url = "https://josquin.stanford.edu/cgi-bin/tasso?&file=" + filename;
	url += "&a=humdrum";

	var key = filename;
	if (measures) {
		url += "&mm=" + measures;
		key += "&mm=" + measures;
	}

	return {url: url, key: key};
}
