


//////////////////////////////
//
// loadFontResource -- use font from file in pdf, returns promise
//

function loadFontResource(pdf, name, path) {
	var promise = new RSVP.Promise(function(resolve, reject) {

		var client = new XMLHttpRequest();
		client.open("GET", path);
		client.responseType = "arraybuffer";

		client.onreadystatechange = function() {
			if (this.readyState === this.DONE) {
				if (this.status === 200) {
					resolve(this.response);
				} else {
					reject(this);
				};
			}
		};

		client.send(null);
	});

	return promise.then(function(data) {
		pdf.registerFont(name, data);
		return true;
	});
}


