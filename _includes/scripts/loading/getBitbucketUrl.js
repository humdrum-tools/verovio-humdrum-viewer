

//////////////////////////////
//
// getBitbucketUrl --
//
// http://verovio.humdrum.org/?file=bitbucket:musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03
// https://bitbucket.org/musedata/beethoven/raw/master/bhl/qrtet/op18no5/stage2/01/03
//

function getBitbucketUrl(file, measures) {
	file = file.replace(/^(bb|bitbucket):/, "");

	var username = "";
	var repository = "";
	var pathandfile = "";
	var url = "";

	url = "https://bitbucket.org/";
	matches = file.match("^\/?([^\/]+)\/([^\/]+)\/(.*)");
	if (matches) {
		username    = matches[1];
		repository  = matches[2];
		pathandfile = matches[3];
	}
	url += username;
	url += "/";
	url += repository;
	url += "/raw/master/";
	url += pathandfile;

	var key = pathandfile;

	return {url: url, key: key};
}



