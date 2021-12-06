

//////////////////////////////
//
// deactivateFilterInToolbar -- If the filter toolbar has an active filter,
//     then stop it.  This means to turn of the filter icon highlight
//     and clear the contents of the GLOBALFILTER variable.
//

function deactivateFilterInToolbar() {
	hideFilterLinkIcon();
	updateFilterState();
}


