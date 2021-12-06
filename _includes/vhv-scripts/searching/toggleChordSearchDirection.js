


//////////////////////////////
//
// toggleChordSearchDirection --
//

function toggleChordSearchDirection() {
	var helement = document.querySelector("#search-chord");
	if (!helement) {
		console.log("CANNOT FIND HAND ICONS");
		return;
	}
	var output = "";
	if (SEARCHCHORDDIRECTION === "chord -d") {
		SEARCHCHORDDIRECTION = "chord -u";
		output = '<div title="Melodically searching lowest note of chord" class="nav-icon fa fa-hand-o-down"></div>';
	} else{
		SEARCHCHORDDIRECTION = "chord -d";
		output = '<div title="Melodically searching highest note of chord" class="nav-icon fa fa-hand-o-up"></div>';
	}
	helement.innerHTML = output;
	displayNotation();
}


