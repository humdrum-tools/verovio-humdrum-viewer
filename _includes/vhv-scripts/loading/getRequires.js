


//////////////////////////////
//
// getRequires -- Convert a comma-construct for URL into a list of files to download.
//

function getRequires(url, key) {
	var expire = 172;
	var listing;
	if (!key.match(/,/)) {
		listing = [{
			url: url,
			key: key,
			expire: expire,
			execute: false
		}];
		return listing;
	}

	// Input represents multiple files, such as
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03,04
	// should expand to two files:
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/04

	var urls = commaDuplicate(url);
	var keys = commaDuplicate(key);

	listing = [];
	for (var i=0; i<urls.length; i++) {
		listing.push({
			url: urls[i],
			key: keys[i],
			expire: expire,
			execute: false
		});
	}
	return listing;
}


