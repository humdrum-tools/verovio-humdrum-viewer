

//////////////////////////////
//
// clearMatchInfo -- if there is no queries in the search toolbar,
//    then clear any old search results.
//

function clearMatchInfo() {
	var esearch = document.querySelector("#search-results");
	if (!esearch) {
		return;
	}
	esearch.innerHTML = "Search";
	hideSearchLinkIcon();
}


