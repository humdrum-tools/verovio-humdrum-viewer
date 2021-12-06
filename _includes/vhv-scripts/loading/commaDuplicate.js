

//////////////////////////////
//
// commaDuplicate --
//

function commaDuplicate(value) {
	var pieces = value.split(/\s*,\s*/);
	var first = pieces[0];
	var matches = first.match(/^(.*\/)([^\/]+)/);
	if (!matches) {
		return value;
	}
	var base = matches[1];
	pieces[0] = matches[2];
	var output = [];
	for (var i=0; i<pieces.length; i++) {
		output.push(base + pieces[i]);
	}
	return output;;
}


