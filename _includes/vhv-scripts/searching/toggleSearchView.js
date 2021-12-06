

//////////////////////////////
//
// toggleSearchView --
//

function toggleSearchView() {
	var selement = document.querySelector("#search-zoom");
	if (!selement) {
		console.log("CANNOT FIND SEARCH VIEW ICON");
		return;
	}
	var output = "";
	if (BRIEFSEARCHVIEW) {
		BRIEFSEARCHVIEW = "";
		output = '<div title="Show only measures with matches" class="nav-icon fa fa-search-minus"></div>';
	} else {
		BRIEFSEARCHVIEW = "myank -d --marks";
		output = '<div title="Show entire score with matches" class="nav-icon fa fa-search-plus"></div>';
	}
	selement.innerHTML = output;
	displayNotation();
}
