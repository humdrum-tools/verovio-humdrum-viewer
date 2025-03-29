



//////////////////////////////
//
// applyUrlAliases --
//
//

function applyUrlAliases(file) {
	if (!file) {
		return file;
	}
	var matches;

	// Github web interface URL:
	//    https://github.com/josquin-research-project/Ock/blob/master/Ock2002-Ave_Maria.krn
	// Maps to the raw data associated with that page:
	//    https://raw.githubusercontent.com/josquin-research-project/Ock/master/Ock2002-Ave_Maria.krn
	matches = file.match(/https:\/\/github.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)/);
	if (matches) {
		var user = matches[1];
		var repertory = matches[2];
		var commit = matches[3];
		var path = matches[4];
		file = "https://raw.githubusercontent.com/" + user + "/" + repertory + "/";
		file += commit + "/" + path;
	}

	return file;
}

