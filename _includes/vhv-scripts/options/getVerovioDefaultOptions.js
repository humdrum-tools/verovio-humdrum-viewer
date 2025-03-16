

//////////////////////////////
//
// getVerovioDefaultOptions --
//

function getVerovioDefaultOptions() {
	let output = {};
	if (!VEROVIOOPTIONS) {
		return output;
	}
	var options = VEROVIOOPTIONS.OPTION;
	for (let i=0; i<options.length; i++) {
		if (typeof options[i].DEF !== "undefined") {
			if (typeof (options[i].NAME !== "undefined")) {
				if (typeof options[i].CLI_ONLY !== "undefined") {
					if (options[i].CLI_ONLY !== "true") {
						output[options[i].NAME] = options[i].DEF;
					}
				}
			}
		}
	}
	return output;
}
