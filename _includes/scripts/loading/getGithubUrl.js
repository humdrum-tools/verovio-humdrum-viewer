


//////////////////////////////
//
// getGithubUrl --
//
// http://verovio.humdrum.org/?file=github:polyrhythm-project/rds-scores
// https://bitbucket.org/musedata/beethoven/raw/master/bhl/qrtet/op18no5/stage2/01/03
//

function getGithubUrl(file, measures) {
console.warn("ENTERING GETGITHUBURL");

	file = file.replace(/^github:\/*/, "");

	var username = "";
	var repository = "";
	var pathandfile = "";
	var url = "";

	url = "https://raw.githubusercontent.com/";
	matches = file.match("^\/*([^\/]+)\/([^\/]+)\/?(.*)");
	if (matches) {
		username    = matches[1];
		repository  = matches[2];
		pathandfile = matches[3];
	}
	url += username;
	url += "/";
	url += repository;
	url += "/master/";
	if (!pathandfile) {
		url += ".ref";
console.warn("GOT HERE JJJ");
		loadIndexFile(url);
		return;
	} else {
		url += pathandfile;
	}

	var key = pathandfile;

	var obj = {url: url, key: key};
	return obj;
}



